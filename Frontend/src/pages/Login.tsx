import styles from './Login.module.css'

import { Link } from 'react-router-dom'
import imgLogin from '../assets/login-img.jpg'
import { ReactComponent as IconBack } from '../assets/icon-back.svg'
import logo from '../assets/logo.svg'
import { Input } from '../components/Forms/Input'
import { Button } from '../components/Forms/Button'

export function Login() {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.formImage}>
        <img src={imgLogin} alt="" />
      </div>
      <div className={styles.formArea}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="" />
        </div>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <Link to="/">
              <IconBack />
            </Link>
            <h1>Login</h1>
          </div>
          <form className={styles.form}>
            <Input placeholder="E-mail" type="e-mail" name="email" />
            <Input placeholder="Senha" type="password" name="password" />
            <Link to="/esqueci-a-senha">Esqueci minha senha</Link>
            <Button type="submit">Entrar</Button>
          </form>

          <p className={styles.signIn}>
            Não tem uma conta? <Link to="../cadastrar">Cadastre-se!</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
