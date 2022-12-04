import styles from "./About.module.css";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

import aboutImg from "../../assets/img-about.jpg";
import { useState } from "react";

export function About() {
	const [counter, setCounter] = useState(0);
	const [rationNumber, setRationNumber] = useState(0);
	const [shelterNumber, setShelterNumber] = useState(0);
	const [donorNumber, setDonorNumber] = useState(0);

	const increment = setTimeout(() => {
		setRationNumber(rationNumber + 6);
		setShelterNumber(shelterNumber + 4);
		setDonorNumber(donorNumber + 8);
		setCounter(counter + 1);
	}, 100);

	if (counter == 10) {
		clearInterval(increment);
	}

	return (
		<>
			<Header />

			<section className={`${styles.intro} container`}>
				<div className={styles.introText}>
					<h1>
						Conectamos <span>doadores</span> e{" "}
						<span>abrigos de animais</span>
					</h1>
					<p>
						Faça a diferença na vida de um bichinho que está em um
						abrigo. Cadastre-se, escolha um abrigo e realize um ato
						de amor.
					</p>
				</div>
			</section>

			<section className={styles.aboutImg}>
				<img src={aboutImg} alt="Imagem de um cachorro." />
			</section>

			<section className={`${styles.aboutSection} container`}>
				<div>
					<h2>Juntos fazemos a diferença</h2>
				</div>

				<div className={styles.aboutText}>
					<p className={styles.textBold}>
						Lorem Ipsum is simply dummy text of the printing and
						typesetting industry. Lorem Ipsum has been the
						industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and
						scrambled it to make a type specimen book.
					</p>

					<p>
						It has survived not only five centuries, but also the
						leap into electronic typesetting, remaining essentially
						unchanged. It was popularised in the 1960s with the
						release of Letraset sheets containing Lorem Ipsum
						passages, and more recently with desktop publishing
						software like Aldus PageMaker including versions of
						Lorem Ipsum
					</p>
				</div>
			</section>

			<section className={`${styles.counterSection} container`}>
				<ul className={styles.counterList}>
					<li>
						<h4>+ {rationNumber}</h4>
						<p>toneladas de ração doadas</p>
					</li>
					<li>
						<h4>+ {shelterNumber}</h4>
						<p>abrigos e ongs cadastrados</p>
					</li>
					<li>
						<h4>+ {donorNumber}</h4>
						<p>doadores cadastrados</p>
					</li>
				</ul>
			</section>

			<Footer />
		</>
	);
}
