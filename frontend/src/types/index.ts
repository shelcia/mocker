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