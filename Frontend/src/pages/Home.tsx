import styles from './Home.module.css'

import introImg from '../assets/intro-img.png'

import icon from '../assets/icon.svg'
import icon1 from '../assets/icon-1.svg'
import icon2 from '../assets/icon-2.svg'
import icon3 from '../assets/icon-3.svg'

import citeImg from '../assets/section-cite.jpg'

import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Link } from 'react-router-dom'

export function Home() {
  return (
    <>
      <Header />

      <main className={`${styles.main} container`}>
        <div className={styles.introText}>
          <h1>Conectamos doadores e abrigos de animais</h1>
          <p>
            Faça a diferença na vida de um bichinho que está em um abrigo.
            Cadastre-se, escolha um abrigo e realize um ato de amor.
          </p>
          <Link className={styles.button} to="/login">
            Quero Ajudar
          </Link>
        </div>

        <div className={styles.introImg}>
          <img
            src={introImg}
            alt="Imagem ilustrativa de uma pessoa e um gato"
          />
        </div>
      </main>

      <section className={`${styles.cardSection} container`}>
        <div className={styles.cardSectionHeader}>
          <h2>Conheça a PetGuardians</h2>
          <p>Entenda como funciona</p>
        </div>

        <ul className={styles.cardContainer}>
          <li className={styles.cards}>
            <img src={icon} alt="Ícone de usuário" />
            <h3>Cadastre-se</h3>
            <p>Faça seu cadastro como abrigo, doador ou nosso parceiro.</p>
          </li>

          <li className={styles.cards}>
            <img src={icon1} alt="Ícone de lupa" />
            <h3>Encontre um abrigo</h3>
            <p>Acesse o mapa e encontre um abrigo para realizar uma doação.</p>
          </li>

          <li className={styles.cards}>
            <img src={icon2} alt="Ícone de cachorro" />
            <h3>Escolha como doar</h3>
            <p>
              Escolha a forma de doação, é possível doar em dinheiro ou
              suprimentos.
            </p>
          </li>

          <li className={styles.cards}>
            <img src={icon3} alt="Ícone de coração" />
            <h3>Mude vidas</h3>
            <p>Sua doação irá fazer a diferença na vida dos bichinhos.</p>
          </li>
        </ul>
      </section>

      <section className={styles.citeSection}>
        <img
          src={citeImg}
          alt="Imagem com uma citação do Charles Darwin: A compaixão para com os animais é uma das mais nobres virtudes da natureza humana."
        />
      </section>

      <Footer />
    </>
  )
}
