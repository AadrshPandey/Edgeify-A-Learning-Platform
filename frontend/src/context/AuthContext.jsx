import { useContext, createContext, useState, useEffect } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/user/current-user`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          setUser(data.data);
        } else {
          console.log("Data Not Fetched");
        }
      } catch (error) {
        console.log(error);
      } finally{
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
