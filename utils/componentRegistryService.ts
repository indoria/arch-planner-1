export interface ComponentRegistryFilter {
  type?: string;
  search?: string;
  token?: string;
  apiBaseUrl?: string;
}

export interface PublishComponentInput {
  name: string;
  type: string;
  data: any;
}

export interface RegistryComponent {
  id: number;
  name: string;
  type: string;
  ownerId: number;
  data: any;
  createdAt?: string;
  updatedAt?: string;
}

export class ComponentRegistryService {
  static async getComponents(options?: ComponentRegistryFilter): Promise<RegistryComponent[]> {
    const baseUrl = options?.apiBaseUrl?.replace(/\/$/, '') || '';
    const params = new URLSearchParams();
    if (options?.type) params.set('type', options.type);
    if (options?.search) params.set('search', options.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const url = `${baseUrl}/components${queryString}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch components';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    return response.json();
  }

  static async getComponentById(id: number | string, options?: { token?: string; apiBaseUrl?: string }): Promise<RegistryComponent> {
    const baseUrl = options?.apiBaseUrl?.replace(/\/$/, '') || '';
    const url = `${baseUrl}/components/${id}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch component';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    return response.json();
  }

  static async publishComponent(component: PublishComponentInput, options?: { token?: string; apiBaseUrl?: string }): Promise<RegistryComponent> {
    const baseUrl = options?.apiBaseUrl?.replace(/\/$/, '') || '';
    const url = `${baseUrl}/components`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(component)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to publish component';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    return response.json();
  }
}
