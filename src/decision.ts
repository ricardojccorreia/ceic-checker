/**
 * Motor de decisão.
 *
 * IMPORTANTE (para quem edita): as perguntas (SECTIONS/QUESTIONS) e as regras
 * (`evaluate`) são um orientador inicial e NÃO substituem a legislação, o
 * parecer da comissão de ética competente, da CEIC ou do INFARMED. A ferramenta
 * distingue quatro questões diferentes:
 *   1) necessidade de apreciação ética;
 *   2) parecer da CEIC;
 *   3) parecer de uma comissão de ética institucional;
 *   4) submissão regulamentar ao INFARMED (incl. CTIS para medicamentos).
 * Tudo é orientado por dados para facilitar a manutenção.
 */

export type Answers = Record<string, string>

export interface QOption {
  value: string
  label: string
}

export interface Question {
  id: string
  section: string
  text: string
  help?: string
  options: QOption[]
  /** Ligação a fonte oficial, mostrada junto à pergunta. */
  ref?: { label: string; url: string }
  /** Pergunta só é mostrada quando esta condição é verdadeira. */
  visibleWhen?: (a: Answers) => boolean
}

export interface Section {
  id: string
  title: string
  description?: string
}

// Conjuntos de opções reutilizáveis
const YNU: QOption[] = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
  { value: 'nao_sei', label: 'Não sei' },
]

const YNAU: QOption[] = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
  { value: 'nao_aplicavel', label: 'Não aplicável' },
  { value: 'nao_sei', label: 'Não sei' },
]

export const SECTIONS: Section[] = [
  { id: 'natureza', title: '1. Natureza do projeto' },
  { id: 'envolvimento', title: '2. Envolvimento de pessoas, dados e amostras' },
  { id: 'dados', title: '3. Dados: forma e temporalidade' },
  { id: 'intervencao', title: '4. Intervenção e impacto clínico' },
  { id: 'software', title: '5. Software, IA e finalidade médica' },
  { id: 'regulamentar', title: '6. Enquadramento regulamentar' },
  { id: 'protecao', title: '7. Proteção de dados (RGPD)' },
  { id: 'risco', title: '8. Risco e participantes' },
  { id: 'contexto', title: '9. Promotor e contexto' },
]

const isInvestigacao = (a: Answers) => a['investigacao'] !== 'nao'
const usaPessoas = (a: Answers) => a['pessoas'] === 'sim'
const usaDados = (a: Answers) => a['dadosSaude'] === 'sim'
const swMedico = (a: Answers) => a['finalidadeMedica'] === 'sim'

