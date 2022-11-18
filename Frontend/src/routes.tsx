import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { About } from './pages/About'
import { HowTo } from './pages/HowTo'
import { Shelter } from './pages/Shelter'
import { Login } from './pages/Login'
import { PreSignIn } from './pages/SignIn/PreSignIn'
import { DonorSignIn } from './pages/SignIn/Donor'
import { ShelterSignIn } from './pages/SignIn/Shelter'

import { DonorProfile } from './pages/Profile/Donor'
import { ShelterProfile } from './pages/Profile/Shelter'

import { EditShelterProfile } from './pages/Profile/Edit/EditShelter'
import { EditDonorProfile } from './pages/Profile/Edit/EditDonor'

import { NotFound } from './pages/NotFound'
import { RequireAuth } from './pages/RequireAuth'

export default function RoutesList() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="quem-somos" element={<About />} />
        <Route path="como-ajudar" element={<HowTo />} />
        <Route
          path="abrigos"
          element={
            <RequireAuth>
              <Shelter />
            </RequireAuth>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="cadastrar" element={<PreSignIn />} />
        <Route path="cadastrar/doador" element={<DonorSignIn />} />
        <Route path="cadastrar/abrigo" element={<ShelterSignIn />} />
        <Route
          path="perfil/doador"
          element={
            <RequireAuth>
              <DonorProfile />
            </RequireAuth>
          }
        />
        <Route
          path="perfil/doador/editar"
          element={
            <RequireAuth>
              <EditDonorProfile />
            </RequireAuth>
          }
        />
        <Route
          path="perfil/abrigo"
          element={
            <RequireAuth>
              <ShelterProfile />
            </RequireAuth>
          }
        />
        <Route
          path="perfil/abrigo/editar"
          element={
            <RequireAuth>
              <EditShelterProfile />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}