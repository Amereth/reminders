export const getApiUrl = (url: string): string =>
  `${import.meta.env.VITE_API_URL}${url}`
