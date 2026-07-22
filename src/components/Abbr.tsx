import { Fragment, type ReactNode } from 'react'

/** Siglas -> descrição por extenso (tooltip nativo via <abbr title>). */
const GLOSSARY: Record<string, string> = {
  CEIC: 'Comissão de Ética para a Investigação Clínica',
  INFARMED: 'Autoridade Nacional do Medicamento e Produtos de Saúde',
  CTIS: 'Clinical Trials Information System',
  RGPD: 'Regulamento Geral sobre a Proteção de Dados',
  CNPD: 'Comissão Nacional de Proteção de Dados',
  EEE: 'Espaço Económico Europeu',
  EPD: 'Encarregado de Proteção de Dados',
  DPO: 'Data Protection Officer (Encarregado de Proteção de Dados)',
  IVD: 'Dispositivo de diagnóstico in vitro',
  AIPD: 'Avaliação de Impacto sobre a Proteção de Dados',
  ULS: 'Unidade Local de Saúde',
  genAI: 'Inteligência artificial generativa',
}

const KEYS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length)
// Corresponde às siglas quando isoladas (não como parte de outra palavra).
const RE = new RegExp(`(?<![\\p{L}\\d])(${KEYS.join('|')})(?![\\p{L}\\d])`, 'gu')

/** Envolve siglas conhecidas de um texto em <abbr title="...">. */
export default function Abbr({ children }: { children: string }): ReactNode {
  const text = children
  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  RE.lastIndex = 0
  while ((m = RE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const sigla = m[0]
    out.push(
      <abbr key={`${m.index}-${sigla}`} title={GLOSSARY[sigla]}>
        {sigla}
      </abbr>,
    )
    last = m.index + sigla.length
  }
  if (last < text.length) out.push(text.slice(last))
  return <Fragment>{out}</Fragment>
}
