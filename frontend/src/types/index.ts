export type ApiStringResponse<T = unknown> = {
  data: T;
  status: string;
  message: string;
};
