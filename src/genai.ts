/**
 * Segunda ferramenta: uso responsável de IA generativa (genAI) com dados
 * confidenciais, dirigida a profissionais de saúde que criam pequenos sistemas
 * no seu dia-a-dia.
 *
 * IMPORTANTE: orientação, não aconselhamento jurídico. Edite as perguntas e as
 * regras (`evaluateGenAI`) conforme necessário.
 */

import type { QOption, Answers } from './decision'

export interface GenAIQuestion {
  id: string
  text: string
  help?: string
  options: QOption[]
}

const YNU: QOption[] = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
  { value: 'nao_sei', label: 'Não sei' },
]

export const GENAI_QUESTIONS: GenAIQuestion[] = [
  {
    id: 'dadosDoentes',
    text: 'O sistema usa dados de doentes/utentes reais (mesmo que ache que estão «despersonalizados»)?',
    help: 'Inclui notas clínicas, resultados, mensagens, imagens ou qualquer informação sobre pessoas concretas.',
    options: YNU,
  },
  {
    id: 'anonimizado',
    text: 'Esses dados foram anonimizados de forma irreversível (impossível reidentificar) antes de serem usados?',
    help: 'Remover o nome ou usar iniciais/datas NÃO é anonimização — continua a ser possível reidentificar.',
    options: YNU,
  },
  {
    id: 'ferramentasPublicas',
    text: 'Os dados são introduzidos em ferramentas de genAI de terceiros na versão pública/gratuita (ex.: ChatGPT, Gemini, Copilot pessoais)?',
    options: YNU,
  },
  {
    id: 'treino',
    text: 'O fornecedor pode usar os dados para treinar/melhorar os seus modelos (opção de treino ativa ou desconhecida)?',
    options: YNU,
  },
  {
    id: 'foraEEE',
    text: 'Os dados são processados em servidores fora do Espaço Económico Europeu (EEE)?',
    options: YNU,
  },
  {
    id: 'contrato',
    text: 'Existe uma solução institucional/empresarial com contrato de tratamento de dados (e treino desativado)?',
    help: 'Por exemplo, uma conta empresarial autorizada pela instituição, com garantias contratuais.',
    options: YNU,
  },
  {
    id: 'fundamento',
    text: 'Tem fundamento legal e autorização da instituição para este tratamento de dados?',
    options: YNU,
  },
  {
    id: 'epd',
    text: 'Consultou o Encarregado de Proteção de Dados (EPD/DPO) da instituição?',
    options: YNU,
  },
  {
    id: 'decisaoClinica',
    text: 'O sistema influencia decisões clínicas sobre doentes concretos?',
    options: YNU,
  },
]

export type Risk = 'green' | 'amber' | 'red'

export interface GenAIResult {
  risk: Risk
  title: string
  summary: string
  reasons: string[]
  donts: string[]
  dos: string[]
}

const TITLE: Record<Risk, string> = {
  red: 'Provável utilização ilegal ou de alto risco',
  amber: 'Uso possível, mas com salvaguardas em falta',
  green: 'Risco reduzido — mantenha as boas práticas',
}

const SUMMARY: Record<Risk, string> = {
  red: 'As respostas indicam um tratamento de dados confidenciais que é, muito provavelmente, ilegal ou de alto risco. Deve parar e corrigir antes de continuar.',
  amber:
    'É possível usar genAI neste contexto, mas faltam salvaguardas importantes. Resolva os pontos abaixo antes de tratar dados reais.',
  green:
    'Não foram identificados indícios de tratamento ilegal de dados de doentes. Ainda assim, mantenha as boas práticas abaixo.',
}

