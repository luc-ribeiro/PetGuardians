import { Routes, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { About } from './pages/Site/About'
import { HowTo } from './pages/Site/HowTo'
import { Shelter } from './pages/Private/List/Shelter/Shelter'
import { Partner } from './pages/Private/List/Partner/Partner'
import { Login } from './pages/Login'

import { PreSignUp } from './pages/SignUp/PreSignUp'
import { DonorSignUp } from './pages/SignUp/Donor/Donor'
import { ShelterSignUp } from './pages/SignUp/Shelter/Shelter'
import { PartnerSignUp } from './pages/SignUp/Partner/Partner'

import { DonorProfile } from './pages/Private/Profile/--Donor/Donor'
import { ShelterProfile } from './pages/Private/Profile/Shelter/Shelter'
import { PartnerProfile } from './pages/Private/Profile/--Partner/Partner'

import { EditShelterProfile } from './pages/Private/Profile/Shelter/Edit/EditShelter'
import { EditDonorProfile } from './pages/Private/Profile/--Donor/Edit/EditDonor'
import { EditPartnerProfile } from './pages/Private/Profile/--Partner/Edit/EditPartner'
import { EditProfile } from './pages/Private/Profile/Profile/Edit/EditProfile'
import { Profile } from './pages/Private/Profile/Profile/Profile'

import { NotFound } from './pages/NotFound'
import RequireAuth from './layouts/RequireAuth'
import PersistLogin from './components/PersistLogin'

export default function RoutesList() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="not-found" element={<NotFound />} />
      <Route path="quem-somos" element={<About />} />
      <Route path="como-ajudar" element={<HowTo />} />
      <Route path="login" element={<Login />} />
      <Route path="cadastrar" element={<PreSignUp />} />
      <Route path="cadastrar/doador" element={<DonorSignUp />} />
      <Route path="cadastrar/abrigo" element={<ShelterSignUp />} />
      <Route path="cadastrar/parceiro" element={<PartnerSignUp />} />

      <Route element={<PersistLogin />}>
        <Route path="/" element={<Home />} />

        {/* Rotas privadas globais */}
        <Route element={<RequireAuth />}>
          <Route path="parceiros" element={<Partner />} />
          <Route path="abrigos" element={<Shelter />} />
          <Route path="perfil/doador" element={<DonorProfile />} />
          <Route path="perfil/parceiro" element={<PartnerProfile />} />
          <Route path="perfil/abrigo/:id" element={<ShelterProfile />} />
          <Route path="meuperfil" element={<Profile />} />
          <Route path="meuperfil/editar" element={<EditProfile />} />
        </Route>

        {/* Rotas exclusivas de Donors */}
        <Route element={<RequireAuth allowedRoles={['Donor']} />}>
          <Route
            path="perfil/doador/:id/editar"
            element={<EditDonorProfile />}
          />
        </Route>

        {/* Rotas exclusivas de Shelters */}
        <Route element={<RequireAuth allowedRoles={['Shelter']} />}>
          <Route
            path="perfil/abrigo/:id/editar"
            element={<EditShelterProfile />}
          />
        </Route>

        {/* Rotas exclusivas de Partner */}
        <Route element={<RequireAuth allowedRoles={['Partner']} />}>
          <Route
            path="perfil/parceiro/:id/editar"
            element={<EditPartnerProfile />}
          />
        </Route>
      </Route>
    </Routes>
  )
}
