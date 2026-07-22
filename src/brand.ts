/**
 * Configuração de marca, navegação, links úteis e autores.
 * Edite aqui os textos, links e dados dos autores — tudo o que é conteúdo
 * institucional está centralizado neste ficheiro.
 */

export const BRAND = {
  name: 'CEIC Check',
  tagline: 'Preciso de aprovação da CEIC?',
  intro:
    'Uma ferramenta de orientação para investigadores: responda a algumas perguntas e perceba se o seu projeto deve ser submetido à Comissão de Ética para a Investigação Clínica.',
  // Iniciativa em articulação com estas entidades:
  partners: [
    { label: 'RISE-Health', url: 'https://rise-health.pt/pt-pt/home/' },
    { label: 'CEIC', url: 'https://www.ceic.pt/' },
  ],
}

export interface NavLink {
  label: string
  href: string // hash interno (#/...) ou URL externo
  external?: boolean
}

/** Menu de navegação principal (topo). */
export const NAV: NavLink[] = [
  { label: 'Verificador', href: '#/' },
  { label: 'Autores e contactos', href: '#/autores' },
]

/** Links úteis externos (CEIC, RISE-Health, legislação, etc.). */
export const USEFUL_LINKS: NavLink[] = [
  { label: 'CEIC — página oficial', href: 'https://www.ceic.pt/', external: true },
  {
    label: 'Informação ao requerente',
    href: 'https://www.ceic.pt/informacao-requerente',
    external: true,
  },
  { label: 'Normativo / legislação', href: 'https://www.ceic.pt/legislacao', external: true },
  { label: 'FAQ da CEIC', href: 'https://www.ceic.pt/faq', external: true },
  { label: 'RISE-Health', href: 'https://rise-health.pt/pt-pt/home/', external: true },
]

export interface Author {
  name: string
  role: string
  affiliation: string
  email?: string
}

/**
 * Autores. Ajuste livremente os papéis, afiliações e contactos.
 * (Para o Pedro Barata usa-se o contacto geral da CEIC; substitua se preferir.)
 */
export const AUTHORS: Author[] = [
  {
    name: 'Ricardo Correia',
    role: 'Idealização e desenvolvimento',
    affiliation: 'Virtualcare',
    email: 'rcorreia@virtualcare.pt',
  },
  {
    name: 'Pedro Barata',
    role: 'Enquadramento ético e científico',
    affiliation: 'Comissão de Ética para a Investigação Clínica (CEIC)',
    email: 'ceic@ceic.pt',
  },
]

/** Contactos institucionais mostrados na página de contactos. */
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
