export const OPENAI_API_KEY = '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';
export const DEEPGRAM_API_KEY = '2a16e46b879b0ba8e113cb0fd0a6fce6b5a38464';

export const API_CONFIG = {
  baseURL: 'https://api.openai.com/v1',
  DEEPGRAM_API_KEY: DEEPGRAM_API_KEY,
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
};