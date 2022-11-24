import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { About } from "./pages/Site/About";
import { HowTo } from "./pages/Site/HowTo";
import { Shelter } from "./pages/Private/List/Shelter/Shelter";
import { Partner } from "./pages/Private/List/Partner/Partner";
import { Login } from "./pages/Login";

import { PreSignUp } from "./pages/SignUp/PreSignUp";
import { DonorSignUp } from "./pages/SignUp/Donor/Donor";
import { ShelterSignUp } from "./pages/SignUp/Shelter/Shelter";
import { PartnerSignUp } from "./pages/SignUp/Partner/Partner";

import { DonorProfile } from "./pages/Private/Profile/Donor/Donor";
import { ShelterProfile } from "./pages/Private/Profile/Shelter/Shelter";
import { PartnerProfile } from "./pages/Private/Profile/Partner/Partner";

import { EditShelterProfile } from "./pages/Private/Profile/Shelter/Edit/EditShelter";
import { EditDonorProfile } from "./pages/Private/Profile/Donor/Edit/EditDonor";
import { EditPartnerProfile } from "./pages/Private/Profile/Partner/Edit/EditPartner";
import { EditProfile } from "./pages/Private/Profile/Profile/Edit/EditProfile";
import { Profile } from "./pages/Private/Profile/Profile/Profile";

import { NotFound } from "./pages/NotFound";
import { RequireAuth } from "./contexts/Auth/RequireAuth";

export default function RoutesList() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="quem-somos" element={<About />} />
			<Route path="como-ajudar" element={<HowTo />} />
			<Route
				path="parceiros"
				element={
					<RequireAuth>
						<Partner />
					</RequireAuth>
				}
			/>
			<Route
				path="abrigos"
				element={
					<RequireAuth>
						<Shelter />
					</RequireAuth>
				}
			/>
			<Route path="login" element={<Login />} />
			<Route path="cadastrar" element={<PreSignUp />} />
			<Route path="cadastrar/doador" element={<DonorSignUp />} />
			<Route path="cadastrar/abrigo" element={<ShelterSignUp />} />
			<Route path="cadastrar/parceiro" element={<PartnerSignUp />} />
			<Route
				path="perfil/doador"
				element={
					<RequireAuth>
						<DonorProfile />
					</RequireAuth>
				}
			/>
			<Route
				path="perfil/doador/:id/editar"
				element={
					<RequireAuth>
						<EditDonorProfile />
					</RequireAuth>
				}
			/>
			<Route
				path="perfil/abrigo/:id"
				element={
					<RequireAuth>
						<ShelterProfile />
					</RequireAuth>
				}
			/>
			<Route
				path="perfil/abrigo/:id/editar"
				element={
					<RequireAuth>
						<EditShelterProfile />
					</RequireAuth>
				}
			/>
			<Route
				path="perfil/parceiro"
				element={
					<RequireAuth>
						<PartnerProfile />
					</RequireAuth>
				}
			/>
			<Route
				path="perfil/parceiro/:id/editar"
				element={
					<RequireAuth>
						<EditPartnerProfile />
					</RequireAuth>
				}
			/>
			<Route
				path="meuperfil"
				element={
					<RequireAuth>
						<Profile />
					</RequireAuth>
				}
			/>
			<Route
				path="meuperfil/editar"
				element={
					<RequireAuth>
						<EditProfile />
					</RequireAuth>
				}
			/>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
