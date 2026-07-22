/**
 * Utilitários para guardar/retomar o estado das ferramentas no URL (parâmetro
 * `?d=`) e no localStorage. Permite retomar mais tarde e partilhar por link.
 */

export function encodeState(obj: unknown): string {
  const json = JSON.stringify(obj)
  const b64 = btoa(unescape(encodeURIComponent(json)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeState<T>(s: string): T | null {
  try {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(b64)))
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

/** Lê o parâmetro `d` da query dentro do hash (ex.: #/genai?d=...). */
export function getStateParam(): string | null {
  const h = window.location.hash
  const qi = h.indexOf('?')
  if (qi < 0) return null
  return new URLSearchParams(h.slice(qi + 1)).get('d')
}

/** Atualiza o URL sem recarregar nem disparar navegação (replaceState). */
export function setStateParam(pathHash: string, data: string | null) {
  const base = window.location.origin + window.location.pathname + window.location.search
  const newHash = data ? `${pathHash}?d=${data}` : pathHash
  window.history.replaceState(null, '', base + newHash)
}

/** URL completo para partilhar. */
export function shareUrl(pathHash: string, data: string): string {
  return `${window.location.origin}${window.location.pathname}${pathHash}?d=${data}`
}

/** Estado inicial: prioriza o URL; caso contrário, o localStorage. */
export function loadInitial<T>(storageKey: string): T | null {
  const p = getStateParam()
  if (p) {
    const s = decodeState<T>(p)
    if (s) return s
  }
  try {
    const ls = localStorage.getItem(storageKey)
    if (ls) return JSON.parse(ls) as T
  } catch {
    /* ignore */
  }
  return null
}

export function persist(storageKey: string, obj: unknown) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(obj))
  } catch {
    /* ignore */
  }
}

export function clearPersisted(storageKey: string) {
  try {
    localStorage.removeItem(storageKey)
  } catch {
    /* ignore */
  }
}
