import type { ServerError } from "../types/api";

export function isServerError(error: unknown): error is ServerError {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as ServerError).error === 1
  );
}
