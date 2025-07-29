export const API_CONFIG = {
  baseURL: 'https://api.openai.com/v1'
};

export const getOpenAIHeaders = (apiKey: string) => ({
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
});
