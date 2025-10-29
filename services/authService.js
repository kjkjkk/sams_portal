import { getApiUrl } from "./mysql-config";

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
