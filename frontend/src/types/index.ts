export type ApiStringResponse<T = unknown> = {
  data: T;
  status: string;
  message: string;
};

export type ApiResult<T> = {
  status: string;
  message: T;
};

export type Project = {
  _id: string;
  name: string;
};

export type ApiResponse<T> = {
  status: string;
  message: T;
};

export type ResultRow = Record<string, unknown>;

export type RouteParams = {
  userId?: string;
  projectId?: string;
};

export type Resource = {
  name: string;
  number: number;
  userId?: string;
  projectId?: string;
  id?: string;
  schema?: any[];
  _id?: string;
};

export type SchemaItem = {
  id: number;
  label: string;
  field: string;
  option?: ResultRow;
};

/**
 * Runtime type guard for API responses. Validates the structural shape
 * ({ status: string, message: unknown }) before any further casting.
 */
export function isApiResponse(res: unknown): res is ApiResponse<unknown> {
  return (
    typeof res === 'object' &&
    res !== null &&
    'status' in res &&
    typeof (res as Record<string, unknown>).status === 'string' &&
    'message' in res
  );
}
