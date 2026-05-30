export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: { message: string; code: string } };

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}>;

export type ServiceStatus = 'healthy' | 'degraded' | 'unavailable';
