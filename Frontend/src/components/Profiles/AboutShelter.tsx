import styles from './AboutShelter.module.css'

import ShelterImage1 from '../../assets/shelter-image-1.jpg'
import ShelterImage2 from '../../assets/shelter-image-2.jpg'
import ShelterImage3 from '../../assets/shelter-image-3.jpg'
import ShelterImage4 from '../../assets/shelter-image-4.jpg'

export function AboutShelter() {
  return (
    <div className={styles.aboutContainer}>
      <h3>Sobre nós</h3>

      <p className={styles.aboutText}>
        Abrigamos cães e gatos abandonados, nosso abrigo funciona desde 2018 e
        estamos sempre dispostos a cuidar desses anjos de quatro patas. Temos
        parceria com o Petshop CatDog e com a veterinária PetCare. Toda ajuda é
        bem-vinda!
      </p>

      <div className={styles.imageContainer}>
        <img src={ShelterImage1} alt="" />
        <img src={ShelterImage2} alt="" />
        <img src={ShelterImage3} alt="" />
        <img src={ShelterImage4} alt="" />
      </div>
    </div>
  )
}
