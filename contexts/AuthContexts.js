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
      console.log("[Auth] ✅ Auth data cleared successfully");
    } catch (error) {
      console.error("[Auth] ❌ Error clearing auth data:", error);
    }
  };

  const checkAuth = async () => {
    try {
      console.log("[Auth] ===== Checking Authentication =====");
      const token = await AsyncStorage.getItem("auth_token");
      const storedUser = await AsyncStorage.getItem("user_data");

      console.log("[Auth] Token exists:", !!token);
      console.log("[Auth] Stored user exists:", !!storedUser);

      if (!token) {
        console.log("[Auth] ❌ No token found - User not authenticated");
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log("[Auth] Parsed user data:", {
            usrID: userData.usrID,
            accID: userData.accID,
            usrType: userData.usrType,
            name: `${userData.usrFirstName} ${userData.usrLastName}`,
          });

          // Validate user data structure
          if (userData && userData.usrID && userData.accID) {
            // Set user immediately from storage for faster UI
            setUser(userData);
            setIsAuthenticated(true);
            console.log("[Auth] ✅ User loaded from storage");

            // Validate token with server in background
            try {
              console.log("[Auth] Validating token with server...");
              const response = await ApiService.getUser();

              if (response.success && response.data) {
                const updatedUser = response.data;
                console.log("[Auth] ✅ Token validated, user data updated");

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
              }
            } catch (error) {
              // Token validation failed - token is invalid or expired
              console.error(
                "[Auth] ❌ Token validation failed:",
                error.message
              );
              console.error("[Auth] Full error:", error);

              // Clear invalid auth data
              await clearAuthData();
              console.log("[Auth] Cleared invalid session");
            }
          } else {
            console.log(
              "[Auth] ❌ Invalid user data structure - missing usrID or accID"
            );
            console.log("[Auth] User data:", userData);
            await clearAuthData();
          }
        } catch (parseError) {
          console.error(
            "[Auth] ❌ Error parsing stored user data:",
            parseError
          );
          await clearAuthData();
        }
      } else {
        // Has token but no stored user - try to fetch user
        console.log(
          "[Auth] Token found but no user data, fetching from server..."
        );
        try {
          const response = await ApiService.getUser();
          console.log("[Auth] API Response:", {
            success: response.success,
            hasData: !!response.data,
          });

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
            console.log("[Auth] ✅ User fetched and stored");
          } else {
            console.log("[Auth] ❌ Failed to fetch user - invalid response");
            await clearAuthData();
          }
        } catch (error) {
          console.error("[Auth] ❌ Failed to fetch user:", error.message);
          console.error("[Auth] Full error:", error);
          await clearAuthData();
        }
      }
    } catch (error) {
      console.error("[Auth] ❌ Check auth error:", error);
      await clearAuthData();
    } finally {
      setLoading(false);
      console.log("[Auth] ===== Authentication Check Complete =====");
    }
  };

  const login = async (username, password) => {
    try {
      console.log("[Auth] ===== Login Attempt =====");
      console.log("[Auth] Username:", username);

      // ✅ Input validation
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      const response = await ApiService.login(username, password);
      console.log("[Auth] API Login Response:", {
        success: response.success,
        hasData: !!response.data,
        message: response.message,
      });

      if (response.success && response.data) {
        // Backend now returns flat user object in response.data
        const userData = response.data;

        // ✅ Enhanced validation with detailed logging
        console.log("[Auth] User data received:", {
          usrID: userData.usrID,
          accID: userData.accID,
          usrType: userData.usrType,
          usrFirstName: userData.usrFirstName,
          usrLastName: userData.usrLastName,
        });

        if (!userData.usrID) {
          console.error("[Auth] ❌ Missing usrID in user data");
          throw new Error("Invalid user data: Missing user ID");
        }

        if (!userData.accID) {
          console.error("[Auth] ❌ Missing accID in user data");
          throw new Error("Invalid user data: Missing account ID");
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

        console.log("[Auth] Structured user:", {
          usrID: structuredUser.usrID,
          name: `${structuredUser.usrFirstName} ${structuredUser.usrLastName}`,
          accID: structuredUser.accID,
          usrType: structuredUser.usrType,
        });

        setUser(structuredUser);
        setIsAuthenticated(true);

        await AsyncStorage.setItem("user_data", JSON.stringify(structuredUser));

        console.log("[Auth] ✅ Login successful!");
        console.log("[Auth] ===== Login Complete =====");

        return structuredUser;
      } else {
        console.error("[Auth] ❌ Login failed:", response.message);
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("[Auth] ===== Login Error =====");
      console.error("[Auth] Error type:", error.constructor.name);
      console.error("[Auth] Error message:", error.message);
      console.error("[Auth] Full error:", error);

      // ✅ Provide more specific error messages
      if (error.message.includes("Network")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      } else if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        throw new Error("Invalid username or password.");
      } else if (
        error.message.includes("403") ||
        error.message.includes("Forbidden")
      ) {
        throw new Error(
          "Your account has been disabled. Please contact support."
        );
      } else if (error.message.includes("500")) {
        throw new Error("Server error. Please try again later.");
      }

      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("[Auth] ===== Logging Out =====");
      await ApiService.logout();
    } catch (error) {
      console.error("[Auth] Logout API error:", error);
    } finally {
      // Always clear local data even if API call fails
      await clearAuthData();
      router.replace("/");
      console.log("[Auth] ✅ Logout complete");
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
