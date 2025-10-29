// import { createContext, useContext, useEffect, useState } from "react";
// import authService from "../services/authService";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkUser();
//   }, []);

//   const checkUser = async () => {
//     setLoading(true);
//     const response = await authService.getUser();

//     if (response?.error) {
//       setUser(null);
//     } else {
//       setUser(response);
//     }

//     setLoading(false);
//   };

//   const login = async (email, password) => {
//     const response = await authService.login(email, password);

//     if (response?.error) {
//       return response;
//     }

//     await checkUser();
//     return { success: true };
//   };

//   const register = async (email, password) => {
//     const response = await authService.register(email, password);

//     if (response?.error) {
//       return response;
//     }

//     return login(email, password); // Auto-login after register
//   };

//   const logout = async () => {
//     await authService.logout();
//     setUser(null);
//     await checkUser();
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         register,
//         logout,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { getApiUrl } from "../services/mysql-config";

const authService = {
  async register(email, password) {
    try {
      const response = await fetch(getApiUrl("/api/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || "Registration failed" };
      }
      return data;
    } catch (error) {
      return { error: error.message || "Registration failed" };
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(getApiUrl("/api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || "Login failed" };
      }
      // Store user data locally
      await this._storeUser(data);
      return data;
    } catch (error) {
      return { error: error.message || "Login failed" };
    }
  },

  async getUser() {
    try {
      const user = await this._getStoredUser();
      return user || null;
    } catch (error) {
      return null;
    }
  },

  async logout() {
    try {
      await this._clearUser();
      return { success: true };
    } catch (error) {
      return { error: error.message || "Logout failed" };
    }
  },

  // Helper: Store user data locally
  async _storeUser(user) {
    // You can use AsyncStorage or similar for persistence
    // For now, this is a placeholder
  },

  // Helper: Get stored user data
  async _getStoredUser() {
    // Retrieve from AsyncStorage or similar
    // For now, this is a placeholder
    return null;
  },

  // Helper: Clear user data
  async _clearUser() {
    // Clear from AsyncStorage or similar
  },
};

export default authService;
