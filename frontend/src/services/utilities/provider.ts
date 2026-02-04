// provider.js

import axios from 'axios';

import { BACKEND_URL } from '../api';

import { handleError, handleResponse } from './response';
// import { LOCALHOST_URL } from "../api";

// Define your api url from any source.
// Pulling from your .env file when on the server or from localhost when locally
// const BASE_URL = LOCALHOST_URL;

const BASE_URL = BACKEND_URL;

let token = localStorage.getItem('MockAPI-Token');

type Params = Record<string, string | number | boolean | null | undefined>;
type AdditionalParam = string; // keeping your current design: "" or "something"

/** @param {string} resource */
const getAll = async (resource: string, signal: AbortSignal, isAuthorized: boolean = false) => {
  const headers = isAuthorized ? { 'auth-token': token } : {};

  try {
    const response = await axios.get(`${BASE_URL}`, {
      signal: signal,
      headers: headers,
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/** @param {string} resource */
/** @param {string} id */
/** @param {string} additionalParam */
const getSingle = async (
  resource: string,
  id: string | number,
  signal?: AbortSignal,
  additionalParam: AdditionalParam = '',
  isAuthorized: boolean = false,
) => {
  const headers = isAuthorized ? { 'auth-token': token } : {};

  try {
    let response;

    if (additionalParam === '') {
      response = await axios.get(`${BASE_URL}/${resource}/${id}`, {
        signal: signal,
        headers: headers,
      });
    } else {
      // console.log(`${BASE_URL}/${resource}/${additionalParam}/${id}`);
      response = await axios.get(`${BASE_URL}/${resource}/${additionalParam}/${id}`, {
        signal: signal,
        headers: headers,
      });
    }

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/** @param {string} resource */
/** @param {string} params */
const getByParams = async (
  resource: string,
  signal: AbortSignal | undefined,
  params: Params,
  additionalParam: AdditionalParam = '',
  isAuthorized: boolean = false,
) => {
  const headers = isAuthorized ? { 'auth-token': token } : {};

  try {
    let response;

    if (additionalParam === '') {
      response = await axios.get(`${BASE_URL}/${resource}`, {
        signal: signal,
        headers: headers,
        params: params,
      });
    } else {
      response = await axios.get(`${BASE_URL}/${resource}/${additionalParam}`, {
        signal: signal,
        headers: headers,
        params: params,
      });
    }

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/** @param {string} resource */
/** @param {object} model */
const post = async (
  resource: string,
  model: unknown,
  additionalParam: AdditionalParam = '',
  isAuthorized: boolean = false,
) => {
  // console.log({ model });

  const headers = isAuthorized ? { 'auth-token': token } : {};

  try {
    let response;

    if (additionalParam === '') {
      response = await axios.post(`${BASE_URL}/${resource}`, model, {
        headers: headers,
      });
    } else {
      //   console.log(`${BASE_URL}/${additionalParam}`);
      response = await axios.post(`${BASE_URL}/${resource}/${additionalParam}`, model, {
        headers: headers,
      });
    }

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/** @param {string} resource */
/** @param {object} model */

const postFormData = async (
  resource: string,
  model: FormData,
  additionalParam: AdditionalParam = '',
  isAuthorized: boolean = false,
) => {
  // console.log("invoked");
  const headers = isAuthorized
    ? {
        'Content-Type': 'multipart/form-data',
        'auth-token': `${token}`,
      }
    : { 'Content-Type': 'multipart/form-data' };

  try {
    let response;

    if (additionalParam === '') {
      response = await axios.post(`${BASE_URL}/${resource}`, model, {
        headers: headers,
      });
    } else {
      response = await axios.post(`${BASE_URL}/${resource}/${additionalParam}`, model, {
        headers: headers,
      });
    }

    // console.log(await response);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/** @param {string} resource */
/** @param {object} model */
const put = async (
  resource: string,
  model: unknown,
  additionalParams: AdditionalParam = '',
  isAuthorized: boolean = false,
) => {
  const headers = isAuthorized ? { 'auth-token': token } : {};

  try {
    let response;

    if (additionalParams === '') {
      response = await axios.put(`${BASE_URL}/${resource}`, model, {
        headers: headers,
      });
    } else {
      response = await axios.put(`${BASE_URL}/${resource}/${additionalParams}`, model, {
        headers: headers,
      });
    }

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/** @param {string} resource */
/** @param {object} model */
const putById = async (
  resource: string,
  id: string | number,
  model: unknown,
  signal?: AbortSignal,
) => {
  try {
    const response = await axios.put(`${BASE_URL}/${resource}/${id}`, model, {
      signal: signal,
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/** @param {string} resource */
/** @param {object} model */

const putFormData = async (
  resource: string,
  model: FormData,
  additionalParam: AdditionalParam = '',
  isAuthorized: boolean = false,
) => {
  // console.log("invoked");
  const headers = isAuthorized
    ? {
        'Content-Type': 'multipart/form-data',
        'auth-token': `${token}`,
      }
    : { 'Content-Type': 'multipart/form-data' };

  try {
    let response;

    if (additionalParam === '') {
      response = await axios.put(`${BASE_URL}/${resource}`, model, {
        headers: headers,
      });
    } else {
      response = await axios.put(`${BASE_URL}/${resource}/${additionalParam}`, model, {
        headers: headers,
      });
    }

    // console.log(await response);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/** @param {string} resource */
/** @param {object} model */
const patch = async (resource: string, model: unknown, signal?: AbortSignal) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${resource}`, model, {
      signal: signal,
      headers: {
        'auth-token': token,
      },
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// has no body
/** @param {string} resource */
const patchByParams = async (
  resource: string,
  additionalParams: string,
  queryParams: string,
  isAuthorized: boolean = false,
) => {
  const headers = isAuthorized ? { 'auth-token': token } : {};

  try {
    let request = axios.create({
      method: 'PATCH',
      baseURL: `${BASE_URL}/${resource}/${additionalParams}?${queryParams}`,
      headers: headers,
    });
    const response = await request.patch(null);

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/** @param {string} resource */
/** @param {string} id */
const remove = async (
  resource: string,
  id: string | number,
  additionalParams: AdditionalParam = '',
  isAuthorized: boolean = false,
) => {
  const headers = isAuthorized ? { 'auth-token': token } : {};

  // console.log(`${BASE_URL}/${resource}/${id}`);
  try {
    let response;

    if (additionalParams === '') {
      response = await axios.delete(`${BASE_URL}/${resource}/${id}`, {
        headers: headers,
      });
    } else {
      response = await axios.delete(`${BASE_URL}/${resource}/${additionalParams}/${id}`, {
        headers: headers,
      });
    }

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/** @param {string} resource */
/** @param {object} model */
const removeAll = async (
  resource: string,
  model: unknown,
  additionalParams: AdditionalParam = '',
  isAuthorized: boolean = false,
) => {
  const headers = isAuthorized ? { 'auth-token': token } : {};

  try {
    let response;

    if (additionalParams === '') {
      response = await axios.delete(`${BASE_URL}/${resource}`, {
        headers: headers,
        data: model,
      });
    } else {
      response = await axios.delete(`${BASE_URL}/${resource}/${additionalParams}`, {
        headers: headers,
        data: model,
      });
    }

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * @description Since token is initialised on login
 * API call or before if any. But token value get updated
 * in local storage after token is fetch from server. So to
 * make token value update, this method is necessary. So that
 * future API call that needs authorization can have the updated
 * token
 *
 */
const updateToken = () => {
  token = localStorage.getItem('MockAPI-Token');
};

export const apiProvider = {
  getAll,
  getSingle,
  getByParams,
  post,
  postFormData,
  put,
  putById,
  putFormData,
  patch,
  patchByParams,
  remove,
  removeAll,
  updateToken,
};
