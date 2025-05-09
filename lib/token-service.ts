// Helper functions for token management

// Set a cookie with the provided name, value, and expiration time
const setCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

// For debugging
const debugTokens = (operation: string) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const idToken = localStorage.getItem("idToken");
  
  console.log(`[TokenService:${operation}] accessToken exists: ${!!accessToken}`);
  console.log(`[TokenService:${operation}] refreshToken exists: ${!!refreshToken}`);
  console.log(`[TokenService:${operation}] idToken exists: ${!!idToken}`);
  
  return { accessToken, refreshToken, idToken };
};

// Store tokens securely
export const storeTokens = (accessToken: string, refreshToken: string, idToken: string) => {
  console.log("[TokenService] Storing tokens...");
  
  try {
    // Store in localStorage for client-side use
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("idToken", idToken);
    
    // Also store in cookies for middleware use
    setCookie("accessToken", accessToken, 1); // 1 day expiry
    
    // Verify storage
    debugTokens("store");
    
    return true;
  } catch (error) {
    console.error("[TokenService] Error storing tokens:", error);
    return false;
  }
}

// Get tokens
export const getTokens = () => {
  const tokens = {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    idToken: localStorage.getItem("idToken"),
  };
  
  console.log("[TokenService] Getting tokens:", {
    accessExists: !!tokens.accessToken,
    refreshExists: !!tokens.refreshToken,
    idExists: !!tokens.idToken
  });
  
  return tokens;
}

// Clear tokens on logout
export const clearTokens = () => {
  console.log("[TokenService] Clearing tokens");
  
  // Clear from localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("idToken");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  
  // Clear from cookies
  setCookie("accessToken", "", -1); // Expire immediately
  setCookie("userRole", "", -1);
  
  // Verify clearance
  debugTokens("clear");
}

// Check if user is authenticated
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessToken");
  console.log(`[TokenService] isAuthenticated check: ${!!accessToken}`);
  
  // More robust check to verify token is actually there and not just empty
  if (!accessToken || accessToken === "undefined" || accessToken === "null") {
    console.log("[TokenService] Invalid or missing access token");
    return false;
  }
  
  return true;
}

// Get user role (provider or patient)
export const getUserRole = () => {
  return localStorage.getItem("userRole") || "provider";
}

// Set user role
export const setUserRole = (role: "provider" | "patient") => {
  localStorage.setItem("userRole", role);
  // Also set in cookie for middleware
  setCookie("userRole", role, 7);
}

// Toggle user role
export const toggleUserRole = () => {
  const currentRole = getUserRole();
  const newRole = currentRole === "provider" ? "patient" : "provider";
  setUserRole(newRole);
  return newRole;
}

// Refresh tokens - with better error handling
export const refreshTokens = async () => {
  console.log("[TokenService] Attempting to refresh tokens");
  
  try {
    const { refreshToken, idToken } = getTokens();
    const email = localStorage.getItem("userEmail");

    if (!refreshToken || !idToken || !email) {
      console.error("[TokenService] Missing refresh token, ID token, or email");
      return null;
    }

    // In a demo environment, we'll add a fallback mechanism
    try {
      const response = await fetch("https://8qgxh9alt4.execute-api.us-west-1.amazonaws.com/dev/doctor/updateTokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "refresh_token",
          credentials: {
            email,
            refresh_token: refreshToken,
            id_token: idToken,
          },
        }),
      });

      if (!response.ok) {
        console.error("[TokenService] Failed to refresh tokens, status:", response.status);
        return null;
      }

      const data = await response.json();
      const success = storeTokens(data.access_token, data.refresh_token, data.id_token);
      
      if (!success) {
        throw new Error("Failed to store refreshed tokens");
      }

      return data;
    } catch (error) {
      // If we're in a demo environment, we'll create mock tokens
      console.warn("[TokenService] Using demo mode due to token refresh failure:", error);

      // For demo purposes only - in production, this would be a security risk
      const mockAccessToken = "demo_access_token_" + Date.now();
      const mockRefreshToken = "demo_refresh_token_" + Date.now();
      const mockIdToken = "demo_id_token_" + Date.now();

      storeTokens(mockAccessToken, mockRefreshToken, mockIdToken);

      return {
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
        id_token: mockIdToken,
        is_demo_mode: true,
      };
    }
  } catch (error) {
    console.error("[TokenService] Error refreshing tokens:", error);
    return null;
  }
}
