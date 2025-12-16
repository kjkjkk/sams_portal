import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.1.109:8000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  async getToken() {
    if (!this.token) {
      this.token = await AsyncStorage.getItem("auth_token");
    }
    return this.token;
  }

  async setToken(token) {
    this.token = token;
    await AsyncStorage.setItem("auth_token", token);
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem("auth_token");
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getToken();

    console.log("[API] Request URL:", url);
    console.log("[API] Request method:", options.method || "GET");

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      console.log("[API] Sending request...");
      const response = await fetch(url, config);

      console.log("[API] Response status:", response.status);

      if (response.status === 401) {
        console.log("[API] Unauthorized - clearing token");
        await this.clearToken();
        throw new Error("Invalid or expired token");
      }

      const data = await response.json();
      console.log("[API] Response data:", data);

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed with status ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("[API] Request error:", error.message);

      if (error.message === "Network request failed") {
        throw new Error(
          "Cannot connect to server. Please check your internet connection and API URL."
        );
      }

      throw error;
    }
  }

  /**
   * Login user
   */
  async login(username, password) {
    const data = await this.request("/login", {
      method: "POST",
      body: JSON.stringify({
        usrUserName: username,
        usrPassword: password,
      }),
    });

    if (data.success && data.data && data.data.token) {
      await this.setToken(data.data.token);
    }

    return data;
  }

  /**
   * Get authenticated user data
   */
  async getUser() {
    return await this.request("/user", {
      method: "GET",
    });
  }

  /**
   * Get school information by accID
   */
  async getSchool(accID) {
    return await this.request(`/schools/${accID}`, {
      method: "GET",
    });
  }

  /**
   * Get all schools
   */
  async getSchools() {
    return await this.request("/schools", {
      method: "GET",
    });
  }

  /**
   * Logout user and clear token
   */
  async logout() {
    try {
      await this.request("/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("[API] Logout error:", error);
    } finally {
      await this.clearToken();
    }
  }

  /**
   * Get bulletins for a specific school
   */
  async getBulletins(accID = null) {
    const endpoint = accID ? `/bulletins?accID=${accID}` : "/bulletins";
    return await this.request(endpoint, {
      method: "GET",
    });
  }

  /**
   * Get news for a specific school
   */
  async getNews(accID = null) {
    const endpoint = accID ? `/news?accID=${accID}` : "/news";
    return await this.request(endpoint, {
      method: "GET",
    });
  }

  /**
   * Get DTR records for specific user
   * @param {number} empId - Employee ID (users.usrID)
   */
  async getDTRRecords(empId) {
    return await this.request(`/dtr/${empId}`, {
      method: "GET",
    });
  }

  /**
   * Get all DTR records (for admins)
   * Returns only DTR records, not user list
   */
  async getAllDTRRecords() {
    return await this.request("/dtr", {
      method: "GET",
    });
  }

  /**
   * ✅ NEW: Get ALL users with their DTR summary
   * This returns ALL active users, even those without DTR records
   * Each user has: usr_id, emp_name, school_name, acc_id, user_type,
   *                user_type_name, total_records, latest_date
   */
  async getAllUsersWithDTR() {
    try {
      console.log("[API] Attempting /users/dtr-summary endpoint...");
      return await this.request("/users/dtr-summary", { method: "GET" });
    } catch (error) {
      console.error(
        "[API] /users/dtr-summary failed, falling back to old method"
      );

      // ✅ FALLBACK: Use old endpoint
      const dtrResponse = await this.getAllDTRRecords();
      if (!dtrResponse.success) throw new Error("DTR fetch failed");

      // Convert DTR records to user summary
      const userMap = new Map();
      dtrResponse.data.forEach((record) => {
        const userId = record.emp_id || record.usr_id;
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            usr_id: userId,
            emp_name: record.emp_name || "Unknown",
            school_name: record.school_name || "Unknown School",
            acc_id: record.acc_id,
            user_type: record.user_type,
            user_type_name: record.user_type_name || "Unknown",
            total_records: 1,
            latest_date: record.tme_date,
          });
        } else {
          const existing = userMap.get(userId);
          existing.total_records += 1;
          if (new Date(record.tme_date) > new Date(existing.latest_date)) {
            existing.latest_date = record.tme_date;
          }
        }
      });

      return {
        success: true,
        data: Array.from(userMap.values()),
        message: "Users retrieved from DTR records (fallback)",
      };
    }
  }
}

export default new ApiService();
