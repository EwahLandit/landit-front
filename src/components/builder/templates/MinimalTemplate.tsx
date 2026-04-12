import React from 'react';
import { SiteContent } from '../../../context/SiteContext';

interface Props {
  content: SiteContent;
}

export default function MinimalTemplate({ content }: Props) {
  const accent = content.accent_color || '#0057ff';

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#ffffff', minHeight: '100vh', color: '#111' }}>
      <style>{`
        .min-wrap { max-width: 680px; margin: 0 auto; padding: 0 24px; }
        .min-nav { display: flex; align-items: center; justify-content: space-between; padding: 32px 0; border-bottom: 1px solid #eee; margin-bottom: 80px; }
        .min-brand { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; letter-spacing: .08em; text-transform: uppercase; color: #111; }
        .min-nav-link { font-size: .85rem; color: #777; text-decoration: none; font-weight: 500; }
        .min-hero { margin-bottom: 80px; }
        .min-eyebrow { font-size: .72rem; font-family: 'Syne', sans-serif; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 20px; display: block; }
        .min-h1 { font-family: 'Syne', sans-serif; font-size: clamp(2.4rem, 6vw, 3.8rem); font-weight: 800; letter-spacing: -.05em; line-height: 1.05; margin-bottom: 24px; }
        .min-subtitle { font-size: 1rem; color: #555; line-height: 1.8; margin-bottom: 36px; }
        .min-cta-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .min-btn { padding: 12px 24px; border-radius: 8px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: .85rem; cursor: pointer; }
        .min-link { font-size: .85rem; color: #777; text-decoration: underline; cursor: pointer; background: none; border: none; }
        .min-divider { width: 40px; height: 2px; margin: 60px 0; }
        .min-section-title { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 700; letter-spacing: -.02em; margin-bottom: 32px; color: #111; }
        .min-feat-list { display: flex; flex-direction: column; gap: 28px; margin-bottom: 80px; }
        .min-feat-row { display: flex; gap: 20px; align-items: flex-start; }
        .min-feat-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: .72rem; letter-spacing: .08em; width: 28px; flex-shrink: 0; padding-top: 3px; }
        .min-feat-body {}
        .min-feat-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .95rem; margin-bottom: 4px; }
        .min-feat-desc { font-size: .875rem; color: #666; line-height: 1.6; }
        .min-about { margin-bottom: 80px; }
        .min-about-text { font-size: 1rem; color: #444; line-height: 1.9; }
        .min-cta { text-align: center; padding: 60px 0 80px; border-top: 1px solid #eee; }
        .min-cta-title { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; letter-spacing: -.03em; margin-bottom: 12px; }
        .min-cta-text { color: #666; font-size: .95rem; margin-bottom: 28px; }
        .min-footer { padding: 24px 0; border-top: 1px solid #eee; text-align: center; font-size: .78rem; color: #aaa; }
      `}</style>

      <div className="min-wrap">
        {/* NAV */}
        <nav className="min-nav">
          <span className="min-brand">{content.brand_name}</span>
          <button
            className="min-btn"
            style={{ background: accent, color: '#fff', border: 'none' }}
          >
            {content.hero_cta}
          </button>
        </nav>

        {/* HERO */}
        <div className="min-hero">
          <span className="min-eyebrow" style={{ color: accent }}>
            {content.brand_tagline}
          </span>
          <h1 className="min-h1">{content.hero_title}</h1>
          <p className="min-subtitle">{content.hero_subtitle}</p>
          <div className="min-cta-row">
            <button
              className="min-btn"
              style={{ background: accent, color: '#fff', border: 'none' }}
            >
              {content.hero_cta}
            </button>
            <button className="min-link">{content.hero_secondary_cta} →</button>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="min-divider" style={{ background: accent }} />

        {/* FEATURES */}
        <p className="min-section-title">{content.features_title}</p>
        <div className="min-feat-list">
          {content.features.map((feat, i) => (
            <div key={i} className="min-feat-row">
              <span className="min-feat-num" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-feat-body">
                <div className="min-feat-title">
                  {feat.icon} {feat.title}
                </div>
                <div className="min-feat-desc">{feat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ABOUT */}
        <div className="min-about">
          <p className="min-section-title">{content.about_title}</p>
          <p className="min-about-text">{content.about_text}</p>
        </div>

        {/* CTA */}
        <div className="min-cta">
          <h2 className="min-cta-title">{content.cta_section_title}</h2>
          <p className="min-cta-text">{content.cta_section_text}</p>
          <button
            className="min-btn"
            style={{ background: accent, color: '#fff', border: 'none', padding: '14px 32px' }}
          >
            {content.cta_section_btn}
          </button>
        </div>

        {/* FOOTER */}
        <div className="min-footer">{content.footer_text}</div>
      </div>
    </div>
  );
}
