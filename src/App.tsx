import { useMemo, useState } from 'react'
import { QUESTIONS, evaluate, type Answers, type Answer, type Verdict } from './decision'

const VERDICT_CLASS: Record<Verdict, string> = {
  required: 'v-required',
  likely_required: 'v-likely',
  not_required: 'v-not',
  consult: 'v-consult',
}

function buildReport(answers: Answers): string {
  const result = evaluate(answers)
  const lines: string[] = []
  lines.push('RESULTADO — Preciso de aprovação da CEIC?')
  lines.push('='.repeat(48))
  lines.push('')
  lines.push(result.title)
  lines.push('')
  lines.push(result.summary)
  lines.push('')
  if (result.reasons.length) {
    lines.push('Fundamentação:')
    result.reasons.forEach((r) => lines.push(`  • ${r}`))
    lines.push('')
  }
  lines.push('Respostas dadas:')
  QUESTIONS.forEach((q) => {
    const ans = answers[q.id]
    lines.push(`  • ${q.text}`)
    lines.push(`      ${ans ? ans.toUpperCase() : '(sem resposta)'}`)
  })
  lines.push('')
  lines.push(
    'Aviso: esta ferramenta fornece apenas orientação e não substitui o parecer ' +
      'da CEIC nem aconselhamento jurídico.',
  )
  return lines.join('\n')
}

export default function App() {
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = QUESTIONS.every((q) => answers[q.id] != null)
  const result = useMemo(() => (submitted ? evaluate(answers) : null), [submitted, answers])

  function setAnswer(id: string, value: Answer) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function reset() {
    setAnswers({})
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function download() {
    const text = buildReport(answers)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resultado-ceic.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  function sendEmail() {
    const text = buildReport(answers)
    const subject = encodeURIComponent('Resultado — Preciso de aprovação da CEIC?')
    const body = encodeURIComponent(text)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Preciso de aprovação da CEIC?</h1>
        <p className="subtitle">
          Responda às perguntas para obter uma orientação sobre se o seu projeto de investigação
          deve ser submetido à Comissão de Ética para a Investigação Clínica.
        </p>
      </header>

      <ol className="questions">
        {QUESTIONS.map((q, i) => (
          <li key={q.id} className="question">
            <div className="question-text">
              <span className="q-num">{i + 1}.</span>
              <div>
                <p>{q.text}</p>
                {q.help && <p className="help">{q.help}</p>}
              </div>
            </div>
            <div className="options" role="group" aria-label={q.text}>
              {(['sim', 'nao'] as Answer[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`option ${answers[q.id] === opt ? 'selected' : ''}`}
                  aria-pressed={answers[q.id] === opt}
                  onClick={() => setAnswer(q.id, opt)}
                >
                  {opt === 'sim' ? 'Sim' : 'Não'}
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
          onClick={() => setSubmitted(true)}
        >
          Ver resultado
        </button>
        {!allAnswered && <span className="hint">Responda a todas as perguntas para continuar.</span>}
      </div>

      {result && (
        <section className={`result ${VERDICT_CLASS[result.verdict]}`} aria-live="polite">
          <h2>{result.title}</h2>
          <p>{result.summary}</p>
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
          <div className="result-actions">
            <button type="button" onClick={download}>
              Descarregar resultado
            </button>
            <button type="button" onClick={sendEmail}>
              Enviar por email
            </button>
            <button type="button" className="ghost" onClick={reset}>
              Recomeçar
            </button>
          </div>
        </section>
      )}

      <footer className="footer">
        <p>
          Esta ferramenta fornece apenas <strong>orientação</strong> e não substitui o parecer da
          CEIC nem aconselhamento jurídico.
        </p>
      </footer>
    </main>
  )
}
