// Helper functions for token management

// Store tokens securely
export const storeTokens = (accessToken: string, refreshToken: string, idToken: string) => {
  localStorage.setItem("accessToken", accessToken)
  localStorage.setItem("refreshToken", refreshToken)
  localStorage.setItem("idToken", idToken)
}

// Get tokens
export const getTokens = () => {
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    idToken: localStorage.getItem("idToken"),
  }
}

// Clear tokens on logout
export const clearTokens = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("idToken")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userRole")
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken")
}

// Get user role (provider or patient)
export const getUserRole = () => {
  return localStorage.getItem("userRole") || "provider"
}

// Set user role
export const setUserRole = (role: "provider" | "patient") => {
  localStorage.setItem("userRole", role)
}

// Toggle user role
export const toggleUserRole = () => {
  const currentRole = getUserRole()
  const newRole = currentRole === "provider" ? "patient" : "provider"
  setUserRole(newRole)
  return newRole
}

// Refresh tokens - with better error handling
export const refreshTokens = async () => {
  try {
    const { refreshToken, idToken } = getTokens()
    const email = localStorage.getItem("userEmail")

    if (!refreshToken || !idToken || !email) {
      console.error("Missing refresh token, ID token, or email")
      return null
    }

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
    })

    if (!response.ok) {
      console.error("Failed to refresh tokens, status:", response.status)
      return null
    }

    const data = await response.json()
    storeTokens(data.access_token, data.refresh_token, data.id_token)

    return data
  } catch (error) {
    console.error("Error refreshing tokens:", error)
    return null
  }
}
