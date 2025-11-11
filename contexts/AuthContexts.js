import ApiService from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/screens/home");
    }
  }, [isAuthenticated, segments, loading]);

  const clearAuthData = async () => {
    try {
      await ApiService.clearToken();
      await AsyncStorage.removeItem("user_data");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("[Auth] Error clearing auth data:", error);
    }
  };

  const checkAuth = async () => {
    try {
      console.log("[Auth] Checking authentication status...");
      const token = await AsyncStorage.getItem("auth_token");
      const storedUser = await AsyncStorage.getItem("user_data");

      if (!token) {
        console.log("[Auth] No token found");
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);

          // Validate user data structure
          if (userData && userData.usrID && userData.accID) {
            // Set user immediately from storage for faster UI
            setUser(userData);
            setIsAuthenticated(true);
            console.log("[Auth] User loaded from storage:", {
              usrID: userData.usrID,
              name: `${userData.usrFirstName} ${userData.usrLastName}`,
              accID: userData.accID,
            });

            // Validate token with server in background
            try {
              const response = await ApiService.getUser();
              if (response.success && response.data) {
                const updatedUser = response.data;

                // Ensure all required fields exist
                const completeUser = {
                  usrID: updatedUser.usrID,
                  usrUuId: updatedUser.usrUuId,
                  accID: updatedUser.accID,
                  std_id: updatedUser.std_id,
                  usrFirstName: updatedUser.usrFirstName || "",
                  usrLastName: updatedUser.usrLastName || "",
                  usrMiddleName: updatedUser.usrMiddleName || "",
                  usrEmail: updatedUser.usrEmail || "",
                  usrMobile: updatedUser.usrMobile || "",
                  usrUserName: updatedUser.usrUserName || "",
                  usrType: updatedUser.usrType,
                  usrImage: updatedUser.usrImage || null,
                  usrActive: updatedUser.usrActive,
                  usrDateCreated: updatedUser.usrDateCreated,
                  // Additional fields
                  modEnrollment: updatedUser.modEnrollment || 0,
                  modBilling: updatedUser.modBilling || 0,
                  modAdmin: updatedUser.modAdmin || 0,
                  modOSA: updatedUser.modOSA || 0,
                  modGSTC: updatedUser.modGSTC || 0,
                  modSIMS: updatedUser.modSIMS || 0,
                  modStudentRecords: updatedUser.modStudentRecords || 0,
                  modStudentSMS: updatedUser.modStudentSMS || 0,
                  modCalendar: updatedUser.modCalendar || 0,
                };

                setUser(completeUser);
                await AsyncStorage.setItem(
                  "user_data",
                  JSON.stringify(completeUser)
                );
                console.log("[Auth] User data updated from server");
              }
            } catch (error) {
              // Token validation failed - token is invalid or expired
              console.error("[Auth] Token validation failed:", error.message);

              // Clear invalid auth data
              await clearAuthData();
              console.log("[Auth] Cleared invalid session");
            }
          } else {
            console.log("[Auth] Invalid user data structure");
            await clearAuthData();
          }
        } catch (parseError) {
          console.error("[Auth] Error parsing stored user data:", parseError);
          await clearAuthData();
        }
      } else {
        // Has token but no stored user - try to fetch user
        console.log("[Auth] Token found but no user data, fetching...");
        try {
          const response = await ApiService.getUser();
          if (response.success && response.data) {
            const userData = response.data;

            const completeUser = {
              usrID: userData.usrID,
              usrUuId: userData.usrUuId,
              accID: userData.accID,
              std_id: userData.std_id,
              usrFirstName: userData.usrFirstName || "",
              usrLastName: userData.usrLastName || "",
              usrMiddleName: userData.usrMiddleName || "",
              usrEmail: userData.usrEmail || "",
              usrMobile: userData.usrMobile || "",
              usrUserName: userData.usrUserName || "",
              usrType: userData.usrType,
              usrImage: userData.usrImage || null,
              usrActive: userData.usrActive,
              usrDateCreated: userData.usrDateCreated,
              modEnrollment: userData.modEnrollment || 0,
              modBilling: userData.modBilling || 0,
              modAdmin: userData.modAdmin || 0,
              modOSA: userData.modOSA || 0,
              modGSTC: userData.modGSTC || 0,
              modSIMS: userData.modSIMS || 0,
            };

            setUser(completeUser);
            setIsAuthenticated(true);
            await AsyncStorage.setItem(
              "user_data",
              JSON.stringify(completeUser)
            );
            console.log("[Auth] User fetched and stored");
          }
        } catch (error) {
          console.error("[Auth] Failed to fetch user:", error.message);
          await clearAuthData();
        }
      }
    } catch (error) {
      console.error("[Auth] Check auth error:", error);
      await clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      console.log("[Auth] Attempting login for:", username);

      const response = await ApiService.login(username, password);

      if (response.success && response.data) {
        // Backend now returns flat user object in response.data
        const userData = response.data;

        // Validate required fields from users table
        if (!userData.usrID || !userData.accID) {
          throw new Error("Invalid user data received from server");
        }

        // User data is already properly structured from backend
        const structuredUser = {
          usrID: userData.usrID,
          usrUuId: userData.usrUuId,
          accID: userData.accID,
          std_id: userData.std_id,
          usrFirstName: userData.usrFirstName || "",
          usrLastName: userData.usrLastName || "",
          usrMiddleName: userData.usrMiddleName || "",
          usrEmail: userData.usrEmail || "",
          usrMobile: userData.usrMobile || "",
          usrUserName: userData.usrUserName || username,
          usrType: userData.usrType,
          usrImage: userData.usrImage || null,
          usrActive: userData.usrActive,
          usrDateCreated: userData.usrDateCreated,
          // Permissions/Modules
          modEnrollment: userData.modEnrollment || 0,
          modBilling: userData.modBilling || 0,
          modAdmin: userData.modAdmin || 0,
          modOSA: userData.modOSA || 0,
          modGSTC: userData.modGSTC || 0,
          modSIMS: userData.modSIMS || 0,
          modStudentRecords: userData.modStudentRecords || 0,
          modStudentSMS: userData.modStudentSMS || 0,
          modCalendar: userData.modCalendar || 0,
        };

        setUser(structuredUser);
        setIsAuthenticated(true);

        await AsyncStorage.setItem("user_data", JSON.stringify(structuredUser));

        console.log("[Auth] Login successful:", {
          usrID: structuredUser.usrID,
          name: `${structuredUser.usrFirstName} ${structuredUser.usrLastName}`,
          accID: structuredUser.accID,
          usrType: structuredUser.usrType,
        });

        return structuredUser;
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("[Auth] Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("[Auth] Logging out...");
      await ApiService.logout();
    } catch (error) {
      console.error("[Auth] Logout API error:", error);
    } finally {
      // Always clear local data even if API call fails
      await clearAuthData();
      router.replace("/");
      console.log("[Auth] Logout complete");
    }
  };

  /**
   * Get user's full name
   */
  const getUserFullName = () => {
    if (!user) return "Guest User";

    const firstName = user.usrFirstName || "";
    const middleInitial = user.usrMiddleName
      ? `${user.usrMiddleName.charAt(0)}.`
      : "";
    const lastName = user.usrLastName || "";

    return `${firstName} ${middleInitial} ${lastName}`.trim() || "Guest User";
  };

  /**
   * Check if user has specific module access
   */
  const hasModuleAccess = (moduleName) => {
    if (!user) return false;

    const moduleMap = {
      enrollment: user.modEnrollment,
      billing: user.modBilling,
      admin: user.modAdmin,
      osa: user.modOSA,
      gstc: user.modGSTC,
      sims: user.modSIMS,
      records: user.modStudentRecords,
      sms: user.modStudentSMS,
      calendar: user.modCalendar,
    };

    return moduleMap[moduleName?.toLowerCase()] === 1;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth,
    getUserFullName,
    hasModuleAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
