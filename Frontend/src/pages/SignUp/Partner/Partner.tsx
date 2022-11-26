import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { api } from "../../../services/api";

import styles from "./Partner.module.css";

import imgSignIn from "../../../assets/partnersignin-img.jpg";
import { ReactComponent as IconBack } from "../../../assets/icon-back.svg";
import logo from "../../../assets/logo.svg";

import { Input } from "../../../components/Forms/Input";
import { Select } from "../../../components/Forms/Select";
import { Checkbox } from "../../../components/Forms/Checkbox";
import { Button } from "../../../components/Forms/Button";

interface CNPJQueryResponse {
	razao_social: string;
	nome_fantasia: string;
	bairro: string;
	cep: string;
	complemento: string;
	logradouro: string;
	numero: string;
	uf: string;
	municipio: string;
}

interface IBGEUFResponse {
	sigla: string;
}

interface IBGECityResponse {
	nome: string;
}

export function PartnerSignUp() {
	const navigate = useNavigate();

	const [acceptTerms, setAcceptTerms] = useState(false);
	const [ufs, setUfs] = useState<string[]>([]);
	const [cities, setCities] = useState<string[]>([]);
	const [selectedUf, setSelectedUf] = useState("0");
	const [selectedCity, setSelectedCity] = useState("0");

	const [status, setStatus] = useState({
		type: "",
		message: "",
	});

	const [partner, setPartner] = useState({
		name: "",
		fantasyName: "",
		CNPJ: "",
		CEP: "",
		street: "",
		streetNumber: "",
		district: "",
		complement: "",
		uf: selectedUf,
		city: selectedCity,
		email: "",
		password: "",
	});

	const valueInput = (e: any) =>
		setPartner({ ...partner, [e.target.name]: e.target.value });

	useEffect(() => {
		axios
			.get<CNPJQueryResponse>(
				`https://brasilapi.com.br/api/cnpj/v1/${partner.CNPJ}`
			)
			.then((response) => {
				setPartner({
					name: response.data.razao_social,
					CEP: response.data.cep,
					street: response.data.logradouro,
					streetNumber: response.data.numero,
					district: response.data.bairro,
					complement: response.data.complemento,
					uf: response.data.uf,
					city: response.data.municipio,
				} as any);
			});
	}, [partner.CNPJ]);

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
	}, [selectedUf, partner.CNPJ]);

	async function validate() {
		let schema = yup.object().shape({
			password: yup
				.string()
				.required("Erro: Necessário preencher o campo senha")
				.min(6, "Erro: A senha deve ter no mínimo 6 caracteres"),

			email: yup
				.string()
				.required("Erro: Necessário preencher o campo e-mail")
				.email("Erro: Necessário preencher o campo com e-mail válido"),

			name: yup
				.string()
				.required("Erro: Necessário preencher o campo nome"),
		});

		try {
			await schema.validate(partner);
			return true;
		} catch (err) {
			setStatus({
				type: "error",
				message: (err as any).errors,
			});
			return false;
		}
	}

	function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
		const uf = event.target.value;
		setSelectedUf(uf);
	}

	function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
		const city = event.target.value;
		setSelectedCity(city);
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		if (!(await validate())) return;

		const data = new FormData();

		data.append("name", partner.name);
		data.append("fantasyName", partner.fantasyName);
		data.append("cnpj", partner.CNPJ);

		data.append("uf", partner.uf);
		data.append("city", selectedCity);
		data.append("cep", partner.CEP);
		data.append("street", partner.street);
		data.append("streetNumber", partner.streetNumber);
		data.append("district", partner.district);
		data.append("complement", partner.complement);

		data.append("email", partner.email);
		data.append("password", partner.password);

		try {
			await api.post("partner", data, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			alert("Cadastro realizado com sucesso");
			navigate("/perfil/parceiro");
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div className={styles.formWrapper}>
			<div className={styles.formImage}>
				<img src={imgSignIn} alt="" />
			</div>
			<div className={styles.formArea}>
				<div className={styles.logoContainer}>
					<img src={logo} alt="" />
				</div>
				<div className={styles.formContainer}>
					<div className={styles.formHeader}>
						<Link to="/cadastrar">
							<IconBack />
						</Link>
						<h1>Cadastro de Parceiro</h1>
					</div>

					<form className={styles.form} onSubmit={handleSubmit}>
						<div className={styles.row}>
							<Input
								label="Razão Social"
								type="text"
								name="name"
								value={partner.name}
								onChange={valueInput}
							/>

							<Input
								label="CNPJ"
								type="text"
								width="100%"
								name="CNPJ"
								value={partner.CNPJ}
								onChange={valueInput}
							/>
						</div>

						<div className={styles.row}>
							<Input
								label="Nome Fantasia"
								type="text"
								name="fantasyName"
								value={partner.fantasyName}
								onChange={valueInput}
							/>
						</div>

						<div className={styles.divider}></div>

						<div className={styles.row}>
							<Input
								label="CEP"
								type="text"
								width="28%"
								name="CEP"
								value={partner.CEP}
								onChange={valueInput}
							/>

							<Select
								label="UF"
								name="uf"
								value={selectedUf}
								onChange={handleSelectedUf}
								options={ufs.map((uf) => ({
									label: uf,
									value: uf,
								}))}
								width="20%"
							/>

							<Select
								label="Cidade"
								name="city"
								value={selectedCity}
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
								name="street"
								value={partner.street}
								onChange={valueInput}
							/>
						</div>

						<div className={styles.row}>
							<Input
								label="Número"
								type="text"
								width="30%"
								name="streetNumber"
								value={partner.streetNumber}
								onChange={valueInput}
							/>

							<Input
								label="Bairro"
								type="text"
								value={partner.district}
								onChange={valueInput}
								name="district"
							/>

							<Input
								label="Complemento"
								type="text"
								value={partner.complement}
								onChange={valueInput}
								name="complement"
							/>
						</div>

						<div className={styles.divider}></div>

						<div className={styles.row}>
							<Input
								label="E-mail"
								type="email"
								name="email"
								value={partner.email}
								onChange={valueInput}
							/>

							<Input
								label="Senha"
								type="password"
								value={partner.password}
								onChange={valueInput}
								name="password"
							/>
						</div>

						<div className={styles.row}>
							<Checkbox
								label="Concordo com os termos e condições"
								name="termos"
								onClick={() => setAcceptTerms(true)}
							/>
						</div>

						{status.type === "success" ? (
							<p style={{ color: "green" }}>{status.message}</p>
						) : (
							""
						)}
						{status.type === "error" ? (
							<p style={{ color: "#ff0000" }}>{status.message}</p>
						) : (
							""
						)}

						<Button type="submit">Cadastrar</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
