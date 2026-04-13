'use client'
import Footer from "@/app/Components/Footer/page";
import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ar-root {
    font-family: 'Rajdhani', sans-serif;
    background: #0f0f0f;
    color: #e8e8e8;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* HEADER */
  .ar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 60px;
    background: rgba(15,15,15,0.96);
    border-bottom: 1px solid rgba(255,122,0,0.18);
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    backdrop-filter: blur(8px);
    transition: box-shadow 0.3s;
  }
  .ar-header.scrolled {
    box-shadow: 0 4px 40px rgba(0,0,0,0.6);
  }
  .ar-logo {
    font-family: 'Orbitron', sans-serif;
    font-size: 22px;
    font-weight: 900;
    color: #ff7a00;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-decoration: none;
  }
  .ar-logo span { color: #e8e8e8; }

  .ar-nav {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .ar-nav-link {
    font-size: 14px;
    font-weight: 600;
    color: #888;
    text-decoration: none;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 4px 0;
    border-bottom: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    cursor: pointer;
  }
  .ar-nav-link:hover {
    color: #ff7a00;
    border-bottom-color: #ff7a00;
  }
  .ar-btn-outline {
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 10px 24px;
    background: transparent;
    color: #ff7a00;
    border: 1.5px solid #ff7a00;
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, transform 0.15s;
  }
  .ar-btn-outline:hover {
    background: #ff7a00;
    color: #0f0f0f;
    transform: translateY(-1px);
  }

  /* HERO */
  .ar-hero {
    position: relative;
    text-align: center;
    padding: 160px 40px 120px;
    overflow: hidden;
  }
  .ar-hero-bg-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 55% 55% at 50% 45%, rgba(255,122,0,0.09) 0%, transparent 70%);
    pointer-events: none;
  }
  .ar-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,122,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,122,0,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }
  .ar-hero-grid-fade {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, #0f0f0f 80%);
    pointer-events: none;
  }
  .ar-hero-content {
    position: relative;
    z-index: 1;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .ar-hero-content.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .ar-badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #ff7a00;
    border: 1px solid rgba(255,122,0,0.35);
    padding: 6px 16px;
    border-radius: 2px;
    margin-bottom: 32px;
    background: rgba(255,122,0,0.07);
  }
  .ar-hero-title {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 900;
    line-height: 1.12;
    color: #fff;
    margin: 0 auto 22px;
    max-width: 760px;
    text-shadow: 0 0 60px rgba(255,122,0,0.12);
  }
  .ar-hero-title .accent { color: #ff7a00; }
  .ar-hero-sub {
    font-size: 19px;
    font-weight: 500;
    color: #777;
    margin: 0 auto 48px;
    max-width: 480px;
    letter-spacing: 0.3px;
    line-height: 1.5;
  }
  .ar-btn-cta {
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 18px 52px;
    background: #ff7a00;
    color: #0f0f0f;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  .ar-btn-cta:hover {
    background: #ff9130;
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(255,122,0,0.3);
  }
  .ar-btn-cta svg { width: 16px; height: 16px; fill: #0f0f0f; }

  .ar-hero-stats {
    display: flex;
    justify-content: center;
    gap: 48px;
    margin-top: 72px;
    position: relative;
    z-index: 1;
  }
  .ar-stat {
    text-align: center;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .ar-stat.visible { opacity: 1; transform: translateY(0); }
  .ar-stat-number {
    font-family: 'Orbitron', sans-serif;
    font-size: 30px;
    font-weight: 900;
    color: #ff7a00;
    line-height: 1;
  }
  .ar-stat-label {
    font-size: 12px;
    font-weight: 600;
    color: #555;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-top: 6px;
  }
  .ar-stat-divider {
    width: 1px;
    background: #222;
    align-self: stretch;
  }

  /* FEATURES */
  .ar-features {
    padding: 80px 60px;
    background: #111;
    border-top: 1px solid #1c1c1c;
    border-bottom: 1px solid #1c1c1c;
  }
  .ar-section-label {
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #ff7a00;
    margin-bottom: 12px;
  }
  .ar-section-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    color: #fff;
    margin-bottom: 52px;
    letter-spacing: 0.5px;
  }
  .ar-features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    max-width: 1000px;
    margin: 0 auto;
  }
  .ar-card {
    background: #181818;
    border: 1px solid #252525;
    border-radius: 6px;
    padding: 36px 30px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.25s, transform 0.25s;
    cursor: default;
  }
  .ar-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ff7a00, transparent);
    opacity: 0;
    transition: opacity 0.25s;
  }
  .ar-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,122,0,0.05) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.25s;
    pointer-events: none;
  }
  .ar-card:hover {
    border-color: rgba(255,122,0,0.35);
    transform: translateY(-4px);
  }
  .ar-card:hover::before { opacity: 1; }
  .ar-card:hover::after { opacity: 1; }

  .ar-card-icon {
    width: 48px;
    height: 48px;
    background: rgba(255,122,0,0.09);
    border: 1px solid rgba(255,122,0,0.22);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 22px;
    transition: background 0.25s, border-color 0.25s;
  }
  .ar-card:hover .ar-card-icon {
    background: rgba(255,122,0,0.16);
    border-color: rgba(255,122,0,0.5);
  }
  .ar-card-icon svg { width: 24px; height: 24px; fill: #ff7a00; }
  .ar-card-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 12px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }
  .ar-card-desc {
    font-size: 14px;
    font-weight: 400;
    color: #5a5a5a;
    line-height: 1.65;
  }

  /* CTA BANNER */
  .ar-cta-section {
    padding: 100px 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .ar-cta-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255,122,0,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .ar-cta-section h2 {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(24px, 3vw, 36px);
    font-weight: 900;
    color: #fff;
    margin-bottom: 16px;
    position: relative;
  }
  .ar-cta-section p {
    font-size: 16px;
    color: #666;
    margin-bottom: 40px;
    position: relative;
  }

  /* FOOTER */
  .ar-footer {
    background: #090909;
    border-top: 1px solid #181818;
    padding: 40px 60px 28px;
  }
  .ar-footer-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 36px;
    padding-bottom: 36px;
    border-bottom: 1px solid #181818;
  }
  .ar-footer-brand {
    font-family: 'Orbitron', sans-serif;
    font-size: 18px;
    font-weight: 900;
    color: #ff7a00;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }
  .ar-footer-brand span { color: #333; }
  .ar-footer-tagline {
    font-size: 13px;
    color: #444;
    max-width: 220px;
    line-height: 1.6;
  }
  .ar-footer-links-group { display: flex; gap: 56px; }
  .ar-footer-col h4 {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 16px;
  }
  .ar-footer-col a {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #444;
    text-decoration: none;
    margin-bottom: 10px;
    transition: color 0.2s;
  }
  .ar-footer-col a:hover { color: #ff7a00; }

  .ar-footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ar-footer-copy {
    font-size: 12px;
    color: #2e2e2e;
    letter-spacing: 0.5px;
  }
  .ar-social-row {
    display: flex;
    gap: 10px;
  }
  .ar-social-icon {
    width: 34px;
    height: 34px;
    border: 1px solid #1e1e1e;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: #111;
    transition: border-color 0.2s, background 0.2s;
  }
  .ar-social-icon:hover {
    border-color: #ff7a00;
    background: rgba(255,122,0,0.08);
  }
  .ar-social-icon svg { width: 15px; height: 15px; fill: #444; transition: fill 0.2s; }
  .ar-social-icon:hover svg { fill: #ff7a00; }

  @media (max-width: 768px) {
    .ar-header { padding: 16px 24px; }
    .ar-nav { gap: 16px; }
    .ar-hero { padding: 120px 24px 80px; }
    .ar-hero-stats { gap: 24px; flex-wrap: wrap; }
    .ar-features { padding: 60px 24px; }
    .ar-features-grid { grid-template-columns: 1fr; }
    .ar-footer { padding: 40px 24px 24px; }
    .ar-footer-top { flex-direction: column; gap: 32px; }
    .ar-footer-links-group { gap: 32px; }
    .ar-footer-bottom { flex-direction: column; gap: 16px; }
    .ar-cta-section { padding: 72px 24px; }
  }
`;

const IconSwords = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 2.5l7 7-2.5 2.5-7-7V2.5h2.5zM2.5 9.5l7 7H2.5V14l-2-2 2-2.5zM20 14l-6-6-1.5 1.5 6 6L20 14zM4 4l6 6 1.5-1.5-6-6L4 4z"/>
  </svg>
);

const IconTrophy = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V18H9v2h6v-2h-2v-2.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
  </svg>
);

const IconCoins = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.056a19.9 19.9 0 0 0 5.993 3.031.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const features = [
  {
    icon: <IconSwords />,
    title: "1x1 Competitivo",
    desc: "Duelos diretos onde só o melhor avança. Sem time, sem desculpas — apenas habilidade pura em cada partida.",
  },
  {
    icon: <IconTrophy />,
    title: "Avance por Fases",
    desc: "Fase de grupos, quartas, semi e grande final. Cada vitória te aproxima do topo do ranking nacional.",
  },
  {
    icon: <IconCoins />,
    title: "Ganhe Prêmios",
    desc: "Os melhores colocados são premiados. Glória, reconhecimento e recompensas reais aguardam os campeões.",
  },
];

export default function ArenaRift() {
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const t1 = setTimeout(() => setHeroVisible(true), 100);
    const t2 = setTimeout(() => setStatsVisible(true), 500);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="ar-root">

        {/* HEADER */}
        <header className={`ar-header${scrolled ? " scrolled" : ""}`}>
          <a href="#" className="ar-logo">Arena<span>Rift</span></a>
          <nav className="ar-nav">
            <button className="ar-nav-link">Campeonato</button>
            <button className="ar-btn-outline">Entrar / Inscrever-se</button>
          </nav>
        </header>

        {/* HERO */}
        <section className="ar-hero">
          <div className="ar-hero-bg-glow" />
          <div className="ar-hero-grid" />
          <div className="ar-hero-grid-fade" />

          <div className={`ar-hero-content${heroVisible ? " visible" : ""}`}>
            <div className="ar-badge">Wild Rift — Temporada 2026</div>
            <h1 className="ar-hero-title">
              Participe de campeonatos de{" "}
              <span className="accent">Wild Rift</span>
            </h1>
            <p className="ar-hero-sub">
              Teste suas habilidades e avance até a final
            </p>
            <button className="ar-btn-cta">
              Participar agora
              <IconArrow />
            </button>
          </div>

          <div className="ar-hero-stats">
            {[
              { number: "2.4K+", label: "Jogadores ativos" },
              null,
              { number: "48", label: "Campeonatos realizados" },
              null,
              { number: "R$50K", label: "Em prêmios distribuídos" },
            ].map((item, i) =>
              item === null ? (
                <div key={i} className="ar-stat-divider" />
              ) : (
                <div
                  key={i}
                  className={`ar-stat${statsVisible ? " visible" : ""}`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="ar-stat-number">{item.number}</div>
                  <div className="ar-stat-label">{item.label}</div>
                </div>
              )
            )}
          </div>
        </section>

        {/* FEATURES */}
        <section className="ar-features">
          <p className="ar-section-label">Por que competir aqui</p>
          <h2 className="ar-section-title">Tudo que você precisa para vencer</h2>
          <div className="ar-features-grid">
            {features.map((f, i) => (
              <div key={i} className="ar-card">
                <div className="ar-card-icon">{f.icon}</div>
                <h3 className="ar-card-title">{f.title}</h3>
                <p className="ar-card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="ar-cta-section">
          <div className="ar-cta-bg" />
          <h2>Pronto para entrar na arena?</h2>
          <p>Inscrições abertas para a próxima temporada. Vagas limitadas.</p>
          <button className="ar-btn-cta">
            Criar conta gratuita
            <IconArrow />
          </button>
        </section>

        {/* FOOTER */}
        <footer className="ar-footer">
          <div className="ar-footer-top">
            <div>
              <div className="ar-footer-brand">Arena<span>Rift</span></div>
              <p className="ar-footer-tagline">
                A plataforma de campeonatos de Wild Rift mais competitiva do Brasil.
              </p>
            </div>
            <div className="ar-footer-links-group">
              <div className="ar-footer-col">
                <h4>Comunidade</h4>
                <a href="#">Discord</a>
                <a href="#">Twitter</a>
                <a href="#">Instagram</a>
              </div>
              <div className="ar-footer-col">
                <h4>Plataforma</h4>
                <a href="#">Campeonatos</a>
                <a href="#">Ranking</a>
                <a href="#">Regras</a>
              </div>
              <div className="ar-footer-col">
                <h4>Suporte</h4>
                <a href="#">FAQ</a>
                <a href="#">Contato</a>
                <a href="#">Termos de uso</a>
              </div>
            </div>
          </div>
          <div className="ar-footer-bottom">
            <p className="ar-footer-copy">© 2026 ArenaRift. Todos os direitos reservados.</p>
            <div className="ar-social-row">
              <div className="ar-social-icon"><DiscordIcon /></div>
              <div className="ar-social-icon"><TwitterIcon /></div>
              <div className="ar-social-icon"><InstagramIcon /></div>
            </div>
          </div>
        </footer>

        <Footer />

      </div>
    </>
  );
}
