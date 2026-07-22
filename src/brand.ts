/**
 * Configuração de marca, navegação, links úteis, autores e página "Sobre".
 * Todo o conteúdo institucional está centralizado neste ficheiro.
 */

export const APP_VERSION = '0.2.0'
/** Versão do enquadramento regulamentar refletido nas regras de decisão. */
export const REG_VERSION = 'julho de 2026'

export const BRAND = {
  name: 'Percurso Ético',
  short: 'Percurso Ético',
  tagline: 'O meu projeto precisa de apreciação ética ou regulamentar?',
  intro:
    'Responda a algumas perguntas para identificar se o projeto poderá necessitar de parecer de uma comissão de ética, de avaliação pela CEIC ou de submissão ao INFARMED. Nenhuma resposta é enviada nem armazenada.',
  partners: [
    { label: 'RISE-Health', url: 'https://rise-health.pt/pt-pt/home/' },
    { label: 'CEIC', url: 'https://www.ceic.pt/' },
  ],
}

export interface NavLink {
  label: string
  href: string
  external?: boolean
}

export const NAV: NavLink[] = [
  { label: 'Verificador', href: '#/' },
  { label: 'Sobre a ferramenta', href: '#/sobre' },
  { label: 'Autores e contactos', href: '#/autores' },
]

export const USEFUL_LINKS: NavLink[] = [
  { label: 'CEIC — página oficial', href: 'https://www.ceic.pt/', external: true },
  { label: 'CEIC — legislação', href: 'https://www.ceic.pt/nacional', external: true },
  {
    label: 'Informação ao requerente',
    href: 'https://www.ceic.pt/informacao-requerente',
    external: true,
  },
  {
    label: 'INFARMED — investigação clínica de dispositivos',
    href: 'https://www.infarmed.pt/web/infarmed/entidades/dispositivos-medicos/investigacao-clinica-avaliacao-funcional/investigacao_clinica',
    external: true,
  },
  { label: 'CNPD — proteção de dados', href: 'https://www.cnpd.pt/', external: true },
  { label: 'RISE-Health', href: 'https://rise-health.pt/pt-pt/home/', external: true },
]

export interface Author {
  name: string
  role: string
  affiliations: string[]
  email?: string
  linkedin?: string
}

/**
 * Autores. Ajuste papéis, afiliações e contactos livremente.
 * NOTA: o URL de LinkedIn do Ricardo ainda está por preencher — coloque-o em
 * `linkedin` abaixo. Para o Pedro Barata usa-se o contacto geral da CEIC.
 */
export const AUTHORS: Author[] = [
  {
    name: 'Ricardo Correia',
    role: 'Idealização e desenvolvimento',
    affiliations: ['RISE-Health (investigador)', 'Virtualcare'],
    email: 'rcorreia@virtualcare.pt',
    linkedin: '', // TODO: colocar o URL do LinkedIn (ex.: https://www.linkedin.com/in/...)
  },
  {
    name: 'Pedro Barata',
    role: 'Enquadramento ético e científico',
    affiliations: [
      'Comissão de Ética para a Investigação Clínica (CEIC)',
      'RISE-Health (investigador)',
    ],
    email: 'ceic@ceic.pt',
  },
]

export const CONTACTS = {
  ceic: {
    name: 'CEIC — Comissão de Ética para a Investigação Clínica',
    address: 'Parque da Saúde de Lisboa, Av. Brasil 53, Lisboa',
    email: 'ceic@ceic.pt',
    phone: '+351 21 798 53 40',
    url: 'https://www.ceic.pt/',
  },
  rise: {
    name: 'RISE-Health',
    address: 'Faculdade de Medicina, Universidade do Porto',
    email: 'geral@rise-health.pt',
    phone: '+351 220 426 534',
    url: 'https://rise-health.pt/pt-pt/home/',
  },
}

/** Conteúdo da página "Sobre a ferramenta". */
export const ABOUT = {
  purpose:
    'Esta ferramenta é um orientador inicial para investigadores em Portugal. Ajuda a distinguir quatro questões que são frequentemente confundidas: a necessidade de apreciação ética, o parecer da CEIC, o parecer de uma comissão de ética institucional e a submissão regulamentar ao INFARMED (incluindo o circuito do CTIS para medicamentos).',
  limitations: [
    'Não substitui o parecer da comissão de ética competente, do INFARMED, da CEIC nem aconselhamento jurídico.',
    'As regras são uma simplificação; casos concretos podem ter enquadramentos diferentes.',
    'Um parecer ético favorável não constitui, por si só, fundamento jurídico para o tratamento de dados pessoais (RGPD).',
    'A ferramenta não recolhe, envia nem armazena qualquer resposta — todo o processamento ocorre no seu navegador.',
  ],
  legislation: [
    { label: 'Lei n.º 71/2025 — investigação clínica e estudos de desempenho de dispositivos médicos', url: 'https://www.ceic.pt/nacional' },
    { label: 'Lei n.º 9/2026', url: 'https://www.ceic.pt/nacional' },
    { label: 'Regulamento (UE) dos ensaios clínicos e circuito CTIS', url: 'https://www.infarmed.pt/' },
    { label: 'Regulamento (UE) dos dispositivos médicos e IVD', url: 'https://www.infarmed.pt/web/infarmed/entidades/dispositivos-medicos/investigacao-clinica-avaliacao-funcional/investigacao_clinica' },
    { label: 'RGPD e enquadramento nacional de proteção de dados (CNPD)', url: 'https://www.cnpd.pt/' },
  ],
  changelog: [
    { version: '0.2.0', date: '2026-07', notes: 'Redesenho: fluxo ramificado, separação de circuitos (comissão institucional / CEIC / INFARMED / CTIS / RGPD), ramo para software/IA e dispositivos, resultado em duas dimensões.' },
    { version: '0.1.0', date: '2026-07', notes: 'Primeira versão: questionário simples com quatro veredictos.' },
  ],
}
