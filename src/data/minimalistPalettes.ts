import { PdfThemeSettings } from '../types/placePackage';

export interface MinimalistPalette {
  id: string;
  name: string;
  category: 'Light' | 'Warm & Natural' | 'Dark & Nocturnal' | 'Monochrome';
  description: string;
  theme: PdfThemeSettings;
  previewColors: {
    bg: string;
    card: string;
    accent: string;
    text: string;
  };
}

/**
 * Curated Minimalist Color Patterns and Palettes for Royal Tours continuous brochure quotations.
 * Each palette is precision-tuned for typography hierarchy, micro-contrast, and clean editorial luxury.
 */
export const MINIMALIST_PALETTES: MinimalistPalette[] = [
  {
    id: 'swiss-mono',
    name: 'Swiss Architectural White',
    category: 'Light',
    description: 'Pristine white canvas with sapphire accent and razor-sharp typographic hierarchy.',
    theme: {
      accentColor: '#0070C0',
      headingColor: '#0F172A',
      backgroundColor: '#FFFFFF',
      cardBackground: '#F8FAFC',
      borderColor: '#E2E8F0',
      textColor: '#0F172A',
      secondaryTextColor: '#64748B',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
    previewColors: {
      bg: '#FFFFFF',
      card: '#F8FAFC',
      accent: '#0070C0',
      text: '#0F172A',
    },
  },
  {
    id: 'warm-oat',
    name: 'Warm Oat & Charcoal',
    category: 'Warm & Natural',
    description: 'Tactile natural paper oat surface with refined charcoal lettering and bronze accent.',
    theme: {
      accentColor: '#966E46',
      headingColor: '#1F1C1A',
      backgroundColor: '#FAF8F5',
      cardBackground: '#FFFFFF',
      borderColor: '#EBE5DC',
      textColor: '#1F1C1A',
      secondaryTextColor: '#7A7269',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    },
    previewColors: {
      bg: '#FAF8F5',
      card: '#FFFFFF',
      accent: '#966E46',
      text: '#1F1C1A',
    },
  },
  {
    id: 'nordic-sage',
    name: 'Nordic Pine & Sage',
    category: 'Warm & Natural',
    description: 'Calm Scandinavian botanical tone with muted pine green accents and soft chalk surfaces.',
    theme: {
      accentColor: '#3D634E',
      headingColor: '#1A241E',
      backgroundColor: '#F6F8F5',
      cardBackground: '#FFFFFF',
      borderColor: '#DEE4DC',
      textColor: '#1A241E',
      secondaryTextColor: '#67756B',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    },
    previewColors: {
      bg: '#F6F8F5',
      card: '#FFFFFF',
      accent: '#3D634E',
      text: '#1A241E',
    },
  },
  {
    id: 'desert-terracotta',
    name: 'Desert Sand & Terracotta',
    category: 'Warm & Natural',
    description: 'Sun-warmed linen backdrop with rich artisanal terracotta highlights for luxury resorts.',
    theme: {
      accentColor: '#C05621',
      headingColor: '#2B2118',
      backgroundColor: '#FDFBF7',
      cardBackground: '#F7F3EA',
      borderColor: '#E7DEC9',
      textColor: '#2B2118',
      secondaryTextColor: '#7C6E63',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    },
    previewColors: {
      bg: '#FDFBF7',
      card: '#F7F3EA',
      accent: '#C05621',
      text: '#2B2118',
    },
  },
  {
    id: 'studio-mono',
    name: 'Atelier Pure Monochrome',
    category: 'Monochrome',
    description: 'Gallery-grade high-contrast black & white with bold architectural weight.',
    theme: {
      accentColor: '#18181B',
      headingColor: '#09090B',
      backgroundColor: '#FAFAFA',
      cardBackground: '#FFFFFF',
      borderColor: '#E4E4E7',
      textColor: '#09090B',
      secondaryTextColor: '#71717A',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
    previewColors: {
      bg: '#FAFAFA',
      card: '#FFFFFF',
      accent: '#18181B',
      text: '#09090B',
    },
  },
  {
    id: 'slate-minimal',
    name: 'Cool Slate Horizon',
    category: 'Light',
    description: 'Crisp corporate cool-grey minimalism with indigo-tinted slate blue depth.',
    theme: {
      accentColor: '#334155',
      headingColor: '#0F172A',
      backgroundColor: '#F1F5F9',
      cardBackground: '#FFFFFF',
      borderColor: '#CBD5E1',
      textColor: '#0F172A',
      secondaryTextColor: '#64748B',
      fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
    },
    previewColors: {
      bg: '#F1F5F9',
      card: '#FFFFFF',
      accent: '#334155',
      text: '#0F172A',
    },
  },
  {
    id: 'ref-navy-gold',
    name: 'Reference Midnight Navy',
    category: 'Dark & Nocturnal',
    description: 'The official reference brochure design: deep navy midnight with bright gold accents.',
    theme: {
      accentColor: '#FACC15',
      headingColor: '#FFFFFF',
      backgroundColor: '#080E24',
      cardBackground: '#0C1433',
      borderColor: '#1E2958',
      textColor: '#FFFFFF',
      secondaryTextColor: '#94A3B8',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    },
    previewColors: {
      bg: '#080E24',
      card: '#0C1433',
      accent: '#FACC15',
      text: '#FFFFFF',
    },
  },
  {
    id: 'dark-obsidian-amber',
    name: 'Obsidian & Amber Gold',
    category: 'Dark & Nocturnal',
    description: 'Pure stealth matte black with warm imperial amber for ultra-luxury VIP itineraries.',
    theme: {
      accentColor: '#F59E0B',
      headingColor: '#FFFFFF',
      backgroundColor: '#0B0B0D',
      cardBackground: '#141418',
      borderColor: '#26262D',
      textColor: '#F4F4F5',
      secondaryTextColor: '#A1A1AA',
      fontFamily: "'Cinzel', serif",
    },
    previewColors: {
      bg: '#0B0B0D',
      card: '#141418',
      accent: '#F59E0B',
      text: '#F4F4F5',
    },
  },
  {
    id: 'nocturne-electric',
    name: 'Nocturne Ice Blue',
    category: 'Dark & Nocturnal',
    description: 'Modern cyberpunk-inspired dark minimalist with luminous ice-cyan accents.',
    theme: {
      accentColor: '#38BDF8',
      headingColor: '#FFFFFF',
      backgroundColor: '#0B1120',
      cardBackground: '#131C31',
      borderColor: '#1E2C4D',
      textColor: '#F8FAFC',
      secondaryTextColor: '#94A3B8',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    },
    previewColors: {
      bg: '#0B1120',
      card: '#131C31',
      accent: '#38BDF8',
      text: '#F8FAFC',
    },
  },
  {
    id: 'kyoto-vermilion',
    name: 'Kyoto Washi & Cinnabar',
    category: 'Warm & Natural',
    description: 'Japanese wabi-sabi parchment paper with subtle crimson red cinnabar accents.',
    theme: {
      accentColor: '#A83A32',
      headingColor: '#1A1817',
      backgroundColor: '#F5F2EB',
      cardBackground: '#FAF7F0',
      borderColor: '#DED6C7',
      textColor: '#1A1817',
      secondaryTextColor: '#736D65',
      fontFamily: "'Cormorant Garamond', serif",
    },
    previewColors: {
      bg: '#F5F2EB',
      card: '#FAF7F0',
      accent: '#A83A32',
      text: '#1A1817',
    },
  },
];
