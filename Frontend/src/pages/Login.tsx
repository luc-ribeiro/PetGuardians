import { FormEvent, useState } from 'react'
import styles from './Login.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import imgLogin from '../assets/login-img.jpg'
import { ReactComponent as IconBack } from '../assets/icon-back.svg'
import logo from '../assets/logo.svg'
import { Input } from '../components/Forms/Input'
import { Button } from '../components/Forms/Button'
import { api } from '../services/api'
import useAuth from '../hooks/useAuth';
import { AuthType } from '../types/Auth'

export function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate()
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    if (!email || !password) {
      return;
    }
    try {

      const response = await api.post('auth/login', { email, password });
      const refresh: AuthType = response?.data;
      setAuth(refresh);
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error)
    }
  }

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
          <form className={styles.form} onSubmit={handleLogin}>
            <Input
              placeholder="E-mail"
              type="e-mail"
              value={email}
              onChange={({ target }) => {
                setEmail(target.value)
              }}
            />
            <Input
              placeholder="Senha"
              type="password"
              value={password}
              onChange={({ target }) => {
                setPassword(target.value)
              }}
            />
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
