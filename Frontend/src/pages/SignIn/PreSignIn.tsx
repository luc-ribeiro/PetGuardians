import styles from './PreSignIn.module.css'

import { Link } from 'react-router-dom'
import imgPreSignIn from '../../assets/presignin-img.jpg'
import { ReactComponent as IconBack } from '../../assets/icon-back.svg'
import logo from '../../assets/logo.svg'

export function PreSignIn() {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.formImage}>
        <img src={imgPreSignIn} alt="" />
      </div>
      <div className={styles.formArea}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="" />
        </div>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <Link to="../login">
              <IconBack />
            </Link>
            <h1>Cadastro</h1>
          </div>

          <div className={styles.linksContainer}>
            <p>Selecione o tipo de cadastro</p>
            <Link className={styles.donor} to="doador">
              Sou doador e quero ajudar um abrigo
            </Link>
            <Link className={styles.shelter} to="abrigo">
              Sou um abrigo e quero me cadastrar
            </Link>
            <Link className={styles.vet} to="veterinario">
              Sou veterinário
            </Link>
            <Link className={styles.partner} to="parceiro">
              Sou parceiro de um abrigo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
