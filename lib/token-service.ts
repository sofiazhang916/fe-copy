// Helper functions for token management

// Set a cookie with the provided name, value, and expiration time
const setCookie = (name: string, value: string, days: number = 7) => {
  try {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    console.log(`[TokenService] Cookie '${name}' set successfully`);
  } catch (error) {
    console.error(`[TokenService] Error setting cookie '${name}':`, error);
  }
};

// Get a cookie by name
const getCookie = (name: string) => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  } catch (error) {
    console.error(`[TokenService] Error getting cookie '${name}':`, error);
    return null;
  }
};

// For debugging
const debugTokens = (operation: string) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const idToken = localStorage.getItem("idToken");

  // Also log cookie status
  const cookieToken = getCookie("accessToken");

  console.log(`[TokenService:${operation}] accessToken exists in localStorage: ${!!accessToken}`);
  console.log(`[TokenService:${operation}] refreshToken exists: ${!!refreshToken}`);
  console.log(`[TokenService:${operation}] idToken exists: ${!!idToken}`);
  console.log(`[TokenService:${operation}] accessToken exists in cookie: ${!!cookieToken}`);

  return { accessToken, refreshToken, idToken, cookieToken };
};

// Store tokens securely
// IMPORTANT: This function receives snake_case tokens from the API (access_token)
// but stores them as camelCase (accessToken) for consistency with the middleware
export const storeTokens = (access_token: string, refresh_token: string, id_token: string, email?: string) => {
  console.log("[TokenService] Storing tokens...");
  console.log("[TokenService] Tokens received for storage:", {
    access_token_exists: !!access_token,
    refresh_token_exists: !!refresh_token,
    id_token_exists: !!id_token,
    email: email || 'not provided'
  });

  try {
    // Store in localStorage with camelCase keys (different from API response)
    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    localStorage.setItem("idToken", id_token);

    // Store email if provided
    if (email) {
      localStorage.setItem("userEmail", email);
      console.log(`[TokenService] Storing email: ${email}`);
    }

    // Also store in cookies for middleware - MUST use camelCase to match middleware expectation
    setCookie("accessToken", access_token, 1); // 1 day expiry

    // Verify storage
    debugTokens("store");

    return true;
  } catch (error) {
    console.error("[TokenService] Error storing tokens:", error);
    return false;
  }
}

// Get tokens with fallback to cookies
export const getTokens = () => {
  const tokens = {
    accessToken: localStorage.getItem("accessToken") || getCookie("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    idToken: localStorage.getItem("idToken") || null,
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

// Check if user is authenticated - checking both localStorage and cookies
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessToken");
  const cookieToken = getCookie("accessToken");
  console.log(`[TokenService] isAuthenticated check:`, {
    localStorage: !!accessToken,
    cookie: !!cookieToken
  });

  // Check both sources for maximum compatibility
  if ((!accessToken || accessToken === "undefined" || accessToken === "null") &&
    (!cookieToken || cookieToken === "undefined" || cookieToken === "null")) {
    console.log("[TokenService] Invalid or missing access token in both localStorage and cookie");
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

// Simple placeholder for refreshTokens that does nothing - keeping the function
// to avoid breaking existing code that calls it
export const refreshTokens = async () => {
  console.log("[TokenService] Token refresh requested but disabled");
  return null;
}
