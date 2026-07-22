import { AUTHORS, CONTACTS } from '../brand'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function AuthorsPage() {
  return (
    <>
      <section className="hero">
        <h1>Autores e contactos</h1>
        <p>
          Este projeto resulta da colaboração entre investigação e a Comissão de Ética para a
          Investigação Clínica.
        </p>
      </section>

      <h2 className="section-title">Autores</h2>
      <div className="authors">
        {AUTHORS.map((a) => (
          <article key={a.name} className="author-card">
            <div className="avatar" aria-hidden="true">
              {initials(a.name)}
            </div>
            <div className="author-info">
              <h3>{a.name}</h3>
              <p className="role">{a.role}</p>
              <p className="affiliation">{a.affiliation}</p>
              {a.email && (
                <a className="email" href={`mailto:${a.email}`}>
                  {a.email}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      <h2 className="section-title">Contactos institucionais</h2>
      <div className="contacts">
        {[CONTACTS.ceic, CONTACTS.rise].map((c) => (
          <article key={c.name} className="contact-card">
            <h3>{c.name}</h3>
            <dl>
              <dt>Morada</dt>
              <dd>{c.address}</dd>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </dd>
              <dt>Telefone</dt>
              <dd>{c.phone}</dd>
              <dt>Website</dt>
              <dd>
                <a href={c.url} target="_blank" rel="noopener noreferrer">
                  {c.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}
                </a>
              </dd>
            </dl>
          </article>
        ))}
      </div>
    </>
  )
}
