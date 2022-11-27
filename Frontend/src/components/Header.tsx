import styles from './Header.module.css'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { ReactComponent as Logo } from '../assets/logo.svg'
import imgPlaceholder from '../assets/avatar-thumbnail.jpg'
import useLogout from '../hooks/useLogout'
import useAuth from '../hooks/useAuth'

export function Header() {
  const logout = useLogout();
  const { auth } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/')
  }

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
            <NavLink to="/parceiros">Parceiros</NavLink>
          </li>
          <li>
            <NavLink to="/abrigos">Abrigos</NavLink>
          </li>
        </ul>

        {/* <form className={styles.navSearch}>
					<input
						type="text"
						name="search"
						id="search"
						placeholder="Pesquisar"
						className={styles.searchInput}
					/>
					<button className={styles.buttonSearch} type="submit">
						<IconSearch />
					</button>
				</form> */}

        {
          !auth
            ? (
              <div className={styles.navLogin}>
                <Link to="/login">Entrar</Link>

                <Link className={styles.navButton} to="/cadastrar">
                  Cadastrar
                </Link>
              </div>
            )
            : (
              <div className={styles.navLogin}>
                <Link to="/meuperfil">
                  <div className={styles.userContainer}>
                    <img className={styles.userAvatar} src={auth.profilePicture || imgPlaceholder} />
                    <p className={styles.userProfile}>Meu perfil</p>
                  </div>
                </Link>
                <button className={styles.logout} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )
        }
      </nav>
    </header>
  )
}
