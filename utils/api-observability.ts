import { expect } from '@playwright/test';
import type { TestInfo } from '@playwright/test';
import { environment } from '../config/environment';

export async function recordApiTiming(
  testInfo: TestInfo,
  operation: string,
  elapsedMs: number,
): Promise<void> {
  testInfo.annotations.push({
    type: 'api-timing',
    description: `${operation}: ${elapsedMs} ms`,
  });

  const attachmentName = `api-timing-${operation
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;

  await testInfo.attach(attachmentName, {
    body: Buffer.from(
      JSON.stringify(
        {
          operation,
          elapsedMs,
          performanceGateEnabled: environment.apiPerformanceGateEnabled,
          thresholdMs: environment.apiResponseTimeThresholdMs,
        },
        null,
        2,
      ),
    ),
    contentType: 'application/json',
  });

  if (environment.apiPerformanceGateEnabled) {
    expect(
      elapsedMs,
      `${operation} exceeded the explicitly enabled API response-time threshold`,
    ).toBeLessThanOrEqual(environment.apiResponseTimeThresholdMs);
  }
}
