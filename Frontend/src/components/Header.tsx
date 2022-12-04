import styles from './Header.module.css'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { ReactComponent as Logo } from '../assets/logo.svg'
import imgPlaceholder from '../assets/avatar-img.jpg'
import useLogout from '../hooks/useLogout'
import useAuth from '../hooks/useAuth'
import usePrivateApi from '../hooks/useAxiosPrivate'
import { useEffect, useState } from 'react'
import { PersonType } from '../types/Person'

export function Header() {
  const { auth } = useAuth()
  const api = usePrivateApi()
  const navigate = useNavigate()
  const logout = useLogout()

  const [user, setUser] = useState({} as PersonType)

  useEffect(() => {
    var isMounted = true
    const abortController = new AbortController()

    const fetchProfile = async () => {
      try {
        const response = await api.get(
          `${auth?.role.toLowerCase()}/${auth?.id}`,
          { signal: abortController.signal },
        )
        isMounted && setUser(response.data)
      } catch (error) {}
    }

    fetchProfile()

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  async function handleLogout() {
    await logout()
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
            <NavLink to="/partners">Parceiros</NavLink>
          </li>
          <li>
            <NavLink to="/shelters">Abrigos</NavLink>
          </li>
        </ul>

        {!auth ? (
          <div className={styles.navLogin}>
            <Link to="/login">Entrar</Link>

            <Link className={styles.navButton} to="/cadastrar">
              Cadastrar
            </Link>
          </div>
        ) : (
          <div className={styles.navLogin}>
            <Link to={`/profile/${auth.role}/${user.id}`}>
              <div className={styles.userContainer}>
                <img
                  className={styles.userAvatar}
                  src={
                    (user.profilePicture &&
                      `data:${user.profilePictureMimeType};base64,${user.profilePicture}`) ||
                    imgPlaceholder
                  }
                />
                <p className={styles.userProfile}>Meu perfil</p>
              </div>
            </Link>
            <button className={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}