export const QUESTIONS: Question[] = [
  {
    id: 'investigacao',
    section: 'natureza',
    text: 'Pretende realizar uma avaliação sistemática destinada a produzir conhecimento, validar um sistema ou divulgar resultados?',
    help: 'Ajuda a separar a elaboração de uma ideia, o desenvolvimento de requisitos, um protótipo ou a melhoria da qualidade, da investigação científica ou clínica.',
    options: YNU,
  },

  {
    id: 'pessoas',
    section: 'envolvimento',
    text: 'Envolve participação direta de pessoas (recrutamento, contacto, procedimentos, questionários ou entrevistas)?',
    options: YNU,
    visibleWhen: isInvestigacao,
  },
  {
    id: 'dadosSaude',
    section: 'envolvimento',
    text: 'Utiliza dados de saúde de pessoas?',
    options: YNU,
    visibleWhen: isInvestigacao,
  },
  {
    id: 'amostras',
    section: 'envolvimento',
    text: 'Utiliza amostras biológicas humanas?',
    options: YNU,
    visibleWhen: isInvestigacao,
  },

  {
    id: 'formaDados',
    section: 'dados',
    text: 'Em que forma serão utilizados os dados?',
    help: 'Remover o nome ou substituir o identificador por um código NÃO torna, por si só, os dados anónimos. Dados pseudonimizados continuam a ser dados pessoais ao abrigo do RGPD.',
    ref: { label: 'CNPD — proteção de dados', url: 'https://www.cnpd.pt/' },
    options: [
      { value: 'identificaveis', label: 'Diretamente identificáveis' },
      { value: 'pseudonimizados', label: 'Pseudonimizados / codificados' },
      { value: 'anonimizados', label: 'Anonimizados de forma irreversível' },
      { value: 'agregados', label: 'Agregados' },
      { value: 'sinteticos', label: 'Sintéticos' },
      { value: 'nao_sei', label: 'Não sei' },
    ],
    visibleWhen: usaDados,
  },
  {
    id: 'temporalidade',
    section: 'dados',
    text: 'Como serão obtidos os dados?',
    options: [
      { value: 'prospetiva', label: 'Recolha prospetiva (no futuro, para este estudo)' },
      { value: 'retrospetiva', label: 'Reutilização retrospetiva (dados já existentes)' },
      { value: 'ambos', label: 'Ambos' },
      { value: 'nao_sei', label: 'Não sei' },
    ],
    visibleWhen: usaDados,
  },

  {
    id: 'procedimentos',
    section: 'intervencao',
    text: 'Os participantes serão submetidos a procedimentos ou intervenções adicionais por causa do estudo?',
    options: YNU,
    visibleWhen: usaPessoas,
  },
  {
    id: 'alteraClinica',
    section: 'intervencao',
    text: 'O estudo pode alterar diagnóstico, tratamento, prioridade ou acompanhamento clínico?',
    options: YNU,
    visibleWhen: usaPessoas,
  },
  {
    id: 'inqueritos',
    section: 'intervencao',
    text: 'Serão realizados questionários, entrevistas, observação ou testes de usabilidade?',
    options: YNU,
    visibleWhen: usaPessoas,
  },

  {
    id: 'finalidadeMedica',
    section: 'software',
    text: 'O sistema/software tem finalidade médica (produz informação usada para diagnóstico, prognóstico, monitorização ou tratamento)?',
    help: 'A finalidade médica ajuda a perceber se o software pode ser regulado como dispositivo médico.',
    ref: {
      label: 'INFARMED — investigação clínica de dispositivos',
      url: 'https://www.infarmed.pt/web/infarmed/entidades/dispositivos-medicos/investigacao-clinica-avaliacao-funcional/investigacao_clinica',
    },
    options: YNAU,
    visibleWhen: isInvestigacao,
  },
  {
    id: 'especificoDoente',
    section: 'software',
    text: 'A informação produzida é específica de um doente concreto?',
    options: YNU,
    visibleWhen: swMedico,
  },
  {
    id: 'apresentacao',
    section: 'software',
    text: 'A recomendação do sistema será apresentada a quem?',
    options: [
      { value: 'profissional', label: 'A um profissional de saúde' },
      { value: 'doente', label: 'Diretamente ao doente' },
      { value: 'ambos', label: 'A ambos' },
      { value: 'silencioso', label: 'A ninguém (execução silenciosa)' },
      { value: 'nao_aplicavel', label: 'Não aplicável' },
    ],
    visibleWhen: swMedico,
  },
  {
    id: 'avaliaProprio',
    section: 'software',
    text: 'O objetivo do estudo é avaliar a segurança ou o desempenho clínico do próprio sistema?',
    help: 'Avaliar o próprio sistema é diferente de o utilizar apenas como parte do estudo.',
    options: YNU,
    visibleWhen: swMedico,
  },
  {
    id: 'mercado',
    section: 'software',
    text: 'O sistema será disponibilizado a terceiros ou colocado no mercado?',
    options: YNU,
    visibleWhen: swMedico,
  },

  {
    id: 'tipoRegulamentar',
    section: 'regulamentar',
    text: 'O estudo envolve algum destes produtos regulados?',
    ref: {
      label: 'INFARMED — investigação clínica',
      url: 'https://www.infarmed.pt/web/infarmed/entidades/dispositivos-medicos/investigacao-clinica-avaliacao-funcional/investigacao_clinica',
    },
    options: [
      { value: 'medicamento', label: 'Medicamento de uso humano' },
      { value: 'dispositivo', label: 'Dispositivo médico' },
      { value: 'ivd', label: 'Dispositivo de diagnóstico in vitro (IVD)' },
      { value: 'nenhum', label: 'Nenhum destes' },
      { value: 'nao_sei', label: 'Não sei' },
    ],
    visibleWhen: isInvestigacao,
  },

  {
    id: 'cloudExterno',
    section: 'protecao',
    text: 'Os dados serão tratados por serviços cloud, modelos externos, ou partilhados com entidades externas?',
    options: YNU,
    visibleWhen: (a) => usaDados(a) || usaPessoas(a),
  },
  {
    id: 'foraEEE',
    section: 'protecao',
    text: 'Haverá transferência de dados para fora do Espaço Económico Europeu (EEE)?',
    options: YNU,
    visibleWhen: (a) => usaDados(a) || usaPessoas(a),
  },

  {
    id: 'vulneraveis',
    section: 'risco',
    text: 'Inclui participantes vulneráveis (menores, pessoas sem capacidade de consentir, urgência, relação de dependência)?',
    options: YNU,
    visibleWhen: (a) => usaDados(a) || usaPessoas(a),
  },
  {
    id: 'risco',
    section: 'risco',
    text: 'Existe risco relevante associado (físico, psicológico, social, de confidencialidade, de decisão clínica errada ou de enviesamento)?',
    options: YNU,
    visibleWhen: (a) => usaDados(a) || usaPessoas(a),
  },

  {
    id: 'promotor',
    section: 'contexto',
    text: 'Quem promove o estudo?',
    options: [
      { value: 'universidade', label: 'Universidade / centro de investigação' },
      { value: 'uls_hospital', label: 'ULS / hospital' },
      { value: 'empresa', label: 'Empresa' },
      { value: 'individual', label: 'Investigador individual' },
      { value: 'nao_sei', label: 'Outro / não sei' },
    ],
    visibleWhen: isInvestigacao,
  },
  {
    id: 'localSaude',
    section: 'contexto',
    text: 'Os participantes ou os dados são obtidos numa instituição de saúde (hospital, ULS, centro de saúde)?',
    options: YNU,
    visibleWhen: isInvestigacao,
  },
  {
    id: 'multicentrico',
    section: 'contexto',
    text: 'É um estudo multicêntrico (envolve várias instituições)?',
    options: YNU,
    visibleWhen: isInvestigacao,
  },
]

