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

  const finalHeaders: Record<string, string> = {};
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  // Set JSON headers if not FormData
  if (!isFormData) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  // Add Authorization header
  const token = localStorage.getItem(AccessTokenKey);
  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers: { ...finalHeaders, ...headers },
    body: body
      ? isFormData
        ? (body as BodyInit)
        : JSON.stringify(body)
      : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new FetchError(
      `Request failed with status ${response.status}: ${errorText}`,
      response.status,
      response
    );
  }

  if (response.status === 204) {
    return {} as TResponse; // No Content
  }

  return (await response.json()) as TResponse;
}


