import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => {
  return {
    uri: process.env.MONGODB_URI ?? 'mongodb://mongodb:27017/pokemon_logs',
    database: process.env.MONGODB_DATABASE ?? 'pokemon_logs',
  };
});
