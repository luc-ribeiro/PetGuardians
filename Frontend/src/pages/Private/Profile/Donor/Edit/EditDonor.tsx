import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as yup from 'yup'

import useAuth from '../../../../../hooks/useAuth'
import usePrivateApi from '../../../../../hooks/useAxiosPrivate'

import styles from './EditDonor.module.css'

import { ReactComponent as IconBack } from '../../../../../assets/icon-back.svg'
import { Header } from '../../../../../components/Header'
import { Footer } from '../../../../../components/Footer'
import { Breadcrumb } from '../../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../../components/Profiles/Avatar'
import { Input } from '../../../../../components/Forms/Input'
import { Select } from '../../../../../components/Forms/Select'
import { Button } from '../../../../../components/Forms/Button'


import { DonorType } from '../../../../../types/Donor'
import { CEPQueryResponse } from '../../../../../types/CEP'
import { IBGEUFResponse } from '../../../../../types/UF'
import { IBGECityResponse } from '../../../../../types/City'
import { formatTelephone, formatCep, formatCpf, cleanFormat, formatDate } from '../../../../../utils/stringFormatter'
import { CitiesType } from '../../../../../types/Cities'

export function EditDonorProfile() {
  const { auth, setAuth } = useAuth();
  const profileRef = useRef<HTMLInputElement>(null);
  const api = usePrivateApi()
  const navigate = useNavigate()

  const [donor, setDonor] = useState({} as DonorType)
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<CitiesType>({});
  const [cep, setCep] = useState('');
  const [cpf, setCpf] = useState('');
  const [telephone, setTelephone] = useState('');
  const [previewImage, setPreviewImage] = useState<string>('')
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  const pfp = donor.profilePicture ? `data:${donor.profilePictureMimeType};base64,${donor.profilePicture}` : undefined;

  useEffect(() => {
    var isMounted = true
    const abort = new AbortController();
    const fetchProfile = async () => {
      try {
        const response = await api.get(`donor/${auth?.id}`, { signal: abort.signal });
        isMounted && setDonor(response.data);
      } catch (error) { }
    }
    const fetchEstados = async () => {
      const response = (await axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados', { signal: abort.signal })).data;
      isMounted && setUfs(response.map(uf => uf.sigla));
    }
    fetchProfile();
    fetchEstados();
    return () => {
      isMounted = false;
      abort.abort();
    }
  }, []);

  /* Consultar Endereço */
  useEffect(() => {
    var isMounted = true;
    const abort = new AbortController();
    const fetchAddress = async () => {
      const response = (await axios.get<CEPQueryResponse>(`https://brasilapi.com.br/api/cep/v2/${cleanFormat(cep)}`, { signal: abort.signal })).data;
      isMounted && setDonor(prev => ({
        ...prev,
        street: response.street,
        district: response.neighborhood,
        uf: response.state,
        city: response.city
      }));
    }
    cleanFormat(cep).length == 8 && fetchAddress();
    return () => {
      isMounted = false;
      abort.abort();
    }
  }, [cep]);

  /* Consultar Cidades */
  useEffect(() => {
    if (!donor.uf || cities[donor.uf]) {
      return;
    }
    var isMounted = true;
    const abort = new AbortController();
    const fetchCities = async () => {
      const response = (await axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${donor.uf}/municipios`, { signal: abort.signal })).data;
      isMounted && setCities(prev => ({ ...prev, [donor.uf]: response.map(city => city.nome) }));
    }
    fetchCities();
    return () => {
      isMounted = false;
      abort.abort();
    }
  }, [donor.uf]);

  const handleInputChange = (e: any) => {
    setDonor(prev => ({ ...prev, [e.target.name]: e.target.value }))
  };
  const handleProfilePicture = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return
    }
    const selectedImage = event.target.files.item(0);
    if (selectedImage) {
      setProfilePicture(selectedImage)
      setPreviewImage(URL.createObjectURL(selectedImage));
    }
  };
  const handleCepChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCep(formatCep(e.target.value));
    setDonor(prev => ({ ...prev, cep: cleanFormat(e.target.value) }));
  };
  const handleCpfChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(event.target.value))
    setDonor(prev => ({ ...prev, gcg: cleanFormat(event.target.value) }));
  };
  const handleTelephoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTelephone(formatTelephone(event.target.value))
    setDonor(prev => ({ ...prev, telephone: cleanFormat(event.target.value) }));
  };

  async function validate() {
    let schema = yup.object().shape({
      street: yup.string().required('Erro: Necessário preencher o nome da rua'),
      cep: yup.string().required('Erro: Necessário preencher o CEP'),
      telephone: yup.string().required('Erro: Necessário preencher o telefone'),
      birthday: yup.string().required('Erro: Necessário preencher o nome fantasia'),
      gcg: yup.string().required('Erro: Necessário preencher o CNPJ'),
      name: yup.string().required('Erro: Necessário preencher o campo nome'),
    })

    try {
      await schema.validate(donor)
      return true
    } catch (err) {
      setStatus({
        type: 'error',
        message: (err as any).errors,
      })
      return false
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!donor) {
      return;
    }

    if (!(await validate())) {
      return;
    }

    const data = new FormData();
    data.append('cep', donor.cep);
    data.append('uf', donor.uf);
    data.append('city', donor.city);
    data.append('street', donor.street);
    data.append('streetNumber', donor.streetNumber);
    data.append('district', donor.district);
    data.append('complement', donor.complement);
    data.append('telephone', donor.telephone);
    data.append('profilePicture', profilePicture as Blob);
    
    data.append('fullName', donor.name);
    data.append('birthday', donor.birthday);

    try {
      await api.patch('donor', data, { headers: { 'Content-Type': 'application/x-www-url-formencoded' } })
      alert('Cadastro atualizado com sucesso');
      setAuth(prev => prev && { ...prev, profilePicture: previewImage || pfp });
      navigate(`/profile/donor/${auth?.id}`);
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb type="Doador" to={donor.name} />
          <Avatar src={previewImage || pfp} />
          <input
            ref={profileRef}
            onChange={handleProfilePicture}
            style={{ display: 'none' }}
            type="file"
            id='input_profile_picture'
            accept=".jpeg, .png, .jpg"
          />
          <button className={styles.button} onClick={() => profileRef?.current?.click()}>Trocar foto</button>
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <Link to={`/profile/donor/${auth?.id}`}>
              <IconBack />
            </Link>
            <h1>Editar perfil</h1>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Nome completo"
              type="text"
              name="name"
              value={donor.name}
              onChange={handleInputChange}
            />

            <Input
              label="CPF"
              type="text"
              width="100%"
              name="gcg"
              value={cpf || formatCpf(donor.gcg || '')}
              onChange={handleCpfChange}
            />

            <div className={styles.row}>
              <Input
                label="Data de nascimento"
                type="date"
                width="40%"
                name="birthday"
                value={donor.birthday || donor.birthday ? formatDate(new Date(donor.birthday)) : formatDate(new Date())}
                onChange={handleInputChange}
              />

              <Input
                label="Telefone"
                type="text"
                name="telephone"
                onChange={handleTelephoneChange}
                value={telephone || formatTelephone(donor.telephone || '')}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="CEP"
                type="text"
                width="28%"
                name="cep"
                value={cep || formatCep(donor.cep || '')}
                onChange={handleCepChange}
              />

              <Select
                label="UF"
                name="UF"
                value={donor.uf}
                onChange={handleInputChange}
                options={ufs.map(uf => ({
                  label: uf,
                  value: uf,
                }))}
                width="20%"
              />

              <Select
                label="Cidade"
                name="city"
                value={donor.city}
                onChange={handleInputChange}
                options={
                  !cities[donor.uf]
                    ? [{ value: '', label: 'Selecione um Estado' }]
                    : cities[donor.uf].map(city => ({
                      label: city,
                      value: city,
                    }))
                }
                width="50%"
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Endereço"
                type="text"
                name="street"
                value={donor.street}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Número"
                type="text"
                width="30%"
                name="streetNumber"
                value={donor.streetNumber}
                onChange={handleInputChange}
              />

              <Input
                label="Bairro"
                type="text"
                name="district"
                value={donor.district}
                onChange={handleInputChange}
              />

              <Input
                label="Complemento"
                type="text"
                name="complement"
                value={donor.complement}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.divider}></div>

            {status.type === 'success' ? (
              <p style={{ color: 'green' }}>{status.message}</p>
            ) : (
              ''
            )}
            {status.type === 'error' ? (
              <p style={{ color: '#ff0000' }}>{status.message}</p>
            ) : (
              ''
            )}

            <Button type="submit">Cadastrar</Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
