import { useState } from "react";

import styles from "./Header.module.css";
import { Link, NavLink } from "react-router-dom";

import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as IconSearch } from "../assets/icon-search.svg";

export function Header() {
	const [teste, setTeste] = useState(true);

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

				<div className={styles.navLogin}>
					{teste ? (
						<>
							<Link to="/login">Entrar</Link>

							<Link className={styles.navButton} to="/cadastrar">
								Cadastrar
							</Link>
						</>
					) : (
						<>
							<h2>Teste</h2>
						</>
					)}
				</div>
			</nav>
		</header>
	);
}
