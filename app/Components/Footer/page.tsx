export default function Footer() {
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
    )

    return (
        <footer className="ar-footer hidden">
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
                    <div className="ar-social-icon">{DiscordIcon()}</div>
                    <div className="ar-social-icon">{TwitterIcon()}</div>
                    <div className="ar-social-icon">{InstagramIcon()}</div>
                </div>
            </div>

            <style>
                {`
                    .ar-footer {
                    padding: 80px 60px 40px;
                    background: #0a0a0a;
                    border-top: 1px solid #1c1c1c;
                    font-family: 'Rajdhani', sans-serif;
                    }

                    .ar-footer-grid {
                    display: grid;
                    grid-template-columns: 1.5fr repeat(3, 1fr);
                    gap: 60px;
                    max-width: 1100px;
                    margin: 0 auto 60px;
                    }

                    .ar-footer-brand .ar-logo {
                    display: inline-block;
                    font-family: 'Orbitron', sans-serif;
                    font-size: 20px;
                    font-weight: 900;
                    color: #ff7a00;
                    letter-spacing: 2.5px;
                    text-transform: uppercase;
                    text-decoration: none;
                    margin-bottom: 18px;
                    }

                    .ar-footer-brand .ar-logo span {
                    color: #e8e8e8;
                    }

                    .ar-footer-brand p {
                    font-size: 14px;
                    color: #555;
                    line-height: 1.6;
                    max-width: 240px;
                    }

                    .ar-footer-column h4 {
                    font-family: 'Orbitron', sans-serif;
                    font-size: 11px;
                    font-weight: 700;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 24px;
                    }

                    .ar-footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    }

                    .ar-footer-links li {
                    margin-bottom: 12px;
                    }

                    .ar-footer-link {
                    font-size: 14px;
                    font-weight: 500;
                    color: #666;
                    text-decoration: none;
                    transition: color 0.2s;
                    cursor: pointer;
                    }

                    .ar-footer-link:hover {
                    color: #ff7a00;
                    }

                    .ar-footer-bottom {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding-top: 40px;
                    border-top: 1px solid #141414;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    }

                    .ar-copyright {
                    font-size: 12px;
                    color: #444;
                    letter-spacing: 0.5px;
                    }

                    .ar-social-links {
                    display: flex;
                    gap: 20px;
                    }

                    .ar-social-icon {
                    color: #444;
                    transition: color 0.2s;
                    }

                    .ar-social-icon:hover {
                    color: #ff7a00;
                    }

                    /* RESPONSIVIDADE FOOTER */
                    @media (max-width: 768px) {
                    .ar-footer-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 40px;
                    }
                    .ar-footer-bottom {
                        flex-direction: column;
                        gap: 20px;
                        text-align: center;
                    }
}`}
            </style>
        </footer>
    )
}