// API client for authentication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface User {
  id: string
  email: string
  username: string
  emailVerified: boolean
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  username: string
  password: string
}

class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authToken')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = 'An error occurred'
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorMessage
    } catch {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText || errorMessage
    }
    throw new ApiError(response.status, errorMessage)
  }

  return response.json()
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  logout: async (): Promise<void> => {
    return fetchApi<void>('/api/auth/logout', {
      method: 'POST',
    })
  },

  getCurrentUser: async (): Promise<User> => {
    return fetchApi<User>('/api/auth/me')
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>('/api/auth/request-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    })
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  },

  resendVerification: async (): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>('/api/auth/resend-verification', {
      method: 'POST',
    })
  },
}

export { ApiError }
