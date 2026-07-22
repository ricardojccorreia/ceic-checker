import { useEffect, useMemo, useState } from 'react'
import {
  SECTIONS,
  QUESTIONS,
  visibleQuestions,
  evaluate,
  type Answers,
  type NeedLevel,
} from '../decision'
import { BRAND, APP_VERSION, REG_VERSION } from '../brand'
import { encodeState, loadInitial, persist, clearPersisted, setStateParam, shareUrl } from '../url'
import Abbr from '../components/Abbr'

const NEED_CLASS: Record<NeedLevel, string> = {
  none_now: 'v-not',
  confirm: 'v-consult',
  likely: 'v-likely',
  required: 'v-required',
}

const STORAGE_KEY = 'percurso-etico:home'
const PATH = '#/'

interface Meta {
  titulo: string
  instituicao: string
}
interface Saved {
  answers: Answers
  meta: Meta
}

function conclusionBlock(answers: Answers, meta: Meta): string {
  const r = evaluate(answers)
  const now = new Date()
  const L: string[] = []
  L.push(BRAND.tagline.toUpperCase())
  L.push('='.repeat(52))
  L.push(`Documento gerado a ${now.toLocaleString('pt-PT')}`)
  L.push(`Versão da ferramenta: ${APP_VERSION} · Enquadramento: ${REG_VERSION}`)
  if (meta.titulo) L.push(`Projeto: ${meta.titulo}`)
  if (meta.instituicao) L.push(`Instituição: ${meta.instituicao}`)
  L.push('')
  L.push(`O QUE DEVE FAZER AGORA: ${r.nextSteps[0] ?? '—'}`)
  L.push('')
  L.push(`CONCLUSÃO — ${r.need.title}`)
  L.push(r.need.summary)
  L.push('')
  if (r.circuits.length) {
    L.push('CIRCUITO(S) PROVÁVEL(IS):')
    r.circuits.forEach((c) => {
      L.push(`  • ${c.label}${c.url ? ` (${c.url})` : ''}`)
      if (c.note) L.push(`      ${c.note}`)
    })
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
  return L.join('\n')
}

function buildFull(answers: Answers, meta: Meta): string {
  const L = [conclusionBlock(answers, meta)]
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

function buildPending(answers: Answers): string {
  const r = evaluate(answers)
  if (!r.pending.length) return 'Não há questões por esclarecer identificadas.'
  return (
    'Para concluir o enquadramento do projeto, é necessário confirmar:\n' +
    r.pending.map((x) => `– ${x}`).join('\n')
  )
}

export default function HomePage() {
  const initial = useMemo(() => loadInitial<Saved>(STORAGE_KEY), [])
  const [answers, setAnswers] = useState<Answers>(initial?.answers ?? {})
  const [meta, setMeta] = useState<Meta>(initial?.meta ?? { titulo: '', instituicao: '' })
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState('')
  const [missing, setMissing] = useState<string | null>(null)

  const visible = useMemo(() => visibleQuestions(answers), [answers])
  const answeredCount = visible.filter((q) => answers[q.id] != null).length
  const total = visible.length
  const pct = total ? Math.round((answeredCount / total) * 100) : 0
  const allAnswered = answeredCount === total
  const result = useMemo(() => (submitted ? evaluate(answers) : null), [submitted, answers])

  // Guardar no URL e no localStorage sempre que muda.
  useEffect(() => {
    const empty = Object.keys(answers).length === 0 && !meta.titulo && !meta.instituicao
    const payload: Saved = { answers, meta }
    persist(STORAGE_KEY, payload)
    setStateParam(PATH, empty ? null : encodeState(payload))
  }, [answers, meta])

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value }
      const stillVisible = new Set(visibleQuestions(next).map((q) => q.id))
      for (const key of Object.keys(next)) if (!stillVisible.has(key)) delete next[key]
      return next
    })
    if (missing === id) setMissing(null)
    setSubmitted(false)
  }

  function reset() {
    setAnswers({})
    setMeta({ titulo: '', instituicao: '' })
    setSubmitted(false)
    setMissing(null)
    clearPersisted(STORAGE_KEY)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function onSubmit() {
    const firstMissing = visible.find((q) => answers[q.id] == null)
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
    setTimeout(
      () => document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' }),
      50,
    )
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
  function download() {
    const blob = new Blob([buildFull(answers, meta)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'avaliacao-etica.txt'
    a.click()
    URL.revokeObjectURL(url)
  }
  function copyLink() {
    copyText(shareUrl(PATH, encodeState({ answers, meta })), 'link')
  }
  function sendEmail() {
    const subject = encodeURIComponent(BRAND.tagline)
    const body = encodeURIComponent(buildFull(answers, meta))
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const sectionsToShow = SECTIONS.map((s) => ({
    section: s,
    qs: visible.filter((q) => q.section === s.id),
  })).filter((g) => g.qs.length > 0)

  return (
    <>
      <p className="tool-switch">
        Ferramenta 1 de 2 · <a href="#/genai">Uso de <Abbr>genAI</Abbr> com dados confidenciais →</a>
      </p>

      <section className="hero">
        <h1>{BRAND.tagline}</h1>
        <p>{BRAND.intro}</p>
      </section>

      <div className="progress no-print" aria-hidden="true">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-label">
          {answeredCount} de {total} perguntas · {pct}%
        </span>
      </div>

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
      <p className="warn-note">
        ⚠️ Não introduza nomes de doentes, números de processo clínico ou outra informação pessoal
        nestes campos.
      </p>

      {sectionsToShow.map(({ section, qs }) => (
        <section key={section.id} className="qsection">
          <h2 className="qsection-title">{section.title}</h2>
          <ol className="questions">
            {qs.map((q) => {
              const idx = QUESTIONS.findIndex((x) => x.id === q.id)
              return (
                <li
                  key={q.id}
                  id={`q-${q.id}`}
                  className={`question ${missing === q.id ? 'missing' : ''}`}
                >
                  <div className="question-text">
                    <span className="q-num">{idx + 1}.</span>
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
                          Porque é relevante? <Abbr>{q.ref.label}</Abbr> ↗
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
              )
            })}
          </ol>
        </section>
      ))}

      <div className="actions">
        <button type="button" className="primary" onClick={onSubmit}>
          Ver resultado
        </button>
        {!allAnswered && (
          <span className="hint">Faltam {total - answeredCount} — clique para ir à primeira.</span>
        )}
      </div>

      {result && (
        <section id="resultado" className={`result ${NEED_CLASS[result.need.level]}`} aria-live="polite">
          <p className="generated-date">Documento gerado a {new Date().toLocaleString('pt-PT')}</p>

          {result.nextSteps[0] && (
            <div className="do-now">
              <strong>O que deve fazer agora</strong>
              <p>
                <Abbr>{result.nextSteps[0]}</Abbr>
              </p>
            </div>
          )}

          <span className="result-kicker">Necessidade de apreciação</span>
          <h2>{result.need.title}</h2>
          <p>
            <Abbr>{result.need.summary}</Abbr>
          </p>

          {result.circuits.length > 0 && (
            <>
              <h3>Circuito(s) provável(is)</h3>
              <ul className="circuits">
                {result.circuits.map((c, i) => (
                  <li key={i}>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer">
                        <strong>
                          <Abbr>{c.label}</Abbr>
                        </strong>{' '}
                        ↗
                      </a>
                    ) : (
                      <strong>
                        <Abbr>{c.label}</Abbr>
                      </strong>
                    )}
                    {c.note && (
                      <span>
                        {' '}
                        — <Abbr>{c.note}</Abbr>
                      </span>
                    )}
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
                  <li key={i}>
                    <Abbr>{r}</Abbr>
                  </li>
                ))}
              </ul>
            </>
          )}

          {result.pending.length > 0 && (
            <>
              <h3>Questões por esclarecer</h3>
              <ul>
                {result.pending.map((r, i) => (
                  <li key={i}>
                    <Abbr>{r}</Abbr>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mini-btn no-print"
                onClick={() => copyText(buildPending(answers), 'duvidas')}
              >
                {copied === 'duvidas' ? 'Copiado ✓' : 'Copiar lista de dúvidas'}
              </button>
            </>
          )}

          {result.nextSteps.length > 0 && (
            <>
              <h3>Próximos passos</h3>
              <ul>
                {result.nextSteps.map((r, i) => (
                  <li key={i}>
                    <Abbr>{r}</Abbr>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="result-actions no-print">
            <button type="button" onClick={() => copyText(conclusionBlock(answers, meta), 'resumo')}>
              {copied === 'resumo' ? 'Copiado ✓' : 'Copiar resumo'}
            </button>
            <button type="button" onClick={download}>
              Descarregar completo (.txt)
            </button>
            <button type="button" onClick={copyLink}>
              {copied === 'link' ? 'Link copiado ✓' : 'Copiar link'}
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
            Nenhuma resposta é enviada nem armazenada — o processamento ocorre no seu navegador, e o
            link partilhável contém apenas as respostas que deu.
          </p>
        </section>
      )}
    </>
  )
}
