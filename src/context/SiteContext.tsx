import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type TemplateId = 'modern' | 'minimal' | 'bold';

const API_BASE = 'http://localhost:8000';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface SiteContent {
  hero_title: string;
  hero_subtitle: string;
  hero_cta: string;
  hero_secondary_cta: string;
  brand_name: string;
  brand_tagline: string;
  accent_color: string;
  about_title: string;
  about_text: string;
  features_title: string;
  features: FeatureItem[];
  cta_section_title: string;
  cta_section_text: string;
  cta_section_btn: string;
  footer_text: string;
}

export interface SiteData {
  id: number;
  templateId: TemplateId;
  slug: string;
  content: SiteContent;
  seo_score: number;
  speed_score: number;
  accessibility_score: number;
  domains: { id: number; name: string; type: string }[];
  vitals: { lcp: string; fid: string; cls: string; timestamp: string }[];
}

export const DEFAULT_CONTENT: SiteContent = {
  hero_title: 'Tu Título Principal Aquí',
  hero_subtitle: 'Describe tu propuesta de valor en una sola oración clara y atractiva.',
  hero_cta: 'Comenzar Ahora',
  hero_secondary_cta: 'Ver Demo',
  brand_name: 'Mi Marca',
  brand_tagline: 'Tu tagline aquí',
  accent_color: '#0057ff',
  about_title: '¿Por qué elegirnos?',
  about_text: 'Somos el equipo detrás de la solución que tu negocio necesita. Con años de experiencia y un enfoque centrado en resultados.',
  features_title: 'Todo lo que necesitas',
  features: [
    { icon: '🚀', title: 'Rápido y Eficiente', description: 'Resultados en tiempo récord sin comprometer la calidad.' },
    { icon: '🎯', title: 'Enfocado en Resultados', description: 'Cada decisión está orientada a maximizar tu ROI.' },
    { icon: '🔒', title: 'Seguro y Confiable', description: 'Tu información y la de tus clientes siempre protegida.' },
  ],
  cta_section_title: '¿Listo para empezar?',
  cta_section_text: 'Únete a cientos de clientes que ya están creciendo con nosotros.',
  cta_section_btn: 'Empezar Gratis',
  footer_text: '© 2026 Mi Marca. Todos los derechos reservados.',
};

interface SiteContextType {
  siteData: SiteData | null;
  setSiteData: (data: SiteData) => void;
  updateContent: (key: keyof SiteContent, value: SiteContent[keyof SiteContent]) => void;
  updateFeature: (index: number, field: keyof FeatureItem, value: string) => void;
  saveSite: () => Promise<void>;
  loadSite: () => Promise<void>;
  createSite: (templateId: string, slug: string, content?: any) => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteDataState] = useState<SiteData | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem('landit-token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const loadSite = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/websites/me`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSiteDataState(data);
      }
    } catch (err) {
      console.error('Error loading site:', err);
    }
  }, []);

  const createSite = async (templateId: string, slug: string, content?: any) => {
    try {
      const res = await fetch(`${API_BASE}/websites`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          template_id: templateId,
          slug,
          content: content ?? DEFAULT_CONTENT
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSiteDataState(data);
      }
    } catch (err) {
      console.error('Error creating site:', err);
    }
  };

  const saveSite = async () => {
    if (!siteData) return;
    try {
      const res = await fetch(`${API_BASE}/websites/${siteData.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          content: siteData.content,
          template_id: siteData.templateId
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSiteDataState(data);
      }
    } catch (err) {
      console.error('Error saving site:', err);
    }
  };

  const updateContent = (key: keyof SiteContent, value: SiteContent[keyof SiteContent]) => {
    setSiteDataState(prev => {
      if (!prev) return prev;
      return { ...prev, content: { ...prev.content, [key]: value } };
    });
  };

  const updateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    setSiteDataState(prev => {
      if (!prev) return prev;
      const newFeatures = [...prev.content.features];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      return { ...prev, content: { ...prev.content, features: newFeatures } };
    });
  };

  return (
    <SiteContext.Provider value={{ 
      siteData, 
      setSiteData: setSiteDataState, 
      updateContent, 
      updateFeature, 
      saveSite, 
      loadSite,
      createSite
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
