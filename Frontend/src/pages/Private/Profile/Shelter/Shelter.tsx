import styles from "./Shelter.module.css";
import { api } from "../../../../services/api";

import { Link, useParams } from "react-router-dom";

import { Header } from "../../../../components/Header";
import { Footer } from "../../../../components/Footer";
import { Breadcrumb } from "../../../../components/Profiles/Breadcrumb";
import { Avatar } from "../../../../components/Profiles/Avatar";
import { AboutShelter } from "../../../../components/Profiles/AboutShelter";
import { ProductTable } from "../../../../components/Profiles/ProductTable";
import { PartnerTable } from "../../../../components/Profiles/PartnerTable";
import { Table } from "../../../../components/Profiles/Table";
import { useEffect, useState } from "react";

interface Shelter {
	id: number;
	corporateName: string;
	cnpj: string;
	uf: string;
	city: string;
	cep: string;
	street: string;
	streetNumber: string;
	district: string;
	complement: string;
	about?: string;
}

interface ShelterParams {
	id: string;
}

export function ShelterProfile() {
	const params = useParams<string>();
	const [shelter, setShelter] = useState<Shelter>();

	useEffect(() => {
		api.get(`shelter/${params.id}`).then((response) => {
			setShelter(response.data);
		});
	}, [params.id]);

	if (!shelter) {
		return <p>Carregando...</p>;
	}

	return (
		<>
			<Header />
			<div className={`${styles.container} container`}>
				<div className={styles.imageContainer}>
					<Breadcrumb type="Abrigos" to={shelter.corporateName} />
					<Avatar />
				</div>
				<div className={styles.profileContainer}>
					<div className={styles.profileHeader}>
						<h1 className={styles.userName}>
							{shelter.corporateName}
						</h1>
						<p className={styles.userCity}>
							{shelter.street} {shelter.streetNumber},{" "}
							{shelter.district}, CEP {shelter.cep},{" "}
							{shelter.city} - {shelter.uf}
						</p>
						<Link className={styles.button} to="editar">
							Editar perfil
						</Link>
					</div>
					<div className={styles.qtdDonationsContainer}>
						<p className={styles.totalDonations}>
							5 <span>doações recebidas</span>
						</p>
					</div>
					<AboutShelter about={shelter?.about} />
					<ProductTable />
					<PartnerTable />
					<Table />
				</div>
			</div>
			<Footer />
		</>
	);
}
