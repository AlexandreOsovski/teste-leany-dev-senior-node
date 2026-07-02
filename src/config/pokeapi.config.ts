export const POKEAPI_CONFIG = {
  TTL_HOURS: 24,
  MAX_RETRIES: 3,
  TIMEOUT_MS: 5000,
  BASE_URL: process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2',
};
