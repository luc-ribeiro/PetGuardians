import styles from './HowTo.module.css'

import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

import { useState } from 'react'

export function HowTo() {
  const [active, setActive] = useState(false)

  function ativarPergunta(event) {
    const pergunta = event.currentTarget

    // const controls = pergunta.getAttribute('aria-controls')
    // const resposta = document.getElementById(controls)

    // resposta.classList.toggle('ativa')
    // const ativa = resposta.classList.contains('ativa')
    // pergunta.setAttribute('aria-expanded', ativa)
  }

  return (
    <>
      <Header />

      <section className={`${styles.howToSection} container`}>
        <div className={styles.howToTitle}>
          <h1>Como ajudar</h1>
        </div>

        <dl className={styles.questions}>
          <div>
            <dt>
              <button
                onClick={ativarPergunta}
                aria-controls="pergunta1"
                aria-expanded="true"
              >
                Como funciona?
              </button>
            </dt>
            <dd id="pergunta1">Trabalhamos de forma x.</dd>
          </div>

          <div>
            <dt>
              <button
                onClick={ativarPergunta}
                aria-controls="pergunta2"
                aria-expanded="false"
              >
                Como funciona?
              </button>
            </dt>
            <dd id="pergunta2">Trabalhamos de forma x.</dd>
          </div>
        </dl>
      </section>

      <Footer />
    </>
  )
}
