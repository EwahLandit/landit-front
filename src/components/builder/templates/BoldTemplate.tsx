import React from 'react';
import { SiteContent } from '../../../context/SiteContext';

interface Props {
  content: SiteContent;
}

export default function BoldTemplate({ content }: Props) {
  const accent = content.accent_color || '#0057ff';

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <style>{`
        .bold-nav { display: flex; align-items: center; justify-content: space-between; padding: 24px 48px; position: relative; z-index: 10; }
        .bold-brand { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.1rem; letter-spacing: .08em; text-transform: uppercase; color: #fff; }
        .bold-nav-btn { padding: 10px 22px; border-radius: 6px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: .85rem; color: #fff; cursor: pointer; border: 1.5px solid rgba(255,255,255,.25); background: transparent; transition: background .2s; }
        .bold-hero { padding: 100px 48px 80px; position: relative; overflow: hidden; }
        .bold-hero::before {
          content: '';
          position: absolute;
          top: -200px; right: -200px;
          width: 600px; height: 600px;
          border-radius: 50%;
          opacity: .15;
          filter: blur(80px);
          pointer-events: none;
        }
        .bold-eyebrow { display: inline-block; font-size: .72rem; font-family: 'Syne', sans-serif; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; padding: 6px 14px; border-radius: 4px; margin-bottom: 24px; }
        .bold-h1 { font-family: 'Syne', sans-serif; font-size: clamp(3rem, 8vw, 6rem); font-weight: 800; letter-spacing: -.05em; line-height: .95; margin-bottom: 28px; max-width: 800px; }
        .bold-h1 em { font-style: normal; }
        .bold-subtitle { font-size: 1.05rem; color: rgba(255,255,255,.6); max-width: 500px; line-height: 1.7; margin-bottom: 40px; }
        .bold-btns { display: flex; gap: 14px; flex-wrap: wrap; }
        .bold-btn-primary { padding: 16px 32px; border-radius: 6px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: .9rem; color: #fff; cursor: pointer; border: none; transition: transform .2s, box-shadow .2s; }
        .bold-btn-primary:hover { transform: translateY(-2px); }
        .bold-btn-ghost { padding: 16px 32px; border-radius: 6px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: .9rem; cursor: pointer; background: transparent; border: 1.5px solid rgba(255,255,255,.2); color: rgba(255,255,255,.8); transition: border-color .2s; }
        .bold-btn-ghost:hover { border-color: rgba(255,255,255,.5); }
        .bold-ticker { overflow: hidden; border-top: 1px solid rgba(255,255,255,.08); border-bottom: 1px solid rgba(255,255,255,.08); padding: 16px 0; margin: 60px 0; }
        .bold-ticker-track { display: flex; gap: 48px; white-space: nowrap; animation: ticker 14s linear infinite; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .bold-ticker-item { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .75rem; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.3); }
        .bold-features { padding: 60px 48px; }
        .bold-feat-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 48px; gap: 24px; flex-wrap: wrap; }
        .bold-feat-title { font-family: 'Syne', sans-serif; font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800; letter-spacing: -.04em; max-width: 400px; }
        .bold-feat-subtitle { font-size: .9rem; color: rgba(255,255,255,.5); max-width: 300px; margin-top: 8px; line-height: 1.6; }
        .bold-feat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2px; }
        .bold-feat-card { padding: 32px; border: 1px solid rgba(255,255,255,.07); transition: background .2s; background: rgba(255,255,255,.02); }
        .bold-feat-card:hover { background: rgba(255,255,255,.04); }
        .bold-feat-icon { font-size: 2.4rem; margin-bottom: 20px; }
        .bold-feat-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; margin-bottom: 8px; }
        .bold-feat-desc { font-size: .85rem; color: rgba(255,255,255,.5); line-height: 1.6; }
        .bold-about { padding: 80px 48px; display: flex; align-items: center; gap: 60px; flex-wrap: wrap; border-top: 1px solid rgba(255,255,255,.06); }
        .bold-about-label { font-family: 'Syne', sans-serif; font-size: .72rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.4); margin-bottom: 16px; }
        .bold-about-title { font-family: 'Syne', sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; letter-spacing: -.03em; margin-bottom: 20px; flex: 1; min-width: 260px; }
        .bold-about-text { font-size: .95rem; color: rgba(255,255,255,.55); line-height: 1.8; flex: 1; min-width: 260px; }
        .bold-cta { margin: 0 48px 80px; border-radius: 20px; padding: 60px 48px; text-align: center; position: relative; overflow: hidden; }
        .bold-cta-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800; letter-spacing: -.04em; color: #fff; margin-bottom: 14px; }
        .bold-cta-text { color: rgba(255,255,255,.7); margin-bottom: 32px; font-size: .95rem; }
        .bold-footer { padding: 24px 48px; border-top: 1px solid rgba(255,255,255,.06); text-align: center; font-size: .78rem; color: rgba(255,255,255,.25); }
      `}</style>

      {/* NAV */}
      <nav className="bold-nav">
        <span className="bold-brand">{content.brand_name}</span>
        <button className="bold-nav-btn">{content.hero_cta}</button>
      </nav>
      
      {/* HERO */}
      <div className="bold-hero">
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: accent, opacity: .15, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <span className="bold-eyebrow" style={{ background: `${accent}22`, color: accent }}>
          ✦ {content.brand_tagline}
        </span>
        <h1 className="bold-h1">
          {content.hero_title.split(' ').map((word, i) =>
            i % 3 === 1 ? <em key={i} style={{ color: accent }}>{word} </em> : `${word} `
          )}
        </h1>
        <p className="bold-subtitle">{content.hero_subtitle}</p>
        <div className="bold-btns">
          <button className="bold-btn-primary" style={{ background: accent }}>
            {content.hero_cta}
          </button>
          <button className="bold-btn-ghost">{content.hero_secondary_cta}</button>
        </div>
      </div>

      {/* TICKER */}
      <div className="bold-ticker">
        <div className="bold-ticker-track">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="bold-ticker-item">
              {content.brand_name} ✦ {content.brand_tagline} ✦
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div className="bold-features">
        <div className="bold-feat-head">
          <div>
            <h2 className="bold-feat-title">{content.features_title}</h2>
          </div>
          <p className="bold-feat-subtitle">{content.hero_subtitle}</p>
        </div>
        <div className="bold-feat-grid">
          {content.features.map((feat, i) => (
            <div key={i} className="bold-feat-card">
              <div className="bold-feat-icon">{feat.icon}</div>
              <div className="bold-feat-name">{feat.title}</div>
              <div className="bold-feat-desc">{feat.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <div className="bold-about">
        <div style={{ flex: 1, minWidth: 260 }}>
          <div className="bold-about-label">{content.about_title}</div>
          <h2 className="bold-about-title" style={{ color: '#fff' }}>
            {content.about_title}
          </h2>
        </div>
        <p className="bold-about-text">{content.about_text}</p>
      </div>

      {/* CTA */}
      <div className="bold-cta" style={{ background: `linear-gradient(135deg, ${accent}33, ${accent}11)`, border: `1px solid ${accent}33` }}>
        <h2 className="bold-cta-title">{content.cta_section_title}</h2>
        <p className="bold-cta-text">{content.cta_section_text}</p>
        <button className="bold-btn-primary" style={{ background: accent }}>
          {content.cta_section_btn}
        </button>
      </div>

      {/* FOOTER */}
      <div className="bold-footer">{content.footer_text}</div>
    </div>
  );
}
