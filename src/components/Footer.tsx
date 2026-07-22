import { BRAND, USEFUL_LINKS } from '../brand'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-brand">
            <strong>CEIC</strong>Check
          </div>
          <p>{BRAND.tagline}</p>
          <p className="disclaimer">
            Ferramenta de <strong>orientação</strong>. Não substitui o parecer da CEIC nem
            aconselhamento jurídico.
          </p>
        </div>

        <div className="footer-col">
          <h4>Links úteis</h4>
          <ul>
            {USEFUL_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Uma iniciativa em articulação com</h4>
          <ul>
            {BRAND.partners.map((p) => (
              <li key={p.url}>
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {'2026'} {BRAND.name} · <a href="#/autores">Autores e contactos</a>
      </div>
    </footer>
  )
}
