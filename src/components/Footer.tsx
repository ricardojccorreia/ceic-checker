import { BRAND, USEFUL_LINKS, APP_VERSION, REG_VERSION, AUTHORS } from '../brand'

const FEEDBACK_SUBJECT = encodeURIComponent('Feedback / caso não previsto — Percurso Ético')
const FEEDBACK_BODY = encodeURIComponent(
  'O meu projeto tem características não previstas na ferramenta:\n\n(descreva o cenário)\n',
)

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-brand">{BRAND.name}</div>
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
          <p className="footer-feedback">
            O seu projeto tem características não previstas aqui?{' '}
            <a href={`mailto:${AUTHORS[0].email}?subject=${FEEDBACK_SUBJECT}&body=${FEEDBACK_BODY}`}>
              Dê-nos feedback
            </a>
            .
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        © {'2026'} {BRAND.name} · Versão {APP_VERSION} · Enquadramento revisto em {REG_VERSION} ·{' '}
        <a href="#/autores">Autores e contactos</a>
      </div>
    </footer>
  )
}
