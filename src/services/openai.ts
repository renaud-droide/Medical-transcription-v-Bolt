export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  temperature: number;
  presence_penalty: number;
  frequency_penalty: number;
  max_tokens: number;
}

import { API_CONFIG } from '../config/api';

export async function chatCompletion(messages: ChatMessage[], options: ChatCompletionOptions): Promise<string> {
  const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
    method: 'POST',
    headers: API_CONFIG.headers,
    body: JSON.stringify({
      model: 'gpt-4o-mini-2024-07-18',
      messages,
      temperature: options.temperature,
      presence_penalty: options.presence_penalty,
      frequency_penalty: options.frequency_penalty,
      max_tokens: options.max_tokens,
      response_format: { type: 'text' }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Erreur lors de la requête OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}
