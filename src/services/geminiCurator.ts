import { GoogleGenAI } from '@google/genai';

export interface GeneratedDayPlan {
  title: string;
  activities: string;
  notes: string;
  highlight: string;
}

export async function generateLuxuryDayPlan(params: {
  destination: string;
  dayNumber: number;
  themeOrKeywords?: string;
  region: 'DOM' | 'INTL';
}): Promise<GeneratedDayPlan> {
  const apiKey =
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (import.meta as any).env?.GEMINI_API_KEY ||
    (window as any)?.__ENV__?.GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? (process.env as any)?.GEMINI_API_KEY : '');

  if (!apiKey) {
    // Elegant fallback if no API key is injected
    return {
      title: `${params.destination} Exclusive Private Discovery`,
      activities: `Begin with a sunrise private charter expedition exploring the untamed outer boundaries of ${params.destination}. Continue with bespoke wilderness exploration accompanied by a certified master naturalist. Conclude with an evening private chef table and curated vintage wine tasting under the stars.`,
      notes: `Private transport and safety logistics pre-cleared by our ground expedition director.`,
      highlight: `Exclusive Remote Expedition`,
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a world-renowned luxury adventure expedition designer for ultra-high-net-worth travelers.
Write a bespoke, exclusive, high-end itinerary plan for Day ${params.dayNumber} in: ${params.destination}.
Theme or request keywords: ${params.themeOrKeywords || 'Raw natural beauty, remote exclusivity, high adventure, five-star luxury comfort'}.
Region: ${params.region === 'DOM' ? 'Domestic (India)' : 'International'}.

Respond ONLY with valid JSON with keys:
{
  "title": "A captivating, sleek, editorial title for the day (e.g. Glacier Crevasse Traverse & Champagne Ice Descent)",
  "activities": "3-4 sentences in sophisticated, evocative luxury travel prose describing exclusive morning, afternoon, and evening adventure excursions with private guides, charters, and dining.",
  "notes": "1-2 brief practical luxury expedition notes (e.g., custom fitted crampons, private helicopter corridor, altitude acclimatization, private chef details).",
  "highlight": "Short 2-4 word memorable highlight label"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return {
      title: parsed.title || `Day ${params.dayNumber} in ${params.destination}`,
      activities: parsed.activities || `Private morning exploration of ${params.destination} with dedicated local master naturalist. Evening private dining.`,
      notes: parsed.notes || `All safety and technical expedition gear provided.`,
      highlight: parsed.highlight || `Private Expedition`,
    };
  } catch (error) {
    console.warn('Gemini generation fallback used:', error);
    return {
      title: `${params.destination} Bespoke Wilderness Traverse`,
      activities: `Private dawn departure navigating pristine natural waterways and hidden trails in ${params.destination}. Gourmet field banquet arranged at a secluded scenic viewpoint. Sunset relaxation with private naturalist storytelling.`,
      notes: `Full communication satellite kit and VIP transport on standby.`,
      highlight: `Secluded Wilderness Traverse`,
    };
  }
}
