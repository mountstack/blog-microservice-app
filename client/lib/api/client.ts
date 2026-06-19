import { useAuthStore } from "@/lib/stores/authstore"; 

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000"


const refreshAccessToken = async (): Promise<string> => { 
  try { 
    const response = await fetch(`${API_URL}/user/refresh-token`, { 
      method: "POST", 
      credentials: "include", 
    }) 

    if (!response.ok) { 
      throw new Error("Refresh token failed"); 
    } 

    const data = await response.json(); 
    return data.accessToken; 
  } 
  catch (error) { 
    const { logout } = useAuthStore.getState(); 
    logout(); 
    throw error; 
  } 
} 

export async function apiFetch<T = any>( 
  endpoint: string, 
  options: RequestInit = {} 
): Promise<T> { 
  const { accessToken } = useAuthStore.getState(); 

  const headers: Record<string, string> = { 
    "Content-Type": "application/json", 
    ...options.headers as Record<string, string>, 
  } 

  if (accessToken) { 
    headers["Authorization"] = accessToken; 
  } 

  let response = await fetch(`${API_URL}${endpoint}`, { 
    ...options, 
    headers, 
    credentials: "include" 
  }) 

  // If access token expired
  if (response.status === 401) { 
    try { 
      const newToken = await refreshAccessToken(); 
      useAuthStore.getState().setAccessToken(newToken); 

      const retryHeaders: HeadersInit = { 
        ...headers, 
        "Authorization": newToken, 
      } 

      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`); 
      }

      return response.json(); 
    } 
    catch (error) { 
      useAuthStore.getState().logout(); 
      throw error; 
    } 
  } 

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  if (response.status === 204) { 
    return null as T; 
  } 

  return response.json(); 
} 