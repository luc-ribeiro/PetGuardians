import { Routes, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { About } from './pages/Site/About'
import { HowTo } from './pages/Site/HowTo'
import { ShelterList } from './pages/Private/List/Shelter/ShelterList'
import { PartnerList } from './pages/Private/List/Partner/PartnerList'
import { Login } from './pages/Login'

import { PreSignUp } from './pages/SignUp/PreSignUp'
import { DonorSignUp } from './pages/SignUp/Donor/Donor'
import { ShelterSignUp } from './pages/SignUp/Shelter/Shelter'
import { PartnerSignUp } from './pages/SignUp/Partner/Partner'

import { ViewShelterProfile } from './pages/Private/List/Shelter/ViewShelterProfile'
import { ViewPartnerProfile } from './pages/Private/List/Partner/ViewPartnerProfile'

import { DonorProfile } from './pages/Private/Profile/Donor/Donor'
import { ShelterProfile } from './pages/Private/Profile/Shelter/Shelter'
import { PartnerProfile } from './pages/Private/Profile/Partner/Partner'

import { EditShelterProfile } from './pages/Private/Profile/Shelter/Edit/EditShelter'
import { EditDonorProfile } from './pages/Private/Profile/Donor/Edit/EditDonor'
import { EditPartnerProfile } from './pages/Private/Profile/Partner/Edit/EditPartner'

import { NotFound } from './pages/NotFound'
import RequireAuth from './layouts/RequireAuth'
import PersistLogin from './contexts/PersistLogin'

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
          <Route path="partners" element={<PartnerList />} />
          <Route path="shelters" element={<ShelterList />} />
          <Route path="partner/:id" element={<ViewPartnerProfile />} />
          <Route path="shelter/:id" element={<ViewShelterProfile />} />
        </Route>

        {/* Rotas exclusivas de Donors */}
        <Route element={<RequireAuth allowedRoles={['Donor']} />}>
          <Route path="profile/donor/:id/edit" element={<EditDonorProfile />} />
          <Route path="profile/donor/:id" element={<DonorProfile />} />
        </Route>

        {/* Rotas exclusivas de Shelters */}
        <Route element={<RequireAuth allowedRoles={['Shelter']} />}>
          <Route
            path="profile/shelter/:id/edit"
            element={<EditShelterProfile />}
          />
          <Route path="profile/shelter/:id" element={<ShelterProfile />} />
        </Route>

        {/* Rotas exclusivas de Partner */}
        <Route element={<RequireAuth allowedRoles={['Partner']} />}>
          <Route
            path="profile/partner/:id/edit"
            element={<EditPartnerProfile />}
          />
          <Route path="profile/partner/:id" element={<PartnerProfile />} />
        </Route>
      </Route>
    </Routes>
  )
}
