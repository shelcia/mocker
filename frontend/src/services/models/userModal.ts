import type { RequiredMethods } from '../utilities/core';
import { ApiCore } from '../utilities/core';

const url = 'user';

export const apiUser = new ApiCore({
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
