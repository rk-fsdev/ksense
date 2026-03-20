export function getApiKeyOrThrow(): string {
  const apiKey = process.env.ASSESSMENT_API_KEY?.trim() || process.env.API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing API key. Set ASSESSMENT_API_KEY in .env.local");
  }
  return apiKey;
}
