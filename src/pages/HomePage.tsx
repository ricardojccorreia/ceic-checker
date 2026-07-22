import { useMemo, useState } from 'react'
import {
  SECTIONS,
  QUESTIONS,
  visibleQuestions,
  evaluate,
  type Answers,
  type NeedLevel,
} from '../decision'
import { BRAND, APP_VERSION, REG_VERSION } from '../brand'

const NEED_CLASS: Record<NeedLevel, string> = {
  none_now: 'v-not',
  confirm: 'v-consult',
  likely: 'v-likely',
  required: 'v-required',
}

interface Meta {
  titulo: string
  instituicao: string
}

function buildReport(answers: Answers, meta: Meta): string {
  const r = evaluate(answers)
  const now = new Date()
  const L: string[] = []
  L.push(BRAND.tagline.toUpperCase())
  L.push('='.repeat(52))
  L.push(`Data da avaliação: ${now.toLocaleString('pt-PT')}`)
  L.push(`Versão da ferramenta: ${APP_VERSION} · Enquadramento: ${REG_VERSION}`)
  if (meta.titulo) L.push(`Projeto: ${meta.titulo}`)
  if (meta.instituicao) L.push(`Instituição: ${meta.instituicao}`)
  L.push('')
  L.push(`CONCLUSÃO — ${r.need.title}`)
  L.push(r.need.summary)
  L.push('')
  if (r.circuits.length) {
    L.push('CIRCUITO(S) PROVÁVEL(IS):')
    r.circuits.forEach((c) => {
      L.push(`  • ${c.label}`)
      if (c.note) L.push(`      ${c.note}`)
    })
    L.push('')
  }
  if (r.reasons.length) {
    L.push('FUNDAMENTAÇÃO:')
    r.reasons.forEach((x) => L.push(`  • ${x}`))
    L.push('')
  }
  if (r.pending.length) {
    L.push('QUESTÕES POR ESCLARECER:')
    r.pending.forEach((x) => L.push(`  • ${x}`))
    L.push('')
  }
  if (r.nextSteps.length) {
    L.push('PRÓXIMOS PASSOS:')
    r.nextSteps.forEach((x) => L.push(`  • ${x}`))
    L.push('')
  }
  L.push('RESPOSTAS DADAS:')
  visibleQuestions(answers).forEach((q) => {
    const opt = q.options.find((o) => o.value === answers[q.id])
    L.push(`  • ${q.text}`)
    L.push(`      ${opt ? opt.label : '(sem resposta)'}`)
  })
  L.push('')
  L.push('FONTES / ENQUADRAMENTO: CEIC (ceic.pt), INFARMED (infarmed.pt), CNPD (cnpd.pt).')
  L.push(
    'AVISO: ferramenta de orientação. Não substitui o parecer da comissão de ética competente, ' +
      'da CEIC ou do INFARMED, nem aconselhamento jurídico. Nenhuma resposta é enviada nem armazenada.',
  )
  return L.join('\n')
}

