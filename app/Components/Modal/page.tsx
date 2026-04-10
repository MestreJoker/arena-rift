"use client";

import { useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

  /* OVERLAY - Fundo escuro com blur ocupando TELA TODA */
  .ar-modal-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }
  .ar-modal-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  /* CARD - Centralizado */
  .ar-modal-card {
    font-family: 'Rajdhani', sans-serif;
    background: #141414;
    border: 1px solid #252525;
    border-radius: 10px;
    width: 100%;
    max-width: 420px;
    padding: 40px 36px 36px;
    position: relative;
    transform: translateY(20px) scale(0.97);
    transition: transform 0.3s ease;
    overflow: hidden;
    margin: auto;
  }
  .ar-modal-overlay.open .ar-modal-card {
    transform: translateY(0) scale(1);
  }

  /* Card top accent line */
  .ar-modal-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #ff7a00 40%, #ff7a00 60%, transparent 100%);
  }

  /* Card glow */
  .ar-modal-card::after {
    content: '';
    position: absolute;
    top: -60px; left: 50%;
    transform: translateX(-50%);
    width: 260px;
    height: 120px;
    background: radial-gradient(ellipse, rgba(255,122,0,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  /* CLOSE BUTTON */
  .ar-modal-close {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 32px;
    height: 32px;
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    padding: 0;
  }
  .ar-modal-close:hover {
    background: #252525;
    border-color: #383838;
  }
  .ar-modal-close svg {
    width: 14px;
    height: 14px;
    fill: #555;
    transition: fill 0.2s;
  }
  .ar-modal-close:hover svg { fill: #aaa; }

  /* HEADER */
  .ar-modal-logo {
    font-family: 'Orbitron', sans-serif;
    font-size: 16px;
    font-weight: 900;
    color: #ff7a00;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 28px;
  }
  .ar-modal-logo span { color: #e8e8e8; }

  .ar-modal-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 20px;
    font-weight: 900;
    color: #fff;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .ar-modal-sub {
    font-size: 14px;
    font-weight: 500;
    color: #555;
    margin-bottom: 32px;
    line-height: 1.5;
  }

  /* DISCORD BUTTON */
  .ar-discord-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 15px 24px;
    background: #5865f2;
    border: none;
    border-radius: 5px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #fff;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    margin-bottom: 20px;
  }
  .ar-discord-btn:hover {
    background: #4752c4;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(88,101,242,0.35);
  }
  .ar-discord-btn:active {
    transform: translateY(0);
  }
  .ar-discord-btn svg {
    width: 20px;
    height: 20px;
    fill: #fff;
    flex-shrink: 0;
  }

  /* DIVIDER */
  .ar-modal-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .ar-modal-divider-line { flex: 1; height: 1px; background: #1e1e1e; }
  .ar-modal-divider-text {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #777;
    white-space: nowrap;
  }

  /* PERKS */
  .ar-modal-perks {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 28px;
  }
  .ar-modal-perk {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ar-modal-perk-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ff7a00;
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba(255,122,0,0.5);
  }
  .ar-modal-perk-text {
    font-size: 13px;
    font-weight: 500;
    color: #555;
  }

  /* FOOTER NOTE */
  .ar-modal-note {
    font-size: 12px;
    color: #555;
    text-align: center;
    line-height: 1.6;
  }
  .ar-modal-note a {
    color: #555;
    text-decoration: none;
    transition: color 0.2s;
  }
  .ar-modal-note a:hover { color: #ff7a00; }

  @media (max-width: 480px) {
    .ar-modal-card { padding: 32px 24px 28px; }
  }
`;

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.056a19.9 19.9 0 0 0 5.993 3.031.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscordLogin?: () => void;
}

export default function AuthModal({ isOpen, onClose, onDiscordLogin }: AuthModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <style>{styles}</style>

      <div
        className={`ar-modal-overlay${isOpen ? " open" : ""}`}
        onClick={handleOverlayClick}
        aria-modal="true"
        aria-hidden={!isOpen}
        role="dialog"
      >
        <div className="ar-modal-card">

          {/* Close */}
          <button className="ar-modal-close" onClick={onClose} aria-label="Fechar">
            <CloseIcon />
          </button>

          {/* Logo */}
          <div className="ar-modal-logo">Arena<span>Rift</span></div>

          {/* Title */}
          <h2 className="ar-modal-title">Entre na arena</h2>
          <p className="ar-modal-sub">
            Use sua conta do Discord para entrar ou criar sua conta. Rápido e sem senha para lembrar.
          </p>

          {/* Discord CTA */}
          <button className="ar-discord-btn" onClick={onDiscordLogin}>
            <DiscordIcon />
            Entrar com Discord
          </button>

          <div className="ar-modal-divider">
            <div className="ar-modal-divider-line" />
            <span className="ar-modal-divider-text">ao entrar você ganha acesso a</span>
            <div className="ar-modal-divider-line" />
          </div>

          {/* Perks */}
          <div className="ar-modal-perks">
            {[
              "Campeonatos oficiais de Wild Rift",
              "Ranking e histórico de partidas",
              "Comunidade exclusiva no Discord",
              "Premiações para os melhores colocados",
            ].map((perk) => (
              <div key={perk} className="ar-modal-perk">
                <div className="ar-modal-perk-dot" />
                <span className="ar-modal-perk-text">{perk}</span>
              </div>
            ))}
          </div>

          {/* Note */}
          <p className="ar-modal-note">
            Ao entrar, você concorda com os{" "}
            <a href="#">Termos de Uso</a> e a{" "}
            <a href="#">Política de Privacidade</a> da ArenaRift.
          </p>

        </div>
      </div>
    </>
  );
}