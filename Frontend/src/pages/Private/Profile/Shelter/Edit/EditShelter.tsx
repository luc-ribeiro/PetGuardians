import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { api } from "../../../../../services/api";
import * as yup from "yup";

import styles from "./EditShelter.module.css";

import { ReactComponent as IconBack } from "../../../../../assets/icon-back.svg";

import { Header } from "../../../../../components/Header";
import { Footer } from "../../../../../components/Footer";
import { Breadcrumb } from "../../../../../components/Profiles/Breadcrumb";
import { Avatar } from "../../../../../components/Profiles/Avatar";

import { Input } from "../../../../../components/Forms/Input";
import { Select } from "../../../../../components/Forms/Select";
import { TextArea } from "../../../../../components/Forms/TextArea";
import { Button } from "../../../../../components/Forms/Button";
import { ShelterProfile } from "../Shelter";
import { useForm } from "react-hook-form";

interface Shelter {
	id: number;
	corporateName: string;
	name: string;
	birthday: string;
	cpf: string;
	cnpj: string;
	uf: string;
	city: string;
	cep: string;
	street: string;
	streetNumber: string;
	district: string;
	complement: string;
	about: string;
	email: string;
	password: string;
}

interface ShelterParams {
	id: string;
}

interface IBGEUFResponse {
	sigla: string;
}

interface IBGECityResponse {
	nome: string;
}

