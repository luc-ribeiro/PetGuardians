import { createContext, PropsWithChildren, useState } from "react";
import { AuthType } from "../types/Auth";

const AuthContext = createContext<AuthContext>({} as AuthContext);

interface AuthContext {
    auth: AuthType | null,
    setAuth: React.Dispatch<React.SetStateAction<AuthType | null>>
}
export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [auth, setAuth] = useState<AuthType | null>(null);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;