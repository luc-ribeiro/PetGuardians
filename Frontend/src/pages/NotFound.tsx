import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

import styles from './NotFound.module.css'

export function NotFound() {
  return (
    <>
      <Header />
      <div className={`${styles.notFound} container`}>
        <h1>Erro: 404</h1>
        <p>Página não encontrada.</p>
      </div>
      <Footer />
    </>
  )
}
