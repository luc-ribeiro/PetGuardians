import styles from './Footer.module.css'
import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from '../assets/logo-footer.svg'

import iconFacebook from '../assets/icon-facebook.svg'
import iconInstagram from '../assets/icon-instagram.svg'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.gridFooter} container`}>
        <div className={styles.logoCopyFooter}>
          <Logo />
          <p>Copyright © 2022 - PetGuardians | Política de Privacidade</p>
        </div>

        <div className={styles.navLinksFooter}>
          <ul className={styles.navFooter}>
            <li>
              <Link to="/quem-somos">Quem somos</Link>
            </li>
            <li>
              <Link to="/fale-conosco">Fale Conosco</Link>
            </li>
            <li>
              <Link to="/como-ajudar">FAQ</Link>
            </li>
          </ul>

          <ul className={styles.navSocials}>
            <li>
              <a href="https://www.instagram.com" target="_blank">
                <img src={iconInstagram} alt="Ícone do Instagram" />
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com" target="_blank">
                <img src={iconFacebook} alt="Ícone do Facebook" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
