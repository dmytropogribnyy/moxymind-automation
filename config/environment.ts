import 'dotenv/config';

const positiveInteger = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Expected a positive integer, received: ${value}`);
  }

  return parsed;
};

const booleanValue = (value: string | undefined, fallback: boolean): boolean => {
  if (!value) return fallback;

  if (value === 'true') return true;
  if (value === 'false') return false;

  throw new Error(`Expected "true" or "false", received: ${value}`);
};

export const environment = Object.freeze({
  sauceDemoBaseUrl: process.env.SAUCEDEMO_BASE_URL ?? 'https://www.saucedemo.com',
  reqresBaseUrl: process.env.REQRES_BASE_URL ?? 'https://reqres.in',
  reqresApiKey: process.env.REQRES_API_KEY?.trim() || undefined,
  apiPerformanceGateEnabled: booleanValue(process.env.API_PERFORMANCE_GATE, false),
  apiResponseTimeThresholdMs: positiveInteger(process.env.API_RESPONSE_TIME_THRESHOLD_MS, 2_000),
});
