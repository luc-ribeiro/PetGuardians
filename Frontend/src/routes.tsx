import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { HowTo } from "./pages/HowTo";
import { Shelter } from "./pages/Shelter";
import { Partner } from "./pages/Partner";
import { Login } from "./pages/Login";

import { PreSignIn } from "./pages/SignIn/PreSignIn";
import { DonorSignIn } from "./pages/SignIn/Donor";
import { ShelterSignIn } from "./pages/SignIn/Shelter";
import { PartnerSignIn } from "./pages/SignIn/Partner";

import { DonorProfile } from "./pages/Profile/Donor";
import { ShelterProfile } from "./pages/Profile/Shelter";
import { PartnerProfile } from "./pages/Profile/Partner";

import { EditShelterProfile } from "./pages/Profile/Edit/EditShelter";
import { EditDonorProfile } from "./pages/Profile/Edit/EditDonor";
import { EditPartnerProfile } from "./pages/Profile/Edit/EditPartner";

import { NotFound } from "./pages/NotFound";
import { RequireAuth } from "./pages/RequireAuth";

export default function RoutesList() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="quem-somos" element={<About />} />
				<Route path="como-ajudar" element={<HowTo />} />
				<Route path="parceiros" element={<Partner />} />
				<Route
					path="abrigos"
					element={
						<Shelter />
						// <RequireAuth>
						// </RequireAuth>
					}
				/>
				<Route path="login" element={<Login />} />
				<Route path="cadastrar" element={<PreSignIn />} />
				<Route path="cadastrar/doador" element={<DonorSignIn />} />
				<Route path="cadastrar/abrigo" element={<ShelterSignIn />} />
				<Route path="cadastrar/parceiro" element={<PartnerSignIn />} />
				<Route
					path="perfil/doador"
					element={
						<DonorProfile />
						// <RequireAuth>
						// </RequireAuth>
					}
				/>
				<Route
					path="perfil/doador/:id/editar"
					element={
						<EditDonorProfile />
						// <RequireAuth>
						// </RequireAuth>
					}
				/>
				<Route
					path="perfil/abrigo/:id"
					element={
						<ShelterProfile />
						// <RequireAuth>
						// </RequireAuth>
					}
				/>
				<Route
					path="perfil/abrigo/:id/editar"
					element={
						<EditShelterProfile />
						// <RequireAuth>
						// </RequireAuth>
					}
				/><Route
				path="perfil/parceiro"
				element={
					<PartnerProfile />
					// <RequireAuth>
					// </RequireAuth>
				}
			/>
				<Route
					path="perfil/parceiro/:id/editar"
					element={
						<EditPartnerProfile />
						// <RequireAuth>
						// </RequireAuth>
					}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
