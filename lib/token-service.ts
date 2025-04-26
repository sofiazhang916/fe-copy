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
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken")
}

// Refresh tokens
export const refreshTokens = async () => {
  const { refreshToken, idToken } = getTokens()
  const email = localStorage.getItem("userEmail")

  if (!refreshToken || !idToken || !email) {
    throw new Error("No refresh token available")
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
    throw new Error("Failed to refresh tokens")
  }

  const data = await response.json()
  storeTokens(data.access_token, data.refresh_token, data.id_token)

  return data
}
