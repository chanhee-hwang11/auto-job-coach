/**
 * Safe API client for Vercel Serverless Functions and AI Studio
 * - Validates HTTP Status (404, 401, 429, 500, etc.)
 * - Validates Content-Type before calling .json() to prevent "Unexpected token 'T'"
 * - Sanitizes logs (NO API keys or personal info in logs)
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  isHtmlResponse?: boolean;
}

export async function safeFetchJson<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const status = response.status;
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    // 1. Handle Non-JSON responses (Prevent "Unexpected token <" or "The page cannot be found")
    if (!isJson) {
      const rawText = await response.text();
      const sanitizedSnippet = rawText.slice(0, 120).replace(/[\r\n]+/g, ' ').trim();

      // Differentiate errors without exposing sensitive information
      if (status === 404) {
        console.error(`[API Error: 404 Not Found at ${url}] Vercel Serverless Function 경로를 찾을 수 없습니다. vercel.json 라우팅 확인이 필요합니다.`);
        return {
          ok: false,
          status,
          error: `[404 오류] API 경로(${url})를 찾을 수 없습니다. Vercel 배포 시 /api 폴더와 vercel.json 설정을 확인하세요.`,
          isHtmlResponse: true,
        };
      }

      if (status === 500) {
        console.error(`[API Error: 500 Internal Server Error at ${url}] 서버 내부 오류.`);
        return {
          ok: false,
          status,
          error: `[500 오류] 서버 내부 오류가 발생했습니다. (응답: ${sanitizedSnippet})`,
          isHtmlResponse: true,
        };
      }

      console.error(`[API Error: ${status} Non-JSON at ${url}] Content-Type: ${contentType}. Snippet: ${sanitizedSnippet}`);
      return {
        ok: false,
        status,
        error: `[HTTP ${status}] 서버에서 JSON이 아닌 응답이 반환되었습니다. (${sanitizedSnippet})`,
        isHtmlResponse: true,
      };
    }

    // 2. Safe JSON Parse
    const json = await response.json();

    // 3. Handle specific HTTP status codes
    if (!response.ok) {
      if (status === 401) {
        console.error(`[API Error: 401 Unauthorized at ${url}] GEMINI_API_KEY 인증 실패.`);
        return {
          ok: false,
          status,
          error: 'Gemini API 키가 유효하지 않습니다. Vercel 환경변수(GEMINI_API_KEY)를 확인해 주세요.',
        };
      }

      if (status === 429) {
        console.error(`[API Error: 429 Too Many Requests at ${url}] Quota/Rate Limit 초과.`);
        return {
          ok: false,
          status,
          error: 'AI 모델 요청 한도(Rate Limit)를 초과했습니다. 잠시 후 다시 시도해 주세요.',
        };
      }

      if (status === 503) {
        console.error(`[API Error: 503 Service Unavailable at ${url}] AI 서비스 트래픽 급증.`);
        return {
          ok: false,
          status,
          error: 'AI 서비스가 일시적으로 혼잡합니다. 잠시 후 다시 시도해 주세요.',
        };
      }

      console.error(`[API Error: ${status} at ${url}]`, json.error || 'Unknown error');
      return {
        ok: false,
        status,
        error: json.error || `서버 오류 (HTTP ${status})`,
      };
    }

    return {
      ok: true,
      status,
      data: json.data || json,
    };
  } catch (err: any) {
    console.error(`[Network / Fetch Exception at ${url}]`, err.message || '네트워크 연결 실패');
    return {
      ok: false,
      status: 0,
      error: `네트워크 연결 실패: ${err.message || '서버에 접속할 수 없습니다.'}`,
    };
  }
}