/** Devolve as perguntas visíveis para o conjunto de respostas atual. */
export function visibleQuestions(a: Answers): Question[] {
  return QUESTIONS.filter((q) => !q.visibleWhen || q.visibleWhen(a))
}

// ---------- Avaliação ----------

export type NeedLevel = 'none_now' | 'confirm' | 'likely' | 'required'

const ORDER: NeedLevel[] = ['none_now', 'confirm', 'likely', 'required']

export interface Circuit {
  label: string
  note?: string
  url?: string
}

export interface EvalResult {
  need: { level: NeedLevel; title: string; summary: string }
  circuits: Circuit[]
  reasons: string[]
  pending: string[]
  nextSteps: string[]
}

const NEED_TITLE: Record<NeedLevel, string> = {
  none_now: 'Sem indícios de necessidade de apreciação nesta fase',
  confirm: 'Recomenda-se confirmação institucional',
  likely: 'É provavelmente necessária apreciação ética',
  required: 'É necessário um procedimento ético-regulamentar',
}

const NEED_SUMMARY: Record<NeedLevel, string> = {
  none_now:
    'Pelas respostas, não foram identificados elementos que, nesta fase, tornem evidente a necessidade de apreciação ética. Reveja esta conclusão antes de usar pessoas, dados reais, amostras humanas ou de iniciar uma avaliação clínica.',
  confirm:
    'Há elementos que aconselham a confirmar junto da instituição (comissão de ética e/ou encarregado de proteção de dados) se é necessária apreciação, mesmo que não seja evidente.',
  likely:
    'Pelas respostas, é provável que o estudo careça de apreciação por uma comissão de ética competente. Confirme qual é a entidade aplicável antes de iniciar.',
  required:
    'Pelas respostas, o estudo enquadra-se num circuito ético-regulamentar. Não inicie antes de obter parecer ético favorável e, quando aplicável, a decisão regulamentar.',
}

