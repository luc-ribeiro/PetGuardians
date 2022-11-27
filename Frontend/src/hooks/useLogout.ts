import { api } from "../services/api";
import useAuth from "./useAuth";

export default function useLogout() {
    const { setAuth } = useAuth();
    const logout = async () => {
        setAuth(null);
        await api.post('auth/logout').catch(console.log);
    }
    return logout;
}