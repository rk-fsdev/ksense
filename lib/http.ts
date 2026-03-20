const API_BASE = "https://assessment.ksensetech.com/api";
const RETRYABLE_STATUS = new Set([429, 500, 503]);

type HttpMethod = "GET" | "POST";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchFromAssessmentApi<T>(
  path: string,
  method: HttpMethod,
  apiKey: string,
  body?: unknown,
): Promise<T> {
  const maxAttempts = 6;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        if (RETRYABLE_STATUS.has(response.status) && attempt < maxAttempts) {
          const delay = 200 * 2 ** (attempt - 1) + Math.floor(Math.random() * 120);
          await wait(delay);
          continue;
        }
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error;
      }
      const delay = 200 * 2 ** (attempt - 1) + Math.floor(Math.random() * 120);
      await wait(delay);
    }
  }

  throw new Error("Unreachable retry loop");
}
