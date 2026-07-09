/**
 * Base types shared across MiniStack UI packages.
 * This module is side-effect free: only type declarations and pure helpers.
 */

/** A value that may be `null`. */
export type Nullable<T> = T | null

/** A value that may be `undefined`. */
export type Optional<T> = T | undefined

/**
 * Nominal typing helper. `Brand<string, 'UserId'>` is assignable to `string`
 * but a raw `string` is not assignable to it without an explicit cast.
 */
export type Brand<T, B extends string> = T & { readonly __brand: B }

/** Epoch milliseconds. */
export type Timestamp = Brand<number, 'Timestamp'>

/** ISO-8601 date-time string. */
export type Iso8601 = Brand<string, 'Iso8601'>

/** Discriminated result type for operations that can fail without throwing. */
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }

/** Wrap a success value in a {@link Result}. */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

/** Wrap an error in a {@link Result}. */
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}
