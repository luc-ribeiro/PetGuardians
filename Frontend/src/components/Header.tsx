import styles from './Header.module.css'
import { Link, NavLink } from 'react-router-dom'

import { Input } from './Forms/Input'

import { ReactComponent as Logo } from '../assets/logo.svg'
import { ReactComponent as IconSearch } from '../assets/icon-search.svg'

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`}>
        <Link className={styles.logo} to="/">
          <Logo />
        </Link>

        <ul className={styles.navMenu}>
          <li>
            <NavLink to="/quem-somos">Quem somos</NavLink>
          </li>
          <li>
            <NavLink to="/como-ajudar">Como ajudar</NavLink>
          </li>
          <li>
            <NavLink to="/abrigos">Abrigos</NavLink>
          </li>
        </ul>

        <form className={styles.navSearch}>
          <Input type="text" name="Pesquisar" placeholder="Pesquisar" />
          <button className={styles.buttonSearch} type="submit">
            <IconSearch />
          </button>
        </form>

        <div className={styles.navLogin}>
          <Link to="/login">Entrar</Link>

          <Link className={styles.navButton} to="/cadastrar">
            Cadastrar
          </Link>
        </div>
      </nav>
    </header>
  )
}
