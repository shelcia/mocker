import { ApiCore } from "../utilities/core";

const url = "resource";

export const apiResource = new ApiCore({
  getAll: true,
  getSingle: true,
  getByParams: true,
  post: true,
  put: true,
  putById: true,
  patch: true,
  remove: true,
  url: url,
  //   plural: plural,
  //   single: single,
});
