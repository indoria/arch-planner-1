export interface ShareOptions {
  token?: string;
  apiBaseUrl?: string;
}

export interface CloneOptions {
  token?: string;
  name?: string;
  apiBaseUrl?: string;
}

export interface ShareResult {
  shareUrl: string;
  isPublic: boolean;
  shareId?: string | number;
  [key: string]: any;
}

export class CollaborationService {
  static buildShareUrl(id: string | number, baseUrl?: string): string {
    const cleanBase = baseUrl ? baseUrl.replace(/\/$/, '') : (typeof window !== 'undefined' ? window.location.origin : '');
    const path = `/architectures/share/${id}`;
    return cleanBase ? `${cleanBase}${path}` : path;
  }

  static async shareArchitecture(id: string | number, options?: ShareOptions): Promise<ShareResult> {
    const baseUrl = options?.apiBaseUrl?.replace(/\/$/, '') || '';
    const url = `${baseUrl}/architectures/${id}/share`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers
    });

    if (!response.ok) {
      let errorMessage = 'Failed to share architecture';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    return response.json();
  }

  static async cloneArchitecture(id: string | number, options?: CloneOptions): Promise<any> {
    const baseUrl = options?.apiBaseUrl?.replace(/\/$/, '') || '';
    const url = `${baseUrl}/architectures/${id}/clone`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: options?.name })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to clone architecture';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    return response.json();
  }
}
