// Password strength checker
export const checkPasswordStrength = (
  password: string,
): {
  score: number
  feedback: string
  color: string
} => {
  let score = 0
  const feedback = []

  // Length check
  if (password.length < 8) {
    feedback.push("Password should be at least 8 characters")
  } else {
    score += 1
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push("Add uppercase letter")
  } else {
    score += 1
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push("Add lowercase letter")
  } else {
    score += 1
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    feedback.push("Add number")
  } else {
    score += 1
  }

  // Special character check
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push("Add special character")
  } else {
    score += 1
  }

  // Determine color based on score
  let color = ""
  if (score <= 2) {
    color = "#f87171" // red
  } else if (score <= 3) {
    color = "#fbbf24" // yellow
  } else {
    color = "#34d399" // green
  }

  return {
    score,
    feedback: feedback.join(", "),
    color,
  }
}

// Simple password hashing (for demo purposes)
// In a real app, you would use a proper hashing library and do this server-side
export const hashPassword = (password: string): string => {
  // This is a simple hash for demonstration
  // In production, use a proper hashing algorithm on the server
  return btoa(password) // Base64 encoding (NOT secure for production)
}
