import { Mocked, vi } from 'vitest';

export type SpyObj<T> = Mocked<T>;

/**
 * Vitest counterpart of jasmine.createSpyObj: an object whose listed methods are vi.fn() mocks.
 * The base name is kept for readability at call sites and as each mock's name in failure output.
 */
export function createSpyObj<T = any>(baseName: string, methodNames: string[]): SpyObj<T> {
  const obj: any = {};
  for (const name of methodNames) {
    obj[name] = vi.fn().mockName(`${baseName}.${name}`);
  }
  return obj;
}
