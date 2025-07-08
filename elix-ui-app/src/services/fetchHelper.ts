import { AccessTokenKey } from "./constants"

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface FetchOptions<TBody = unknown> {
  method?: HttpMethod
  body?: TBody
  headers?: Record<string, string>
  // You can add more options if needed (e.g., credentials)
}

export class FetchError extends Error {
  public readonly status: number
  public readonly response: Response

  constructor(message: string, status: number, response: Response) {
    super(message)
    this.name = 'FetchError'
    this.status = status
    this.response = response
  }
}

export async function fetchApi<TResponse, TBody = unknown>(
  url: string,
  options: FetchOptions<TBody> = {}
): Promise<TResponse> {
  const { method = 'GET', body, headers = {} } = options;
  
  // Compose headers
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers
  }
  // Get token from localStorage
  const token = localStorage.getItem(AccessTokenKey);
  
  if (token) 
    finalHeaders['Authorization'] = `Bearer ${token}`;  

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new FetchError(
      `Request failed with status ${response.status}: ${errorText}`,
      response.status,
      response
    )
  }

  if (response.status === 204) {
    // No content
    return {} as TResponse
  }

  return (await response.json()) as TResponse
}

