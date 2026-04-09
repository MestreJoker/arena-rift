"use client";

import React from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

  .ar-footer {
    font-family: 'Rajdhani', sans-serif;
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
  .ar-footer-brand span {
    color: #999;
  }

  .ar-footer-tagline {
    font-size: 13px;
    color: #777;
    max-width: 220px;
    line-height: 1.6;
  }

  .ar-footer-links-group {
    display: flex;
    gap: 56px;
  }

  .ar-footer-col h4 {
    font-family: 'Rajdhani', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: white;
    margin: 0 0 16px;
  }

  .ar-footer-col a {
    display: block;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #888;
    text-decoration: none;
    margin-bottom: 10px;
    transition: color 0.2s;
  }
  .ar-footer-col a:hover {
    color: #ff7a00;
  }

  .ar-footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ar-footer-copy {
    font-family: 'Rajdhani', sans-serif;
    font-size: 12px;
    color: #777;
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
  .ar-social-icon svg {
    width: 15px;
    height: 15px;
    fill: #777;
    transition: fill 0.2s;
  }
  .ar-social-icon:hover svg {
    fill: #ff7a00;
  }

  @media (max-width: 768px) {
    .ar-footer {
      padding: 40px 24px 24px;
    }
    .ar-footer-top {
      flex-direction: column;
      gap: 32px;
    }
    .ar-footer-links-group {
      gap: 32px;
      flex-wrap: wrap;
    }
    .ar-footer-bottom {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }
  }
`;

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.056a19.9 19.9 0 0 0 5.993 3.031.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const currentYear = new Date().getFullYear();

const footerLinks = [
  {
    heading: "Comunidade",
    links: [
      { label: "Discord", href: "#" },
      { label: "Twitter", href: "#" },
      { label: "Instagram", href: "#" },
    ],
  },
  {
    heading: "Plataforma",
    links: [
      { label: "Campeonatos", href: "#" },
      { label: "Ranking", href: "#" },
      { label: "Regras", href: "#" },
    ],
  },
  {
    heading: "Suporte",
    links: [
      { label: "FAQ", href: "#" },
      { label: "Contato", href: "#" },
      { label: "Termos de uso", href: "#" },
    ],
  },
];

const socialIcons = [
  { icon: <DiscordIcon />, label: "Discord" },
  { icon: <TwitterIcon />, label: "Twitter" },
  { icon: <InstagramIcon />, label: "Instagram" },
];

export default function Footer() {
  return (
    <>
      <style>{styles}</style>
      <footer className="ar-footer">
        <div className="ar-footer-top">
          {/* Brand */}
          <div>
            <div className="ar-footer-brand">
              Arena<span>Rift</span>
            </div>
            <p className="ar-footer-tagline">
              A plataforma de campeonatos de Wild Rift mais competitiva do Brasil.
            </p>
          </div>

          {/* Link columns */}
          <div className="ar-footer-links-group">
            {footerLinks.map((col) => (
              <div key={col.heading} className="ar-footer-col">
                <h4>{col.heading}</h4>
                {col.links.map((link) => (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ar-footer-bottom">
          <p className="ar-footer-copy">
            © {currentYear} ArenaRift. Todos os direitos reservados.
          </p>
          <div className="ar-social-row">
            {socialIcons.map(({ icon, label }) => (
              <div
                key={label}
                className="ar-social-icon"
                role="link"
                aria-label={label}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}