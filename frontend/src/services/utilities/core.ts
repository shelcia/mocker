import { apiProvider } from './provider';

export type ApiCoreOptions = {
  /** This is your "resource" segment (your old code calls it url). Example: "projects" */
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

export class ApiCore {
  // declare optional methods so TS knows they exist
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

  constructor(options: ApiCoreOptions) {
    if (options.getAll) {
      this.getAll = (signal, additionalParam = '', isAuthorized = false) => {
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
      this.putById = (id, model, signal, additionalParam = '', isAuthorized = false) => {
        // NOTE: your provider.js putById only accepts (resource, id, model, signal)
        // If you extended provider.putById to accept additionalParam/isAuthorized, keep as-is.
        // Otherwise, remove additionalParam/isAuthorized here.
        return apiProvider.putById(options.url, id, model, signal);
      };
    }

    if (options.putFormData) {
      this.putFormData = (model, additionalParam = '', isAuthorized = false) => {
        return apiProvider.putFormData(options.url, model, additionalParam, isAuthorized);
      };
    }

    if (options.patch) {
      this.patch = (model, signal, additionalParam = '', isAuthorized = false) => {
        // NOTE: your provider.js patch only accepts (resource, model, signal)
        // If you extended provider.patch to accept additionalParam/isAuthorized, keep as-is.
        // Otherwise, remove additionalParam/isAuthorized here.
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