export function EditShelterProfile() {
	const navigate = useNavigate();
	const { id } = useParams<string>();
	const [shelter, setShelter] = useState<Shelter>();

	const [shelterName, setShelterName] = useState("");
	const [shelterOwnerName, setShelterOwnerName] = useState("");
	const [shelterCNPJ, setShelterCNPJ] = useState("");
	const [shelterOwnerCPF, setShelterOwnerCPF] = useState("");
	const [shelterBirthday, setShelterBirthday] = useState("");

	const [shelterCEP, setShelterCEP] = useState("");
	const [shelterStreet, setShelterStreet] = useState("");
	const [shelterStreetNumber, setShelterStreetNumber] = useState("");
	const [shelterDistrict, setShelterDistrict] = useState("");
	const [shelterComplement, setShelterComplement] = useState("");

	const [shelterEmail, setShelterEmail] = useState("");
	const [shelterPassword, setShelterPassword] = useState("");

	const [acceptTerms, setAcceptTerms] = useState(false);

	const [ufs, setUfs] = useState<string[]>([]);
	const [cities, setCities] = useState<string[]>([]);
	const [selectedUf, setSelectedUf] = useState("0");
	const [selectedCity, setSelectedCity] = useState("0");

	const [shelterAbout, setShelterAbout] = useState("");

	const [images, setImages] = useState<File[]>([]);
	const [previewImages, setPreviewImages] = useState<string[]>([]);

	useEffect(() => {
		api.get(`shelter/${id}`).then((response) => {
			setShelter(response.data);
			setShelterName(response.data.corporateName);
			setShelterAbout(response.data.about);
			setShelterCNPJ(response.data.cnpj);
			console.log(response.data);
		});
	}, [id]);

	useEffect(() => {
		axios
			.get<IBGEUFResponse[]>(
				"https://servicodados.ibge.gov.br/api/v1/localidades/estados"
			)
			.then((response) => {
				const ufInitials = response.data.map((uf) => uf.sigla);
				setUfs(ufInitials);
			});
	}, []);

	useEffect(() => {
		// Carregar as cidades sempre que a UF mudar
		if (selectedUf === "0") {
			return;
		}

		axios
			.get<IBGECityResponse[]>(
				`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
			)
			.then((response) => {
				const cityNames = response.data.map((city) => city.nome);
				setCities(cityNames);
			});
	}, [selectedUf]);

	function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
		const uf = event.target.value;
		setSelectedUf(uf);
	}

	function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
		const city = event.target.value;
		setSelectedCity(city);
	}

	function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
		if (!event.target.files) {
			return;
		}
		const selectedImages = Array.from(event.target.files);

		setImages(selectedImages);

		const selectedImagesPreview = selectedImages.map((image) => {
			return URL.createObjectURL(image);
		});
		setPreviewImages(selectedImagesPreview);
	}

	if (!shelter) {
		return <p>Carregando...</p>;
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		const data = new FormData();

		data.append("corporateName", shelterName);
		data.append("name", shelterOwnerName);
		data.append("cnpj", shelterCNPJ);
		data.append("cpf", shelterOwnerCPF);
		data.append("uf", selectedUf);
		data.append("city", selectedCity);
		data.append("cep", shelterCEP);
		data.append("street", shelterStreet);
		data.append("streetNumber", shelterStreetNumber);
		data.append("district", shelterDistrict);
		data.append("complement", shelterComplement);
		data.append("email", shelterEmail);
		data.append("password", shelterPassword);
		data.append("about", shelterAbout);

		try {
			await api.patch(`shelter/${id}`, data, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			alert("Atualização realizada com sucesso");
			navigate(`/perfil/abrigo/${id}`);
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<>
			<Header />
			<div className={`${styles.container} container`}>
				<div className={styles.imageContainer}>
					<Breadcrumb type="Abrigos" to={shelter.corporateName} />
					<Avatar />
					<button className={styles.button}>Trocar foto</button>
				</div>
				<div className={styles.profileContainer}>
					<div className={styles.profileHeader}>
						<Link to={`/perfil/abrigo/${shelter.id}`}>
							<IconBack />
						</Link>
						<h1>Editar perfil</h1>
					</div>

					<form className={styles.form} onSubmit={handleSubmit}>
						<div className={styles.row}>
							<Input
								label="Nome do abrigo"
								type="text"
								name="nomeAbrigo"
								value={shelterName}
								onChange={({ target }) => {
									setShelterName(target.value);
								}}
							/>

							<Input
								label="CNPJ"
								type="text"
								name="cnpj"
								width="100%"
								value={shelter.cnpj}
								onChange={({ target }) => {
									setShelterCNPJ(target.value);
								}}
							/>
						</div>

						<div className={styles.row}>
							<Input
								label="Nome completo do responsável pelo abrigo"
								type="text"
								name="nomeResponsavelAbrigo"
								value={shelter.name}
								onChange={({ target }) => {
									setShelterOwnerName(target.value);
								}}
							/>
						</div>

						<div className={styles.row}>
							<Input
								label="CPF do responsável"
								type="text"
								name="cpf"
								width="100%"
								value={shelter.cpf}
								onChange={({ target }) => {
									setShelterOwnerCPF(target.value);
								}}
							/>
							{/* <Input
                label="Data de nascimento"
                type="date"
                name="dataNascimento"
                width="40%"
                value={shelter.birthday}
                onChange={({ target }) => {
                  setShelterBirthday(target.value)
                }}
              /> */}
						</div>

						<div className={styles.divider}></div>

						<div className={styles.row}>
							<Input
								label="CEP"
								type="text"
								name="cep"
								width="28%"
								value={shelter.cep}
								onChange={({ target }) => {
									setShelterCEP(target.value);
								}}
							/>

							<Select
								name="uf"
								label="UF"
								value={shelter.uf}
								onChange={handleSelectedUf}
								options={ufs.map((uf) => ({
									label: uf,
									value: uf,
								}))}
								width="20%"
							/>

							<Select
								name="city"
								label="Cidade"
								value={shelter.city}
								onChange={handleSelectedCity}
								options={cities.map((city) => ({
									label: city,
									value: city,
								}))}
								width="50%"
							/>
						</div>

						<div className={styles.row}>
							<Input
								label="Endereço"
								type="text"
								name="endereco"
								value={shelter.street}
								onChange={({ target }) => {
									setShelterStreet(target.value);
								}}
							/>
						</div>

						<div className={styles.row}>
							<Input
								label="Número"
								type="text"
								name="enderecoNumero"
								width="30%"
								value={shelter.streetNumber}
								onChange={({ target }) => {
									setShelterStreetNumber(target.value);
								}}
							/>

							<Input
								label="Bairro"
								type="text"
								name="enderecoBairro"
								value={shelter.district}
								onChange={({ target }) => {
									setShelterDistrict(target.value);
								}}
							/>

							<Input
								label="Complemento"
								type="text"
								name="enderecoComplemento"
								value={shelter.complement}
								onChange={({ target }) => {
									setShelterComplement(target.value);
								}}
							/>
						</div>

						<div className={styles.divider}></div>

						<div className={styles.row}>
							<Input
								label="E-mail"
								type="email"
								name="email"
								value={shelter.email}
								onChange={({ target }) => {
									setShelterEmail(target.value);
								}}
							/>

							<Input
								label="Senha"
								type="password"
								name="senha"
								value={shelter.password}
								onChange={({ target }) => {
									setShelterPassword(target.value);
								}}
							/>
						</div>

						<div className={styles.divider}></div>

						<TextArea
							label="Sobre"
							name="sobre"
							value={shelterAbout}
							onChange={({ target }) => {
								setShelterAbout(target.value);
							}}
						/>

						<div className="input-block">
							<label className={styles.label} htmlFor="images">
								Fotos
							</label>

							<div className={styles.imageContainer}>
								{previewImages.map((image) => {
									return (
										<img
											key={image}
											src={image}
											alt=""
										></img>
									);
								})}
								<label
									htmlFor="image[]"
									className={styles.newImage}
								>
									+
								</label>
							</div>
							<input
								multiple
								onChange={handleSelectImages}
								type="file"
								id="image[]"
							/>
						</div>

						<Button type="submit">Salvar</Button>
					</form>
				</div>
			</div>
			<Footer />
		</>
	);
}
