import { useEffect, useMemo, useState } from 'react'
import { GENAI_QUESTIONS, evaluateGenAI, type Risk } from '../genai'
import type { Answers } from '../decision'
import { GENAI, APP_VERSION } from '../brand'
import { encodeState, loadInitial, persist, clearPersisted, setStateParam, shareUrl } from '../url'
import Abbr from '../components/Abbr'

const RISK_CLASS: Record<Risk, string> = {
  red: 'v-required',
  amber: 'v-likely',
  green: 'v-not',
}
const RISK_LABEL: Record<Risk, string> = {
  red: '● Vermelho',
  amber: '● Amarelo',
  green: '● Verde',
}

const STORAGE_KEY = 'percurso-etico:genai'
const PATH = '#/genai'

interface Saved {
  answers: Answers
}

function buildReport(answers: Answers): string {
  const r = evaluateGenAI(answers)
  const now = new Date()
  const L: string[] = []
  L.push(GENAI.tagline.toUpperCase())
  L.push('='.repeat(52))
  L.push(`Documento gerado a ${now.toLocaleString('pt-PT')} · Versão: ${APP_VERSION}`)
  L.push('')
  L.push(`RESULTADO (${RISK_LABEL[r.risk]}): ${r.title}`)
  L.push(r.summary)
  L.push('')
  if (r.reasons.length) {
    L.push('PORQUÊ:')
    r.reasons.forEach((x) => L.push(`  • ${x}`))
    L.push('')
  }
  L.push('NÃO FAZER:')
  r.donts.forEach((x) => L.push(`  • ${x}`))
  L.push('')
  L.push('FAZER:')
  r.dos.forEach((x) => L.push(`  • ${x}`))
  L.push('')
  L.push('AVISO: orientação, não aconselhamento jurídico. Nenhuma resposta é enviada nem armazenada.')
  return L.join('\n')
}

/** Resumo conciso, pronto a enviar. */
function buildSummary(answers: Answers): string {
  const r = evaluateGenAI(answers)
  const L: string[] = []
  L.push(`Percurso Ético — ${GENAI.tagline}`)
  L.push('')
  L.push(`Resultado (${RISK_LABEL[r.risk]}): ${r.title}`)
  L.push(r.summary)
  if (r.donts[0]) L.push(`Principal a evitar: ${r.donts[0]}`)
  if (r.dos[0]) L.push(`Principal a fazer: ${r.dos[0]}`)
  return L.join('\n')
}

/** Relatório completo em Markdown. */
function buildMarkdown(answers: Answers): string {
  const r = evaluateGenAI(answers)
  const now = new Date()
  const L: string[] = []
  L.push(`# ${GENAI.tagline}`)
  L.push('')
  L.push(`*Documento gerado a ${now.toLocaleString('pt-PT')} · Versão ${APP_VERSION}*`)
  L.push('')
  L.push(`## Resultado (${RISK_LABEL[r.risk]}) — ${r.title}`)
  L.push('')
  L.push(r.summary)
  L.push('')
  if (r.reasons.length) {
    L.push('## Porquê')
    L.push('')
    r.reasons.forEach((x) => L.push(`- ${x}`))
    L.push('')
  }
  L.push('## ❌ Não fazer')
  L.push('')
  r.donts.forEach((x) => L.push(`- ${x}`))
  L.push('')
  L.push('## ✅ Fazer')
  L.push('')
  r.dos.forEach((x) => L.push(`- ${x}`))
  L.push('')
  L.push('---')
  L.push('*Orientação, não aconselhamento jurídico. Nenhuma resposta é enviada nem armazenada.*')
  return L.join('\n')
}

