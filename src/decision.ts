/**
 * Lógica de decisão da ferramenta CEIC.
 *
 * IMPORTANTE (para quem edita este ficheiro):
 * As perguntas e as regras abaixo são um ponto de partida razoável, mas NÃO
 * substituem a legislação aplicável nem o parecer da própria CEIC. Ajuste os
 * textos e as regras (`evaluate`) conforme o enquadramento legal que pretende
 * refletir. Tudo é orientado por dados para facilitar a manutenção.
 */

export type Answer = 'sim' | 'nao'

export interface Question {
  id: string
  text: string
  help?: string
}

/** Perguntas apresentadas ao utilizador, por ordem. */
export const QUESTIONS: Question[] = [
  {
    id: 'envolveHumanos',
    text: 'O projeto envolve seres humanos, os seus dados pessoais/de saúde, ou amostras biológicas humanas?',
    help: 'Inclui inquéritos, entrevistas, dados clínicos, registos de saúde ou colheita de amostras.',
  },
  {
    id: 'ensaioMedicamento',
    text: 'É um ensaio clínico com medicamento(s) de uso humano?',
    help: 'Estudo que avalia a segurança ou eficácia de um medicamento.',
  },
  {
    id: 'dispositivoMedico',
    text: 'É uma investigação clínica com dispositivo médico?',
    help: 'Avaliação de um dispositivo médico em seres humanos.',
  },
  {
    id: 'intervencao',
    text: 'Envolve alguma intervenção nos participantes para fins do estudo?',
    help: 'Procedimentos, colheitas adicionais, alteração de tratamento, testes ou questionários feitos por causa do estudo.',
  },
  {
    id: 'dadosIdentificaveis',
    text: 'Vai usar dados ou amostras identificáveis ou codificados (isto é, não totalmente anonimizados)?',
    help: 'Se for possível, direta ou indiretamente, associar os dados a uma pessoa.',
  },
  {
    id: 'instituicaoSaude',
    text: 'Decorre numa instituição de saúde, ou usa dados de utentes/profissionais de saúde?',
    help: 'Hospitais, centros de saúde, unidades do SNS ou privadas, ou os seus registos.',
  },
]

export type Verdict = 'required' | 'likely_required' | 'not_required' | 'consult'

export interface Result {
  verdict: Verdict
  title: string
  summary: string
  reasons: string[]
}

export type Answers = Partial<Record<string, Answer>>

/**
 * Avalia as respostas e devolve um veredito.
 * Edite as regras abaixo para refletir o enquadramento pretendido.
 */
export function evaluate(a: Answers): Result {
  const reasons: string[] = []
  const yes = (id: string) => a[id] === 'sim'

  // 1. Fora do âmbito: não envolve pessoas nem dados/amostras humanas.
  if (a['envolveHumanos'] === 'nao') {
    return {
      verdict: 'not_required',
      title: 'Provavelmente NÃO precisa de aprovação da CEIC',
      summary:
        'O projeto, tal como descrito, não envolve seres humanos, dados de saúde nem amostras biológicas humanas, pelo que tende a ficar fora do âmbito da investigação clínica.',
      reasons: ['Não envolve seres humanos, dados de saúde ou amostras biológicas humanas.'],
    }
  }

  // 2. Ensaio de medicamento ou investigação com dispositivo médico -> requer.
  if (yes('ensaioMedicamento') || yes('dispositivoMedico')) {
    if (yes('ensaioMedicamento')) reasons.push('É um ensaio clínico com medicamento.')
    if (yes('dispositivoMedico')) reasons.push('É uma investigação clínica com dispositivo médico.')
    return {
      verdict: 'required',
      title: 'Precisa de aprovação da CEIC',
      summary:
        'Ensaios clínicos com medicamentos e investigações clínicas com dispositivos médicos requerem parecer da CEIC (e, tipicamente, também autorização do INFARMED).',
      reasons,
    }
  }

  // 3. Estudo com intervenção nos participantes -> muito provavelmente requer.
  if (yes('intervencao')) {
    reasons.push('Existe intervenção nos participantes para fins do estudo.')
    return {
      verdict: 'likely_required',
      title: 'Muito provavelmente precisa de aprovação da CEIC',
      summary:
        'Estudos que implicam uma intervenção nos participantes envolvem, em regra, apreciação por uma comissão de ética competente.',
      reasons,
    }
  }

  // 4. Estudo observacional com dados de saúde identificáveis -> provavelmente requer.
  if (yes('dadosIdentificaveis') && yes('instituicaoSaude')) {
    reasons.push('Usa dados de saúde identificáveis ou codificados.')
    reasons.push('Decorre em contexto de instituição de saúde / dados de utentes.')
    return {
      verdict: 'likely_required',
      title: 'Provavelmente precisa de aprovação de uma comissão de ética',
      summary:
        'Estudos observacionais que usam dados de saúde identificáveis em contexto clínico costumam exigir parecer ético (CEIC ou a comissão de ética da instituição). Confirme qual é a competente para o seu caso.',
      reasons,
    }
  }

  // 5. Restantes casos -> aconselhar confirmação.
  if (yes('dadosIdentificaveis')) reasons.push('Usa dados/amostras identificáveis ou codificados.')
  if (yes('instituicaoSaude')) reasons.push('Envolve contexto ou dados de instituição de saúde.')
  reasons.push('O caso não é linear com base nas respostas dadas.')
  return {
    verdict: 'consult',
    title: 'Recomenda-se confirmar junto da CEIC',
    summary:
      'Com base nas respostas, não é claro se a aprovação é obrigatória. Recomenda-se contactar a CEIC ou a comissão de ética da instituição para confirmar o enquadramento.',
    reasons,
  }
}
