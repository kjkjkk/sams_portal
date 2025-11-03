import { config, database } from "@/services/appwrite";
import { Query } from "appwrite";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      console.log("[AuthContext] Attempting login for:", email);

      // Query YOUR database directly (no Appwrite Auth!)
      const response = await database.listDocuments(
        config.databaseId,
        config.collections.users2,
        [Query.equal("email", email.trim().toLowerCase())]
      );

      console.log(
        "[AuthContext] Query result:",
        response.documents.length,
        "users found"
      );

      if (response.documents.length === 0) {
        throw new Error("User not found. Please check your email.");
      }

      const userDoc = response.documents[0];
      console.log("[AuthContext] Found user:", userDoc.email);

      // Check password (plaintext comparison - matches your database)
      if (userDoc.password !== password) {
        throw new Error("Invalid password. Please try again.");
      }

      // Check if std_id exists
      if (!userDoc.std_id) {
        throw new Error("User profile incomplete - missing student ID");
      }

      console.log("[AuthContext] Password correct! std_id:", userDoc.std_id);

      // Build full name
      const fullName =
        userDoc.usrFirstName && userDoc.usrLastName
          ? `${userDoc.usrFirstName} ${userDoc.usrLastName}`.trim()
          : userDoc.email;

      // Create user data object
      const userData = {
        id: userDoc.$id,
        email: userDoc.email,
        name: fullName,
        stdId: userDoc.std_id,
        usrFirstName: userDoc.usrFirstName || "",
        usrLastName: userDoc.usrLastName || "",
        accID: userDoc.accID || 0,
        fullName: fullName,
      };

      console.log("[AuthContext] Login successful! User data:", userData);

      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      console.error("[AuthContext] Login error:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setUser(null);
      setError(null);
      console.log("[AuthContext] Logout successful");
    } catch (err) {
      setError(err.message || "Logout failed");
      console.error("[AuthContext] Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user && !!user.stdId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
