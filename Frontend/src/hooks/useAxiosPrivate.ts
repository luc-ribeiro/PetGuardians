import { apiPrivate } from "../services/api";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

export default function usePrivateApi() {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {

        const requestIntercept = apiPrivate.interceptors.request.use(config => {
            const headers = { 'Authorization': `Bearer ${auth?.accessToken}` };
            if (!config.headers) {
                config.headers = headers;
            }
            else if (!config.headers['Authorization']) {
                config.headers['Authorization'] = headers['Authorization'];
            }
            return config;
        }, error => Promise.reject(error));

        const responseIntercept = apiPrivate.interceptors.response.use(response => response, async (error) => {
            const prevRequest = error?.config;
            if (error?.response?.status === 403 && !prevRequest?.sent) {
                prevRequest.sent = true;
                const newAcessToken = await refresh();
                prevRequest.headers['Authorization'] = `Bearer ${newAcessToken}`;
                return apiPrivate(prevRequest);
            }
            return Promise.reject(error);
        })
        return () => {
            apiPrivate.interceptors.response.eject(responseIntercept);
            apiPrivate.interceptors.request.eject(requestIntercept);
        }
    }, [auth, refresh]);

    return apiPrivate;
}