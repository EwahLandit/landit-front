import React from 'react';
import { SiteContent } from '../../../context/SiteContext';

interface Props {
  content: SiteContent;
}

export default function ModernTemplate({ content }: Props) {
  const accent = content.accent_color || '#0057ff';

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f9f9f8', minHeight: '100vh', color: '#111' }}>
      <style>{`
        .mt-hero { background: linear-gradient(135deg, #fff 0%, #f0f4ff 100%); padding: 80px 40px; text-align: center; }
        .mt-nav { display: flex; align-items: center; justify-content: space-between; max-width: 1100px; margin: 0 auto 60px; }
        .mt-brand { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem; letter-spacing: .06em; color: #111; }
        .mt-brand-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-left: 4px; vertical-align: middle; }
        .mt-nav-btn { padding: 10px 22px; border-radius: 9999px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: .85rem; cursor: pointer; }
        .mt-hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 9999px; font-size: .75rem; font-weight: 700; font-family: 'Syne', sans-serif; margin-bottom: 28px; }
        .mt-h1 { font-family: 'Syne', sans-serif; font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 800; letter-spacing: -.04em; line-height: 1.1; margin-bottom: 20px; max-width: 700px; margin-left: auto; margin-right: auto; }
        .mt-subtitle { font-size: 1.1rem; color: #555; max-width: 520px; margin: 0 auto 36px; line-height: 1.6; }
        .mt-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .mt-btn-primary { padding: 14px 28px; border-radius: 9999px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: .9rem; color: #fff; cursor: pointer; border: none; }
        .mt-btn-outline { padding: 14px 28px; border-radius: 9999px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: .9rem; cursor: pointer; background: transparent; }
        .mt-features { padding: 80px 40px; background: #fff; }
        .mt-features-inner { max-width: 1100px; margin: 0 auto; }
        .mt-section-title { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; letter-spacing: -.03em; text-align: center; margin-bottom: 12px; }
        .mt-section-sub { text-align: center; color: #777; margin-bottom: 52px; font-size: .95rem; }
        .mt-feat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 28px; }
        .mt-feat-card { background: #f9f9f8; border-radius: 16px; padding: 28px; border: 1px solid rgba(0,0,0,.06); transition: transform .2s; }
        .mt-feat-icon { font-size: 2rem; margin-bottom: 16px; }
        .mt-feat-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; margin-bottom: 8px; }
        .mt-feat-desc { font-size: .875rem; color: #666; line-height: 1.6; }
        .mt-about { padding: 80px 40px; }
        .mt-about-inner { max-width: 700px; margin: 0 auto; text-align: center; }
        .mt-about-title { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; margin-bottom: 20px; }
        .mt-about-text { font-size: 1rem; color: #555; line-height: 1.8; }
        .mt-cta { padding: 80px 40px; text-align: center; }
        .mt-cta-box { max-width: 700px; margin: 0 auto; border-radius: 24px; padding: 60px 40px; }
        .mt-cta-title { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 12px; }
        .mt-cta-text { color: rgba(255,255,255,.8); margin-bottom: 28px; font-size: .95rem; }
        .mt-footer { padding: 28px 40px; border-top: 1px solid rgba(0,0,0,.08); text-align: center; font-size: .8rem; color: #999; }
      `}</style>

      {/* NAV */}
      <div className="mt-hero">
        <nav className="mt-nav">
          <span className="mt-brand">
            {content.brand_name}
            <span className="mt-brand-dot" style={{ background: accent }} />
          </span>
          <button className="mt-btn-primary mt-nav-btn" style={{ background: accent }}>
            {content.hero_cta}
          </button>
        </nav>

        {/* HERO */}
        <div className="mt-hero-badge" style={{ background: `${accent}18`, color: accent }}>
          ✨ {content.brand_tagline}
        </div>
        <h1 className="mt-h1">{content.hero_title}</h1>
        <p className="mt-subtitle">{content.hero_subtitle}</p>
        <div className="mt-btns">
          <button className="mt-btn-primary" style={{ background: accent }}>
            {content.hero_cta}
          </button>
          <button className="mt-btn-outline" style={{ border: `1.5px solid ${accent}`, color: accent }}>
            {content.hero_secondary_cta}
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div className="mt-features">
        <div className="mt-features-inner">
          <h2 className="mt-section-title">{content.features_title}</h2>
          <p className="mt-section-sub">{content.hero_subtitle}</p>
          <div className="mt-feat-grid">
            {content.features.map((feat, i) => (
              <div key={i} className="mt-feat-card">
                <div className="mt-feat-icon">{feat.icon}</div>
                <div className="mt-feat-title">{feat.title}</div>
                <div className="mt-feat-desc">{feat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="mt-about">
        <div className="mt-about-inner">
          <h2 className="mt-about-title">{content.about_title}</h2>
          <p className="mt-about-text">{content.about_text}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-cta">
        <div className="mt-cta-box" style={{ background: `linear-gradient(135deg, ${accent} 0%, #003de0 100%)` }}>
          <h2 className="mt-cta-title">{content.cta_section_title}</h2>
          <p className="mt-cta-text">{content.cta_section_text}</p>
          <button className="mt-btn-primary" style={{ background: '#fff', color: accent }}>
            {content.cta_section_btn}
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-footer">{content.footer_text}</div>
    </div>
  );
}
