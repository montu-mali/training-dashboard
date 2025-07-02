import type { User } from "./types"

// Simple token generation without external JWT library
const JWT_SECRET = "your-secret-key-training-hub-2024"

export const generateToken = (user: User): string => {
  try {
    // Create a simple token with base64 encoding
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }

    const tokenData = btoa(JSON.stringify(payload))
    return `${tokenData}.${btoa(JWT_SECRET)}`
  } catch (error) {
    console.error("Token generation error:", error)
    throw new Error("Failed to generate token")
  }
}

export const verifyToken = (token: string): any => {
  try {
    const [tokenData, signature] = token.split(".")

    if (!tokenData || !signature) {
      return null
    }

    // Verify signature
    if (signature !== btoa(JWT_SECRET)) {
      return null
    }

    const payload = JSON.parse(atob(tokenData))

    // Check expiration
    if (Date.now() > payload.exp) {
      return null
    }

    return payload
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export const getTokenFromRequest = (request: Request): string | null => {
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  return null
}