export function evaluateGenAI(a: Answers): GenAIResult {
  const is = (id: string, v: string) => a[id] === v
  const reasons: string[] = []
  const donts: string[] = []
  const dos: string[] = []

  const dadosDoentes = is('dadosDoentes', 'sim')
  const anonimizado = is('anonimizado', 'sim')
  const publicas = is('ferramentasPublicas', 'sim')
  const treino = is('treino', 'sim')
  const foraEEE = is('foraEEE', 'sim')
  const contrato = is('contrato', 'sim')
  const semFundamento = is('fundamento', 'nao')

  // Boas práticas de base (sempre apresentadas).
  const baseDonts = [
    'Nunca introduza dados identificáveis de doentes em ferramentas de genAI públicas ou gratuitas.',
    'Não assuma que remover o nome torna os dados anónimos — na maioria dos casos continuam reidentificáveis.',
  ]
  const baseDos = [
    'Prefira dados sintéticos ou anonimizados de forma robusta para testar e desenvolver.',
    'Use soluções institucionais/empresariais com contrato de tratamento de dados e a opção de treino desativada.',
    'Confirme o fundamento legal do tratamento e consulte o Encarregado de Proteção de Dados (EPD).',
  ]

  // Sem dados de doentes -> risco reduzido.
  if (is('dadosDoentes', 'nao')) {
    return {
      risk: 'green',
      title: TITLE.green,
      summary:
        'Pelas respostas, o sistema não trata dados de doentes/utentes reais. O risco é reduzido. Se vier a usar dados reais, refaça esta avaliação.',
      reasons: ['Não trata dados de doentes/utentes reais.'],
      donts: baseDonts,
      dos: [...baseDos, 'Se passar a usar dados reais, reavalie antes de o fazer.'],
    }
  }

  // A partir daqui, trata (ou pode tratar) dados de doentes.
  let redFlags = 0
  let amberFlags = 0

  if (dadosDoentes && !anonimizado) {
    if (publicas) {
      redFlags++
      reasons.push('Introduz dados de doentes não anonimizados em ferramentas de genAI públicas.')
      donts.push('Pare imediatamente de colar dados de doentes em ferramentas de genAI públicas.')
    }
    if (treino) {
      redFlags++
      reasons.push('Os dados podem ser usados para treinar os modelos do fornecedor.')
      dos.push('Desative a utilização dos dados para treino ou use um serviço que a proíba por contrato.')
    }
    if (foraEEE) {
      redFlags++
      reasons.push('Há transferência de dados para fora do EEE sem garantias evidentes.')
      dos.push('Garanta que o tratamento ocorre no EEE ou com salvaguardas legais adequadas.')
    }
    if (semFundamento) {
      redFlags++
      reasons.push('Não existe fundamento legal nem autorização da instituição.')
      dos.push('Obtenha fundamento legal e autorização da instituição antes de tratar dados reais.')
    }
  }

  if (dadosDoentes && anonimizado) {
    reasons.push('Afirma que os dados estão anonimizados de forma irreversível.')
    dos.push('Confirme com o EPD se a anonimização é efetivamente irreversível — é difícil de garantir.')
    amberFlags++
  }

  // Sinais de incerteza (respostas "não sei").
  const uncertain = ['anonimizado', 'treino', 'foraEEE', 'ferramentasPublicas'].filter(
    (id) => a[id] === 'nao_sei',
  )
  if (uncertain.length) {
    amberFlags++
    reasons.push('Há aspetos por esclarecer (respostas «não sei») que aumentam o risco.')
  }

  if (is('epd', 'nao')) {
    amberFlags++
    dos.push('Consulte o Encarregado de Proteção de Dados (EPD) da instituição.')
  }
  if (!contrato) {
    amberFlags++
    dos.push('Adote uma solução com contrato de tratamento de dados em vez de contas pessoais.')
  }
  if (is('decisaoClinica', 'sim')) {
    reasons.push('O sistema influencia decisões clínicas — pode exigir também apreciação ética e/ou enquadramento como dispositivo médico.')
    dos.push('Use a ferramenta de apreciação ética/regulamentar deste site para verificar esse enquadramento.')
  }

  const risk: Risk = redFlags > 0 ? 'red' : amberFlags > 0 ? 'amber' : 'green'

  // Juntar boas práticas de base sem duplicar.
  const merge = (arr: string[], base: string[]) => {
    for (const b of base) if (!arr.includes(b)) arr.push(b)
    return arr
  }

  return {
    risk,
    title: TITLE[risk],
    summary: SUMMARY[risk],
    reasons,
    donts: merge(donts, baseDonts),
    dos: merge(dos, baseDos),
  }
}
