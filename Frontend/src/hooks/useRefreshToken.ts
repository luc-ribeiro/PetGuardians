import { api } from "../services/api";
import { AuthType } from "../types/Auth";
import useAuth from "./useAuth";

export default function useRefreshToken() {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await api.post('auth/refresh').catch(console.log);
        const auth: AuthType = response?.data;
        setAuth(auth);
        return auth.accessToken;
    }

    return refresh;
}