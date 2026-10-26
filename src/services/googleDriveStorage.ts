import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from './firebaseClient';
import { Consultant, DayKeywordPreset, Itinerary } from '../types/itinerary';
import { PlacePackage, Quotation, AppSettings } from '../types/placePackage';

export { auth };

export const AUTHORIZED_EMAILS = [
  'royaltoursofficial@gmail.com',
  'sbsanjaikumar02@gmail.com',
];

export const AUTHORIZED_EMAIL = AUTHORIZED_EMAILS[0];

export const isEmailAuthorized = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return AUTHORIZED_EMAILS.some((auth) => auth.toLowerCase().trim() === clean);
};

const provider = new GoogleAuthProvider();
// Scopes for Google Drive file storage and identity verification
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.appdata');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Force select account prompt so administrator can switch if multiple Google accounts are active in browser
provider.setCustomParameters({
  prompt: 'select_account',
});

// In-memory access token cache (CRITICAL: Do NOT store in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;
let driveDatabaseFileId: string | null = null;
let lastKnownRemoteTimestamp: string | null = null;

export interface StudioDatabasePayload {
  version: string;
  lastUpdated: string;
  quotations: Quotation[];
  placePackages: PlacePackage[];
  settings: AppSettings;
  itineraries: Itinerary[];
  consultants: Consultant[];
  keywords?: DayKeywordPreset[];
}

export const initGoogleAuth = (
  onSuccess: (user: User, token: string) => void,
  onSignedOut: () => void,
  onUnauthorized?: (unauthorizedEmail: string) => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const email = user.email?.toLowerCase().trim();
      if (!isEmailAuthorized(email)) {
        console.warn(`[Auth] Rejecting unauthorized account: ${email}`);
        await signOut(auth);
        cachedAccessToken = null;
        driveDatabaseFileId = null;
        if (onUnauthorized) onUnauthorized(user.email || '');
        onSignedOut();
        return;
      }

      if (cachedAccessToken) {
        onSuccess(user, cachedAccessToken);
      }
    } else if (!isSigningIn) {
      cachedAccessToken = null;
      driveDatabaseFileId = null;
      onSignedOut();
    }
  });
};

export const signInWithGoogleDrive = async (): Promise<{
  user: User;
  token: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userEmail = (user.email || '').toLowerCase().trim();

    // AUTHORIZATION ENFORCEMENT
    if (!isEmailAuthorized(userEmail)) {
      await signOut(auth);
      cachedAccessToken = null;
      driveDatabaseFileId = null;
      throw new Error(
        `Access Restricted: This Google account (${user.email}) is not authorized to access Royal Tours. Please sign in with the official Royal Tours administrator account.`
      );
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token from Google');
    }

    cachedAccessToken = credential.accessToken;
    return { user, token: cachedAccessToken };
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user' || error?.message?.includes('popup-closed-by-user')) {
      return null;
    }
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const signOutGoogleDrive = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  driveDatabaseFileId = null;
  lastKnownRemoteTimestamp = null;
};

export const getCachedAccessToken = () => cachedAccessToken;

/**
 * Finds or creates the main "royal_tours_database.json" in user's Google Drive
 */
export const getOrCreateDriveDatabaseFileId = async (
  token: string
): Promise<string> => {
  if (driveDatabaseFileId) return driveDatabaseFileId;

  const fileName = 'royal_tours_database.json';
  const query = encodeURIComponent(`name = '${fileName}' and trashed = false`);
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime)`;

  const searchRes = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!searchRes.ok) {
    throw new Error(`Failed to query Google Drive: ${searchRes.statusText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    driveDatabaseFileId = searchData.files[0].id;
    return driveDatabaseFileId!;
  }

  // File doesn't exist yet: Create it
  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    description: 'ROYAL TOURS Luxury Travel Studio primary database storage file across all devices',
  };

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!createRes.ok) {
    throw new Error(`Failed to create Google Drive database file: ${createRes.statusText}`);
  }

  const createdFile = await createRes.json();
  driveDatabaseFileId = createdFile.id;
  return driveDatabaseFileId!;
};

/**
 * Saves full app database into Google Drive
 */
export const syncDatabaseToGoogleDrive = async (
  token: string,
  payload: Omit<StudioDatabasePayload, 'version' | 'lastUpdated'> & {
    version?: string;
    lastUpdated?: string;
  }
): Promise<{ success: boolean; fileId: string; timestamp: string }> => {
  const fileId = await getOrCreateDriveDatabaseFileId(token);
  const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;

  const nowIso = new Date().toISOString();
  const updatedPayload: StudioDatabasePayload = {
    version: '1.2.0',
    lastUpdated: nowIso,
    quotations: payload.quotations || [],
    placePackages: payload.placePackages || [],
    settings: payload.settings,
    itineraries: payload.itineraries || [],
    consultants: payload.consultants || [],
    keywords: payload.keywords || [],
  };

  const res = await fetch(uploadUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedPayload, null, 2),
  });

  if (!res.ok) {
    throw new Error(`Failed to upload to Google Drive: ${res.statusText}`);
  }

  lastKnownRemoteTimestamp = nowIso;
  return {
    success: true,
    fileId,
    timestamp: nowIso,
  };
};

/**
 * Loads full database payload from Google Drive
 */
export const fetchDatabaseFromGoogleDrive = async (
  token: string
): Promise<StudioDatabasePayload | null> => {
  const fileId = await getOrCreateDriveDatabaseFileId(token);
  const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  const res = await fetch(downloadUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch from Google Drive: ${res.statusText}`);
  }

  const text = await res.text();
  if (!text || text.trim() === '') return null;

  try {
    const data = JSON.parse(text) as StudioDatabasePayload;
    if (data.lastUpdated) {
      lastKnownRemoteTimestamp = data.lastUpdated;
    }
    return data;
  } catch (err) {
    console.warn('Google Drive database file was empty or not valid JSON, returning null:', err);
    return null;
  }
};

/**
 * Checks if remote file on Google Drive has been updated by another device
 */
export const checkRemoteUpdatesAvailable = async (
  token: string,
  currentLocalTimestamp?: string | null
): Promise<{ hasNewerVersion: boolean; remoteTimestamp: string | null }> => {
  try {
    const fileId = await getOrCreateDriveDatabaseFileId(token);
    // Fetch file metadata with modifiedTime
    const metaRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,modifiedTime`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    if (!metaRes.ok) return { hasNewerVersion: false, remoteTimestamp: null };

    const meta = await metaRes.json();
    const remoteTime = meta.modifiedTime;

    if (!remoteTime) return { hasNewerVersion: false, remoteTimestamp: null };

    if (!currentLocalTimestamp) {
      return { hasNewerVersion: true, remoteTimestamp: remoteTime };
    }

    const localDate = new Date(currentLocalTimestamp).getTime();
    const remoteDate = new Date(remoteTime).getTime();

    // If remote file is newer by at least 2 seconds (to account for local clock skew)
    const hasNewerVersion = remoteDate - localDate > 2000;
    return { hasNewerVersion, remoteTimestamp: remoteTime };
  } catch (err) {
    console.warn('Failed to check remote updates:', err);
    return { hasNewerVersion: false, remoteTimestamp: null };
  }
};
