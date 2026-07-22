import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AuthorsPage from './pages/AuthorsPage'
import AboutPage from './pages/AboutPage'
import GenAiPage from './pages/GenAiPage'

function useHashRoute(): string {
  const parse = () => (window.location.hash || '#/').split('?')[0] || '#/'
  const [hash, setHash] = useState(parse)
  useEffect(() => {
    const onChange = () => {
      setHash(parse())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const route = useHashRoute()

  return (
    <div className="app">
      <Header current={route} />
      <main className="container">
        {route === '#/autores' ? (
          <AuthorsPage />
        ) : route === '#/sobre' ? (
          <AboutPage />
        ) : route === '#/genai' ? (
          <GenAiPage />
        ) : (
          <HomePage />
        )}
      </main>
      <Footer />
    </div>
  )
}
