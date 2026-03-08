import type { RequiredMethods } from '../utilities/core';
import { ApiCore } from '../utilities/core';

const url = 'service';

export const apiService = new ApiCore({
  getAll: true,
  getSingle: true,
  getByParams: true,
  post: true,
  put: true,
  putById: true,
  patch: true,
  remove: true,
  url,
}) as RequiredMethods<'getAll' | 'getSingle' | 'getByParams' | 'post' | 'put' | 'putById' | 'patch' | 'remove'>;
