/* eslint-disable no-unused-vars */
import { apiProvider } from './provider';

export type ApiCoreOptions = {
  url: string;

  getAll?: boolean;
  getSingle?: boolean;
  getByParams?: boolean;
  post?: boolean;
  postFormData?: boolean;
  put?: boolean;
  putById?: boolean;
  putFormData?: boolean;
  patch?: boolean;
  patchByParams?: boolean;
  remove?: boolean;
  removeAll?: boolean;
};

export type Params = Record<string, string | number | boolean | null | undefined>;
export type AdditionalParam = string;

type ApiCoreMethods = {
  getAll?: (
    signal?: AbortSignal,
    additionalParam?: AdditionalParam,
    isAuthorized?: boolean,
  ) => Promise<unknown>;

  getSingle?: (
    id: string | number,
    signal?: AbortSignal,
    additionalParam?: AdditionalParam,
    isAuthorized?: boolean,
  ) => Promise<unknown>;

  getByParams?: (
    params: Params,
    signal?: AbortSignal,
    additionalParam?: AdditionalParam,
    isAuthorized?: boolean,
  ) => Promise<unknown>;

  post?: (
    model: unknown,
    additionalParam?: AdditionalParam,
    isAuthorized?: boolean,
  ) => Promise<unknown>;

  postFormData?: (
    model: FormData,
    additionalParam?: AdditionalParam,
    isAuthorized?: boolean,
  ) => Promise<unknown>;

  put?: (
    model: unknown,
    additionalParam?: AdditionalParam,
    isAuthorized?: boolean,
  ) => Promise<unknown>;

  putById?: (
    id: string | number,
    model: unknown,
    signal?: AbortSignal,
    additionalParam?: AdditionalParam,
    isAuthorized?: boolean,
  ) => Promise<unknown>;

  putFormData?: (
    model: FormData,
    additionalParam?: AdditionalParam,
    isAuthorized?: boolean,
  ) => Promise<unknown>;

  patch?: (
    model: unknown,
    signal?: AbortSignal,
    additionalParam?: AdditionalParam,
    isAuthorized?: boolean,
  ) => Promise<unknown>;

  patchByParams?: (
    additionalParams: string,
    queryParams: string,
    isAuthorized?: boolean,
  ) => Promise<unknown>;

  remove?: (
    id: string | number,
    additionalParams?: AdditionalParam,
    isAuthorized?: boolean,
  ) => Promise<unknown>;

  removeAll?: (
    model: unknown,
    additionalParams?: AdditionalParam,
    isAuthorized?: boolean,
  ) => Promise<unknown>;
};

export class ApiCore implements ApiCoreMethods {
  // just declare the properties (no param names here, so eslint is happy)
  getAll?: ApiCoreMethods['getAll'];
  getSingle?: ApiCoreMethods['getSingle'];
  getByParams?: ApiCoreMethods['getByParams'];
  post?: ApiCoreMethods['post'];
  postFormData?: ApiCoreMethods['postFormData'];
  put?: ApiCoreMethods['put'];
  putById?: ApiCoreMethods['putById'];
  putFormData?: ApiCoreMethods['putFormData'];
  patch?: ApiCoreMethods['patch'];
  patchByParams?: ApiCoreMethods['patchByParams'];
  remove?: ApiCoreMethods['remove'];
  removeAll?: ApiCoreMethods['removeAll'];

  constructor(options: ApiCoreOptions) {
    if (options.getAll) {
      this.getAll = (signal, _additionalParam = '', isAuthorized = false) => {
        // if your provider.getAll doesn't use additionalParam, keep underscore to avoid eslint
        return apiProvider.getAll(options.url, signal, isAuthorized);
      };
    }

    if (options.getSingle) {
      this.getSingle = (id, signal, additionalParam = '', isAuthorized = false) => {
        return apiProvider.getSingle(options.url, id, signal, additionalParam, isAuthorized);
      };
    }

    if (options.getByParams) {
      this.getByParams = (params, signal, additionalParam = '', isAuthorized = false) => {
        return apiProvider.getByParams(options.url, signal, params, additionalParam, isAuthorized);
      };
    }

    if (options.post) {
      this.post = (model, additionalParam = '', isAuthorized = false) => {
        return apiProvider.post(options.url, model, additionalParam, isAuthorized);
      };
    }

    if (options.postFormData) {
      this.postFormData = (model, additionalParam = '', isAuthorized = false) => {
        return apiProvider.postFormData(options.url, model, additionalParam, isAuthorized);
      };
    }

    if (options.put) {
      this.put = (model, additionalParam = '', isAuthorized = false) => {
        return apiProvider.put(options.url, model, additionalParam, isAuthorized);
      };
    }

    if (options.putById) {
      this.putById = (id, model, signal) => {
        // If provider.putById supports extra args, pass them. Otherwise keep underscore params.
        return apiProvider.putById(options.url, id, model, signal);
      };
    }

    if (options.putFormData) {
      this.putFormData = (model, additionalParam = '', isAuthorized = false) => {
        return apiProvider.putFormData(options.url, model, additionalParam, isAuthorized);
      };
    }

    if (options.patch) {
      this.patch = (model, signal) => {
        return apiProvider.patch(options.url, model, signal);
      };
    }

    if (options.patchByParams) {
      this.patchByParams = (additionalParams, queryParams, isAuthorized = false) => {
        return apiProvider.patchByParams(options.url, additionalParams, queryParams, isAuthorized);
      };
    }

    if (options.remove) {
      this.remove = (id, additionalParams = '', isAuthorized = false) => {
        return apiProvider.remove(options.url, id, additionalParams, isAuthorized);
      };
    }

    if (options.removeAll) {
      this.removeAll = (model, additionalParams = '', isAuthorized = false) => {
        return apiProvider.removeAll(options.url, model, additionalParams, isAuthorized);
      };
    }
  }
}
