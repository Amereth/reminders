export const api = (url: string): string =>
  `${import.meta.env.VITE_API_URL}${url}`