export default function GenAiPage() {
  const initial = useMemo(() => loadInitial<Saved>(STORAGE_KEY), [])
  const [answers, setAnswers] = useState<Answers>(initial?.answers ?? {})
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState('')
  const [missing, setMissing] = useState<string | null>(null)

  const answeredCount = GENAI_QUESTIONS.filter((q) => answers[q.id] != null).length
  const total = GENAI_QUESTIONS.length
  const pct = Math.round((answeredCount / total) * 100)
  const allAnswered = answeredCount === total
  const result = useMemo(() => (submitted ? evaluateGenAI(answers) : null), [submitted, answers])

  useEffect(() => {
    const empty = Object.keys(answers).length === 0
    persist(STORAGE_KEY, { answers })
    setStateParam(PATH, empty ? null : encodeState({ answers }))
  }, [answers])

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    if (missing === id) setMissing(null)
    setSubmitted(false)
  }
  function reset() {
    setAnswers({})
    setSubmitted(false)
    setMissing(null)
    clearPersisted(STORAGE_KEY)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function onSubmit() {
    const firstMissing = GENAI_QUESTIONS.find((q) => answers[q.id] == null)
    if (firstMissing) {
      setMissing(firstMissing.id)
      setSubmitted(false)
      setTimeout(() => {
        document
          .getElementById(`q-${firstMissing.id}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 30)
      return
    }
    setMissing(null)
    setSubmitted(true)
    setTimeout(() => document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  function flash(key: string) {
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }
  async function copyText(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text)
      flash(key)
    } catch {
      /* clipboard indisponível */
    }
  }
  function download(name: string, text: string) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }
  function sendEmail() {
    const subject = encodeURIComponent(GENAI.tagline)
    const body = encodeURIComponent(buildReport(answers))
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <>
      <p className="tool-switch">
        Ferramenta 2 de 2 · <a href="#/">← Apreciação ética ou regulamentar</a>
      </p>

      <section className="hero">
        <h1>{GENAI.tagline}</h1>
        <p>
          <Abbr>{GENAI.intro}</Abbr>
        </p>
      </section>

      <div className="progress no-print" aria-hidden="true">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-label">
          {answeredCount} de {total} perguntas · {pct}%
        </span>
      </div>

      <ol className="questions">
        {GENAI_QUESTIONS.map((q, i) => (
          <li key={q.id} id={`q-${q.id}`} className={`question ${missing === q.id ? 'missing' : ''}`}>
            <div className="question-text">
              <span className="q-num">{i + 1}.</span>
              <div>
                <p>
                  <Abbr>{q.text}</Abbr>
                </p>
                {q.help && (
                  <p className="help">
                    <Abbr>{q.help}</Abbr>
                  </p>
                )}
                {q.ref && (
                  <a className="q-ref" href={q.ref.url} target="_blank" rel="noopener noreferrer">
                    <Abbr>{q.ref.label}</Abbr> ↗
                  </a>
                )}
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
        ))}
      </ol>

      <div className="actions">
        <button type="button" className="primary" onClick={onSubmit}>
          Ver resultado
        </button>
        {!allAnswered && (
          <span className="hint">Faltam {total - answeredCount} — clique para ir à primeira.</span>
        )}
      </div>

      {result && (
        <section id="resultado" className={`result ${RISK_CLASS[result.risk]}`} aria-live="polite">
          <p className="generated-date">Documento gerado a {new Date().toLocaleString('pt-PT')}</p>
          <span className={`risk-badge risk-${result.risk}`}>{RISK_LABEL[result.risk]}</span>
          <h2>{result.title}</h2>
          <p>{result.summary}</p>

          {result.reasons.length > 0 && (
            <>
              <h3>Porquê</h3>
              <ul>
                {result.reasons.map((r, i) => (
                  <li key={i}>
                    <Abbr>{r}</Abbr>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="dos-donts">
            <div className="dont-col">
              <h3>❌ Não fazer</h3>
              <ul>
                {result.donts.map((r, i) => (
                  <li key={i}>
                    <Abbr>{r}</Abbr>
                  </li>
                ))}
              </ul>
            </div>
            <div className="do-col">
              <h3>✅ Fazer</h3>
              <ul>
                {result.dos.map((r, i) => (
                  <li key={i}>
                    <Abbr>{r}</Abbr>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3>Sugestão de resumo</h3>
          <pre className="summary-box">{buildSummary(answers)}</pre>
          <div className="result-actions no-print">
            <button type="button" onClick={() => copyText(buildSummary(answers), 'resumo')}>
              {copied === 'resumo' ? 'Copiado ✓' : 'Copiar resumo'}
            </button>
            <button
              type="button"
              onClick={() => copyText(shareUrl(PATH, encodeState({ answers })), 'link')}
            >
              {copied === 'link' ? 'Link copiado ✓' : 'Copiar link partilhável'}
            </button>
          </div>

          <h3>Exportar relatório completo</h3>
          <div className="result-actions no-print">
            <span className="export-label">Exportar:</span>
            <button type="button" onClick={() => window.print()}>
              PDF
            </button>
            <button
              type="button"
              onClick={() => download('genai-dados-confidenciais.md', buildMarkdown(answers))}
            >
              Markdown (.md)
            </button>
            <button
              type="button"
              onClick={() => download('genai-dados-confidenciais.txt', buildReport(answers))}
            >
              Texto (.txt)
            </button>
            <button type="button" onClick={sendEmail}>
              Email
            </button>
            <button type="button" className="ghost" onClick={reset}>
              Recomeçar
            </button>
          </div>
          <p className="privacy-note">
            Nenhuma resposta é enviada nem armazenada — o processamento ocorre no seu navegador.
          </p>
        </section>
      )}
    </>
  )
}
