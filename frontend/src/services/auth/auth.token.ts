import { apiProvider } from '@/services/utilities/provider';

const TOKEN_KEY = 'MockAPI-Token';

export const authToken = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    apiProvider.updateToken();
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    apiProvider.updateToken();
  },
};