export default function HomePage() {
  const [answers, setAnswers] = useState<Answers>({})
  const [meta, setMeta] = useState<Meta>({ titulo: '', instituicao: '' })
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  const visible = useMemo(() => visibleQuestions(answers), [answers])
  const allAnswered = visible.every((q) => answers[q.id] != null)
  const result = useMemo(() => (submitted ? evaluate(answers) : null), [submitted, answers])

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value }
      // Limpar respostas de perguntas que deixaram de estar visíveis.
      const stillVisible = new Set(visibleQuestions(next).map((q) => q.id))
      for (const key of Object.keys(next)) {
        if (!stillVisible.has(key)) delete next[key]
      }
      return next
    })
    setSubmitted(false)
  }

  function reset() {
    setAnswers({})
    setMeta({ titulo: '', instituicao: '' })
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function download() {
    const blob = new Blob([buildReport(answers, meta)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'avaliacao-etica.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(buildReport(answers, meta))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard indisponível */
    }
  }

  function sendEmail() {
    const subject = encodeURIComponent(BRAND.tagline)
    const body = encodeURIComponent(buildReport(answers, meta))
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  // Secções com pelo menos uma pergunta visível.
  const sectionsToShow = SECTIONS.map((s) => ({
    section: s,
    qs: visible.filter((q) => q.section === s.id),
  })).filter((g) => g.qs.length > 0)

  return (
    <>
      <p className="tool-switch">
        Ferramenta 1 de 2 · <a href="#/genai">Uso de genAI com dados confidenciais →</a>
      </p>

      <section className="hero">
        <h1>{BRAND.tagline}</h1>
        <p>{BRAND.intro}</p>
      </section>

      <div className="meta-fields">
        <label>
          Título do projeto (opcional)
          <input
            type="text"
            value={meta.titulo}
            onChange={(e) => setMeta((m) => ({ ...m, titulo: e.target.value }))}
            placeholder="Ex.: Sistema de apoio à decisão para triagem"
          />
        </label>
        <label>
          Instituição (opcional)
          <input
            type="text"
            value={meta.instituicao}
            onChange={(e) => setMeta((m) => ({ ...m, instituicao: e.target.value }))}
            placeholder="Ex.: RISE-Health / Universidade do Porto"
          />
        </label>
      </div>

      {sectionsToShow.map(({ section, qs }) => (
        <section key={section.id} className="qsection">
          <h2 className="qsection-title">{section.title}</h2>
          <ol className="questions">
            {qs.map((q) => {
              const idx = QUESTIONS.findIndex((x) => x.id === q.id)
              return (
                <li key={q.id} className="question">
                  <div className="question-text">
                    <span className="q-num">{idx + 1}.</span>
                    <div>
                      <p>{q.text}</p>
                      {q.help && <p className="help">{q.help}</p>}
                    </div>
                  </div>
                  <div className="options options-wrap" role="group" aria-label={q.text}>
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`option ${answers[q.id] === opt.value ? 'selected' : ''}`}
                        aria-pressed={answers[q.id] === opt.value}
                        onClick={() => setAnswer(q.id, opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      ))}

      <div className="actions">
        <button
          type="button"
          className="primary"
          disabled={!allAnswered}
          onClick={() => {
            setSubmitted(true)
            setTimeout(
              () => document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' }),
              50,
            )
          }}
        >
          Ver resultado
        </button>
        {!allAnswered && (
          <span className="hint">Responda às perguntas aplicáveis para continuar.</span>
        )}
      </div>

      {result && (
        <section id="resultado" className={`result ${NEED_CLASS[result.need.level]}`} aria-live="polite">
          <span className="result-kicker">Necessidade de apreciação</span>
          <h2>{result.need.title}</h2>
          <p>{result.need.summary}</p>

          {result.circuits.length > 0 && (
            <>
              <h3>Circuito(s) provável(is)</h3>
              <ul className="circuits">
                {result.circuits.map((c, i) => (
                  <li key={i}>
                    <strong>{c.label}</strong>
                    {c.note && <span> — {c.note}</span>}
                  </li>
                ))}
              </ul>
            </>
          )}

          {result.reasons.length > 0 && (
            <>
              <h3>Fundamentação</h3>
              <ul>
                {result.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}

          {result.pending.length > 0 && (
            <>
              <h3>Questões por esclarecer</h3>
              <ul>
                {result.pending.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}

          {result.nextSteps.length > 0 && (
            <>
              <h3>Próximos passos</h3>
              <ul>
                {result.nextSteps.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}

          <div className="result-actions no-print">
            <button type="button" onClick={download}>
              Descarregar (.txt)
            </button>
            <button type="button" onClick={copy}>
              {copied ? 'Copiado ✓' : 'Copiar resumo'}
            </button>
            <button type="button" onClick={() => window.print()}>
              Imprimir / PDF
            </button>
            <button type="button" onClick={sendEmail}>
              Enviar por email
            </button>
            <button type="button" className="ghost" onClick={reset}>
              Recomeçar
            </button>
          </div>
          <p className="privacy-note">
            Nenhuma resposta é enviada nem armazenada — todo o processamento ocorre no seu navegador.
          </p>
        </section>
      )}
    </>
  )
}
