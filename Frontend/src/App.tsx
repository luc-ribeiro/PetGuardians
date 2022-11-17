import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { About } from './pages/About'
import { HowTo } from './pages/HowTo'
import { Login } from './pages/Login'
import { PreSignIn } from './pages/SignIn/PreSignIn'
import { DonorSignIn } from './pages/SignIn/Donor'
import { ShelterSignIn } from './pages/SignIn/Shelter'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quem-somos" element={<About />} />
        <Route path="/como-ajudar" element={<HowTo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<PreSignIn />} />
        <Route path="/cadastrar/doador" element={<DonorSignIn />} />
        <Route path="/cadastrar/abrigo" element={<ShelterSignIn />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
