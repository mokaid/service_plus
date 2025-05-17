export type ServerResponse<
  T extends Record<string, unknown> = Record<string, never>,
> = {
  /**
   * 0 - Succeed,
   * 1 - Error
   */
  error: 0 | 1;
  desc?: string;
} & T;

export type ServerError = Omit<ServerResponse, "desc">;
