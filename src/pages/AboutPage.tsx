import { ABOUT, APP_VERSION, REG_VERSION, AUTHORS } from '../brand'

export default function AboutPage() {
  return (
    <>
      <section className="hero">
        <h1>Sobre a ferramenta</h1>
        <p>{ABOUT.purpose}</p>
      </section>

      <div className="about-meta">
        <div>
          <span className="about-label">Versão da ferramenta</span>
          <strong>{APP_VERSION}</strong>
        </div>
        <div>
          <span className="about-label">Enquadramento regulamentar</span>
          <strong>{REG_VERSION}</strong>
        </div>
      </div>
      <p className="about-note">
        Esta ferramenta deve ser revista sempre que houver alterações legislativas ou orientações do
        INFARMED, da CEIC ou da CNPD.
      </p>

      <h2 className="section-title">Limitações</h2>
      <ul className="about-list">
        {ABOUT.limitations.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>

      <h2 className="section-title">Legislação e fontes consideradas</h2>
      <ul className="about-list">
        {ABOUT.legislation.map((l, i) => (
          <li key={i}>
            <a href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <h2 className="section-title">Registo de alterações</h2>
      <ul className="changelog">
        {ABOUT.changelog.map((c, i) => (
          <li key={i}>
            <span className="chip">v{c.version}</span>
            <span className="chip chip-date">{c.date}</span>
            <span>{c.notes}</span>
          </li>
        ))}
      </ul>

      <h2 className="section-title">Reportar erros</h2>
      <p className="about-note">
        Encontrou uma imprecisão? Contacte{' '}
        <a href={`mailto:${AUTHORS[0].email}`}>{AUTHORS[0].email}</a> ou consulte a página de{' '}
        <a href="#/autores">autores e contactos</a>.
      </p>
    </>
  )
}
