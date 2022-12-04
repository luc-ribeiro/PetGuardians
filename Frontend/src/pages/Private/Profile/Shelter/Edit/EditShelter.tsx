import { ChangeEvent, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as yup from 'yup'
import useAuth from '../../../../../hooks/useAuth'
import usePrivateApi from '../../../../../hooks/useAxiosPrivate'

import styles from './EditShelter.module.css'

import { Header } from '../../../../../components/Header'
import { Breadcrumb } from '../../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../../components/Profiles/Avatar'
import { ReactComponent as IconBack } from '../../../../../assets/icon-back.svg'
import { Input } from '../../../../../components/Forms/Input'
import { Select } from '../../../../../components/Forms/Select'
import { Button } from '../../../../../components/Forms/Button'
import { Footer } from '../../../../../components/Footer'

import { ShelterType } from '../../../../../types/Shelter'
import { CEPQueryResponse } from '../../../../../types/CEP'
import { CNPJQueryResponse } from '../../../../../types/CNPJ'
import { IBGEUFResponse } from '../../../../../types/UF'
import { IBGECityResponse } from '../../../../../types/City'
import { formatTelephone, formatCep, cleanFormat, formatCnpj } from '../../../../../utils/stringFormatter'
import { TextArea } from '../../../../../components/Forms/TextArea'
import { CitiesType } from '../../../../../types/Cities'

interface ImagePreviewType {
  file: File,
  preview: string,
  remove: boolean
}
export function EditShelterProfile() {
  const { auth, setAuth } = useAuth();
  const profileRef = useRef<HTMLInputElement>(null);
  const api = usePrivateApi();
  const navigate = useNavigate();

  const [shelter, setShelter] = useState({} as ShelterType);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<CitiesType>({});
  const [cep, setCep] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telephone, setTelephone] = useState('');
  const [profilePicture, setProfilePicture] = useState<ImagePreviewType | null>(null);
  const [newImages, setNewImages] = useState<ImagePreviewType[]>([]);
  const [removeImages, setRemoveImages] = useState<number[]>([]);
  const [status, setStatus] = useState({ type: '', message: '' });

  const pfp = shelter.profilePicture ? `data:${shelter.profilePictureMimeType};base64,${shelter.profilePicture}` : undefined;

  useEffect(() => {
    var isMounted = true
    const abortController = new AbortController();
    const fetchProfile = async () => {
      try {
        const response = await api.get(`shelter/${auth?.id}`, { signal: abortController.signal })
        isMounted && setShelter(response.data);
      } catch (error) { }
    }
    const fetchEstados = async () => {
      const response = (await axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados', { signal: abortController.signal })).data;
      isMounted && setUfs(response.map(uf => uf.sigla));
    }
    fetchProfile();
    fetchEstados();
    return () => {
      isMounted = false;
      abortController.abort();
    }
  }, []);

  /* Consultar Razão Social e Nome Fantasia */
  useEffect(() => {
    var isMounted = true;
    const abort = new AbortController();
    const fetchRazaoSocial = async () => {
      const response = (await axios.get<CNPJQueryResponse>(`https://brasilapi.com.br/api/cnpj/v1/${cleanFormat(cnpj)}`, { signal: abort.signal })).data;
      isMounted && setShelter(prev => ({ ...prev, name: response?.razao_social, fantasyName: response?.nome_fantasia }));
    }
    cleanFormat(cnpj).length == 14 && fetchRazaoSocial();
    return () => {
      isMounted = false;
      abort.abort();
    }
  }, [cnpj]);
  /* Consultar Endereço */
  useEffect(() => {
    var isMounted = true;
    const abort = new AbortController();
    const fetchAddress = async () => {
      const response = (await axios.get<CEPQueryResponse>(`https://brasilapi.com.br/api/cep/v2/${cep}`, { signal: abort.signal })).data;
      isMounted && setShelter(prev => ({
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
    if (!shelter.uf || cities[shelter.uf]) {
      return;
    }
    var isMounted = true;
    const abort = new AbortController();
    const fetchCities = async () => {
      const response = (await axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${shelter.uf}/municipios`, { signal: abort.signal })).data;
      isMounted && setCities(prev => ({ ...prev, [shelter.uf]: response.map(city => city.nome) }));
    }
    fetchCities();
    return () => {
      isMounted = false;
      abort.abort();
    }
  }, [shelter.uf]);

  const handleInputChange = (e: any) => {
    setShelter(prev => ({ ...prev, [e.target.name]: e.target.value }))
  };
  const handleCepChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCep(formatCep(e.target.value));
    setShelter(prev => ({ ...prev, cep: cleanFormat(e.target.value) }));
  };
  const handleCnpjChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCnpj(formatCnpj(e.target.value));
    setShelter(prev => ({ ...prev, gcg: cleanFormat(e.target.value) }));
  };
  const handleTelephoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTelephone(formatTelephone(e.target.value));
    setShelter(prev => ({ ...prev, telephone: cleanFormat(e.target.value) }));
  };

  const handleProfilePicture = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return
    }
    const selectedImage = event.target.files.item(0);
    selectedImage && setProfilePicture({ file: selectedImage, preview: URL.createObjectURL(selectedImage) });
  };
  const handleSelectImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    const selectedImages = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...selectedImages.map(file => ({ file, preview: URL.createObjectURL(file) }))]);
  };

  const handleRemoveOldImage = (id: number) => {
    if (removeImages.includes(id)) {
      setRemoveImages(prev => prev.filter(_id => _id != id))
    }
    else {
      setRemoveImages(prev => [...prev, id]);
    };
  };
  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.map((image, _index) => ({ ...image, remove: _index == index ? !image.remove : image.remove })));
  };
  async function validate() {
    let schema = yup.object().shape({
      street: yup.string().required('Erro: Necessário preencher o nome da rua'),
      cep: yup.string().required('Erro: Necessário preencher o CEP'),
      telephone: yup.string().required('Erro: Necessário preencher o telefone'),
      fantasyName: yup.string().required('Erro: Necessário preencher o nome fantasia'),
      gcg: yup.string().required('Erro: Necessário preencher o CNPJ'),
      name: yup.string().required('Erro: Necessário preencher o campo nome'),
    });

    try {
      await schema.validate(shelter)
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
    if (!shelter || !(await validate())) {
      return;
    }

    const data = new FormData();
    data.append('cep', shelter.cep);
    data.append('uf', shelter.uf);
    data.append('city', shelter.city);
    data.append('street', shelter.street);
    data.append('streetNumber', shelter.streetNumber);
    data.append('district', shelter.district);
    data.append('complement', shelter.complement);
    data.append('telephone', shelter.telephone);

    data.append('CorporateName', shelter.name);
    data.append('FantasyName', shelter.fantasyName);
    shelter.about && data.append('About', shelter.about);
    shelter.keyPIX && data.append('KeyPIX', shelter.keyPIX);
    profilePicture && data.append('profilePicture', profilePicture.file);

    newImages.forEach(file => !file.remove && data.append('newImages', file.file));
    removeImages.forEach(id => data.append('removeImagesId', id.toString()));

    try {
      await api.patch('shelter', data, { headers: { 'Content-Type': 'application/x-www-url-formencoded' } });
      alert('Cadastro atualizado com sucesso');
      navigate(`/profile/shelter/${auth?.id}`);
      setAuth(prev => prev && { ...prev, profilePicture: profilePicture?.preview || pfp });
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb type="Abrigo" to={shelter.fantasyName} />
          <Avatar src={profilePicture?.preview || pfp} />
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
            <Link to={`/profile/shelter/${auth?.id}`}>
              <IconBack />
            </Link>
            <h1>Editar perfil</h1>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <Input
                label="Razão Social"
                type="text"
                name="name"
                onChange={handleInputChange}
                value={shelter.name}
              />

              <Input
                label="CNPJ"
                type="text"
                name="gcg"
                width="100%"
                onChange={handleCnpjChange}
                value={cnpj || formatCnpj(shelter.gcg || '')}
                disabled={true}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Nome fantasia"
                type="text"
                name="fantasyName"
                onChange={handleInputChange}
                value={shelter.fantasyName}
              />

              <Input
                label="Telefone"
                type="text"
                name="telephone"
                onChange={handleTelephoneChange}
                value={telephone || formatTelephone(shelter.telephone || '')}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="CEP"
                type="text"
                name="cep"
                width="28%"
                onChange={handleCepChange}
                value={cep || formatCep(shelter.cep || '')}
              />

              <Select
                label="UF"
                name="UF"
                value={shelter.uf}
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
                value={shelter.city}
                onChange={handleInputChange}
                options={
                  !cities[shelter.uf]
                    ? [{ value: '', label: 'Selecione um Estado' }]
                    : cities[shelter.uf].map(city => ({
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
                onChange={handleInputChange}
                value={shelter.street}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Número"
                type="text"
                name="streetNumber"
                width="30%"
                onChange={handleInputChange}
                value={shelter.streetNumber}
              />

              <Input
                label="Bairro"
                type="text"
                name="district"
                onChange={handleInputChange}
                value={shelter.district}
              />

              <Input
                label="Complemento"
                type="text"
                name="complement"
                onChange={handleInputChange}
                value={shelter.complement}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="Chave PIX"
                type="text"
                name="keyPIX"
                onChange={handleInputChange}
                value={shelter.keyPIX}
              />
            </div>

            <div className={styles.divider}></div>

            <TextArea
              label="Sobre"
              name="about"
              value={shelter.about || ''}
              onChange={handleInputChange}
            />

            <div className="input-block">
              <label className={styles.label} htmlFor="images">
                Fotos do abrigo
              </label>

              <div className={styles.imageContainer}>

                {shelter?.images?.map(image => (
                  <div
                    className={removeImages.includes(image.id) ? styles.remove : undefined}
                    key={image.id}
                    onClick={() => handleRemoveOldImage(image.id)}
                  >
                    <img src={`data:${image.mimeType};base64,${image.base64}`}></img>
                  </div>
                ))}
                {newImages.map((image, index) => (
                  <div
                    className={image.remove ? styles.remove : undefined}
                    key={index} onClick={() => handleRemoveNewImage(index)}
                  >
                    <img src={image.preview}></img>
                  </div>
                ))}
                <label htmlFor="newImages" className={styles.newImage}>+</label>
              </div>
              <input
                multiple
                onChange={handleSelectImages}
                type="file"
                name="image"
                accept=".jpeg, .png, .jpg"
                id="newImages"
              />
            </div>

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

            <Button type="submit">Atualizar</Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
