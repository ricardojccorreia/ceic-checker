import { useMemo, useState } from 'react'
import { GENAI_QUESTIONS, evaluateGenAI, type Risk } from '../genai'
import type { Answers } from '../decision'
import { GENAI, APP_VERSION } from '../brand'

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

function buildReport(answers: Answers): string {
  const r = evaluateGenAI(answers)
  const now = new Date()
  const L: string[] = []
  L.push(GENAI.tagline.toUpperCase())
  L.push('='.repeat(52))
  L.push(`Data: ${now.toLocaleString('pt-PT')} · Versão: ${APP_VERSION}`)
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
  L.push(
    'AVISO: orientação, não aconselhamento jurídico. Nenhuma resposta é enviada nem armazenada.',
  )
  return L.join('\n')
}

export default function GenAiPage() {
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  const allAnswered = GENAI_QUESTIONS.every((q) => answers[q.id] != null)
  const result = useMemo(() => (submitted ? evaluateGenAI(answers) : null), [submitted, answers])

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setSubmitted(false)
  }

  function reset() {
    setAnswers({})
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function download() {
    const blob = new Blob([buildReport(answers)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'genai-dados-confidenciais.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(buildReport(answers))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard indisponível */
    }
  }

  return (
    <>
      <p className="tool-switch">
        Ferramenta 2 de 2 · <a href="#/">← Apreciação ética ou regulamentar</a>
      </p>

      <section className="hero">
        <h1>{GENAI.tagline}</h1>
        <p>{GENAI.intro}</p>
      </section>

      <ol className="questions">
        {GENAI_QUESTIONS.map((q, i) => (
          <li key={q.id} className="question">
            <div className="question-text">
              <span className="q-num">{i + 1}.</span>
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
        ))}
      </ol>

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
        {!allAnswered && <span className="hint">Responda a todas as perguntas para continuar.</span>}
      </div>

      {result && (
        <section id="resultado" className={`result ${RISK_CLASS[result.risk]}`} aria-live="polite">
          <span className={`risk-badge risk-${result.risk}`}>{RISK_LABEL[result.risk]}</span>
          <h2>{result.title}</h2>
          <p>{result.summary}</p>

          {result.reasons.length > 0 && (
            <>
              <h3>Porquê</h3>
              <ul>
                {result.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}

          <div className="dos-donts">
            <div className="dont-col">
              <h3>❌ Não fazer</h3>
              <ul>
                {result.donts.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="do-col">
              <h3>✅ Fazer</h3>
              <ul>
                {result.dos.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

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
