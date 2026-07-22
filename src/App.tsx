import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AuthorsPage from './pages/AuthorsPage'
import AboutPage from './pages/AboutPage'

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash || '#/')
  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash || '#/')
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
        ) : (
          <HomePage />
        )}
      </main>
      <Footer />
    </div>
  )
}