const CLARIFY: Record<string, string> = {
  investigacao: 'Confirmar se o projeto constitui investigação / avaliação sistemática.',
  pessoas: 'Confirmar se há participação direta de pessoas.',
  dadosSaude: 'Confirmar se são utilizados dados de saúde.',
  amostras: 'Confirmar se são utilizadas amostras biológicas humanas.',
  formaDados:
    'Confirmar a forma dos dados (identificáveis, pseudonimizados, anónimos, agregados ou sintéticos).',
  temporalidade: 'Confirmar se a recolha de dados é prospetiva ou retrospetiva.',
  finalidadeMedica: 'Confirmar se o software tem finalidade médica.',
  avaliaProprio: 'Confirmar se o estudo avalia a segurança/desempenho do próprio sistema.',
  tipoRegulamentar: 'Confirmar se envolve medicamento, dispositivo médico ou IVD.',
  cloudExterno: 'Confirmar se há tratamento por serviços externos/cloud.',
  foraEEE: 'Confirmar se há transferência de dados para fora do EEE.',
}

export function evaluate(a: Answers): EvalResult {
  const is = (id: string, val: string) => a[id] === val
  const reasons: string[] = []
  const pending: string[] = []
  const nextSteps: string[] = []
  const circuits = new Map<string, { note?: string; url?: string }>()
  const addCircuit = (label: string, note?: string, url?: string) => {
    if (!circuits.has(label)) circuits.set(label, { note, url })
  }
  const INFARMED_DISPOSITIVOS =
    'https://www.infarmed.pt/web/infarmed/entidades/dispositivos-medicos/investigacao-clinica-avaliacao-funcional/investigacao_clinica'
  const CEIC_URL = 'https://www.ceic.pt/'
  const CNPD_URL = 'https://www.cnpd.pt/'

  let lvl = 0 // índice em ORDER
  const bump = (l: NeedLevel) => {
    const i = ORDER.indexOf(l)
    if (i > lvl) lvl = i
  }

  // Caso o projeto não seja investigação/avaliação sistemática.
  if (is('investigacao', 'nao')) {
    return {
      need: { level: 'none_now', title: NEED_TITLE.none_now, summary: NEED_SUMMARY.none_now },
      circuits: [],
      reasons: ['O projeto não configura, nesta fase, investigação ou avaliação sistemática.'],
      pending: [],
      nextSteps: [
        'Rever esta avaliação antes de passar a envolver pessoas, dados reais, amostras humanas ou uma avaliação clínica.',
      ],
    }
  }

  const pessoas = is('pessoas', 'sim')
  const dados = is('dadosSaude', 'sim')
  const amostras = is('amostras', 'sim')
  const anyInvolve = pessoas || dados || amostras

  const formaIdent = is('formaDados', 'identificaveis')
  const formaPseudo = is('formaDados', 'pseudonimizados')
  const formaAnon =
    is('formaDados', 'anonimizados') || is('formaDados', 'agregados') || is('formaDados', 'sinteticos')

  const medicamento = is('tipoRegulamentar', 'medicamento')
  const dispositivo = is('tipoRegulamentar', 'dispositivo')
  const ivd = is('tipoRegulamentar', 'ivd')
  const avaliaProprio = is('avaliaProprio', 'sim')
  const finMedica = is('finalidadeMedica', 'sim')

  // --- Produtos regulados ---
  if (medicamento) {
    bump('required')
    reasons.push('Envolve um medicamento de uso humano (ensaio clínico).')
    addCircuit(
      'CTIS — ensaio clínico com medicamento',
      'A submissão e a avaliação coordenada (incluindo o parecer ético) são feitas através do Clinical Trials Information System (CTIS). Não inicie o estudo antes da decisão favorável.',
      'https://www.infarmed.pt/',
    )
    addCircuit(
      'CEIC — parecer ético',
      'Assegurado no âmbito da avaliação coordenada do medicamento.',
      CEIC_URL,
    )
  }

  if (dispositivo) {
    if (avaliaProprio || finMedica) {
      bump('required')
      reasons.push('Investigação clínica de dispositivo médico (avalia a sua segurança/desempenho).')
      addCircuit(
        'INFARMED (articula com a CEIC)',
        'Nas investigações clínicas de dispositivos, o pedido é dirigido ao INFARMED, que assegura a articulação com a CEIC. Não deve fazer previamente um pedido separado à comissão de ética. Não inicie antes da conclusão favorável.',
        INFARMED_DISPOSITIVOS,
      )
    } else {
      bump('likely')
      reasons.push(
        'Utiliza um dispositivo médico, mas não é claro se o estudo avalia a sua segurança/desempenho (o que definiria uma investigação clínica de dispositivo).',
      )
      addCircuit(
        'INFARMED — confirmar enquadramento',
        'Confirme se o estudo avalia o próprio dispositivo (investigação clínica) ou apenas o utiliza como parte do estudo.',
        INFARMED_DISPOSITIVOS,
      )
    }
  }

  if (ivd) {
    if (avaliaProprio || finMedica) {
      bump('required')
      reasons.push('Estudo de desempenho de dispositivo de diagnóstico in vitro (IVD).')
      addCircuit(
        'INFARMED — estudo de desempenho de IVD (articula com a CEIC)',
        'Os estudos de desempenho de IVD seguem o circuito próprio junto do INFARMED, com articulação com a CEIC.',
        INFARMED_DISPOSITIVOS,
      )
    } else {
      bump('likely')
      reasons.push('Envolve um dispositivo de diagnóstico in vitro (IVD).')
      addCircuit('INFARMED — confirmar enquadramento (IVD)', undefined, INFARMED_DISPOSITIVOS)
    }
  }

  // --- Software com finalidade médica (possível dispositivo) ---
  if (finMedica && !dispositivo && !ivd) {
    bump('likely')
    reasons.push(
      'O sistema tem finalidade médica, pelo que pode qualificar-se como dispositivo médico (software).',
    )
    pending.push(
      'Confirmar se o software se qualifica como dispositivo médico (finalidade médica + informação específica de um doente + risco em caso de erro).',
    )
    addCircuit(
      'INFARMED — confirmar classificação como dispositivo médico (software)',
      undefined,
      INFARMED_DISPOSITIVOS,
    )
    if (avaliaProprio) {
      bump('required')
      reasons.push(
        'O estudo avalia a segurança/desempenho do próprio sistema — típico de investigação clínica de dispositivo.',
      )
    }
  }

  // --- Envolvimento de pessoas / intervenção ---
  if (pessoas) {
    bump('likely')
    reasons.push('Envolve participação direta de pessoas.')
  }
  if (is('procedimentos', 'sim')) {
    bump('likely')
    reasons.push('Prevê procedimentos ou intervenções adicionais nos participantes.')
  }
  if (is('alteraClinica', 'sim')) {
    bump('likely')
    reasons.push('Pode alterar diagnóstico, tratamento, prioridade ou acompanhamento clínico.')
  }
  if (is('inqueritos', 'sim')) {
    bump('likely')
    reasons.push('Inclui questionários, entrevistas, observação ou testes de usabilidade.')
  }

  // --- Dados: temporalidade e forma ---
  if (is('temporalidade', 'prospetiva') || is('temporalidade', 'ambos')) {
    bump('likely')
    reasons.push('Prevê recolha prospetiva de dados especificamente para o estudo.')
  }
  if (is('temporalidade', 'retrospetiva')) {
    bump('confirm')
    reasons.push('Reutiliza dados já existentes (estudo retrospetivo).')
  }
  if (dados && (formaIdent || formaPseudo)) {
    bump('likely')
    reasons.push(
      formaPseudo
        ? 'Usa dados pseudonimizados/codificados (que não são anónimos).'
        : 'Usa dados diretamente identificáveis.',
    )
  }
  if (dados && formaAnon) {
    bump('confirm')
    reasons.push(
      'Usa dados anonimizados/agregados/sintéticos — ainda pode ser necessária autorização institucional de acesso e confirmação da comissão de ética.',
    )
  }

  // --- Proteção de dados (RGPD) ---
  const trataDadosPessoais = dados && !(is('formaDados', 'anonimizados') || is('formaDados', 'sinteticos'))
  if (trataDadosPessoais) {
    bump('confirm')
    addCircuit(
      'Encarregado de Proteção de Dados (RGPD)',
      'Um parecer ético favorável não constitui, por si só, fundamento jurídico para o tratamento de dados pessoais. Confirme o fundamento legal e a eventual necessidade de uma Avaliação de Impacto sobre a Proteção de Dados (AIPD).',
      CNPD_URL,
    )
  }
  if (is('cloudExterno', 'sim') || is('foraEEE', 'sim')) {
    reasons.push('Tratamento por serviços externos/cloud ou transferência de dados para fora do EEE.')
    nextSteps.push(
      'Avaliar contratos de tratamento de dados, transferências internacionais e a necessidade de uma AIPD.',
    )
  }

  // --- Risco e vulnerabilidade ---
  if (is('vulneraveis', 'sim')) {
    bump('likely')
    reasons.push('Inclui participantes vulneráveis — maior exigência de apreciação e documentação.')
  }
  if (is('risco', 'sim')) {
    bump('likely')
    reasons.push(
      'Existe risco relevante (não apenas físico: também psicológico, social, de confidencialidade, de decisão clínica ou de enviesamento).',
    )
  }

  // --- Circuito por promotor / contexto ---
  if (is('localSaude', 'sim')) {
    addCircuit(
      'Comissão de ética da instituição de saúde',
      'Hospital, ULS ou centro de saúde onde são obtidos os dados ou recrutados os participantes.',
    )
  }
  if (is('promotor', 'universidade')) {
    addCircuit('Comissão de ética da instituição promotora (universidade / centro de investigação)')
  }
  if (is('promotor', 'uls_hospital')) {
    addCircuit('Comissão de ética da instituição de saúde promotora')
  }
  if (is('promotor', 'empresa')) {
    addCircuit('Comissão de ética competente / circuito regulamentar aplicável')
  }
  if (is('multicentrico', 'sim')) {
    addCircuit('Mais do que uma entidade (estudo multicêntrico)')
  }

  // Garantir pelo menos um circuito quando há envolvimento.
  if (anyInvolve && circuits.size === 0) {
    addCircuit('Comissão de ética competente (a confirmar)')
  }
  if (anyInvolve && lvl === 0) bump('confirm')

  // --- Questões por esclarecer (respostas "não sei") ---
  for (const [id, label] of Object.entries(CLARIFY)) {
    if (a[id] === 'nao_sei') pending.push(label)
  }

  // --- Próximos passos ---
  const level = ORDER[lvl]
  if (level === 'required') {
    nextSteps.unshift(
      'Não inicie o estudo antes de obter parecer ético favorável e, quando aplicável, a decisão regulamentar.',
    )
  }
  nextSteps.push(
    'Enviar um resumo desta avaliação à comissão de ética competente e, se aplicável, ao Encarregado de Proteção de Dados.',
  )

  return {
    need: { level, title: NEED_TITLE[level], summary: NEED_SUMMARY[level] },
    circuits: Array.from(circuits, ([label, v]) => ({ label, note: v.note, url: v.url })),
    reasons,
    pending,
    nextSteps,
  }
}
