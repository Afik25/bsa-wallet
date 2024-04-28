import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [keys, setKeys] = useState({});

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        keys,
        setKeys,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
