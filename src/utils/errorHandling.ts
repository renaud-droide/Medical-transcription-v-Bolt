interface OpenAIError {
  error?: {
    type?: string;
    code?: string;
    message?: string;
  };
}

export function handleAPIError(status: number, data: OpenAIError): Error {
  let errorMessage = 'Une erreur est survenue lors de la communication avec l\'API.';

  switch (status) {
    case 401:
      errorMessage = 'Erreur d\'authentification. Veuillez vérifier votre clé API.';
      break;
    case 429:
      if (data.error?.code === 'rate_limit_exceeded') {
        errorMessage = 'Limite d\'utilisation de l\'API atteinte. Veuillez réessayer dans quelques minutes.';
      } else if (data.error?.code === 'tokens_exceeded') {
        errorMessage = 'Quota de tokens dépassé. Veuillez vérifier votre abonnement OpenAI.';
      } else {
        errorMessage = 'Trop de requêtes. Veuillez réessayer dans quelques minutes.';
      }
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      errorMessage = 'Le service est temporairement indisponible. Veuillez réessayer plus tard.';
      break;
    default:
      if (data.error?.message) {
        errorMessage = `Erreur: ${data.error.message}`;
      }
  }

  return new Error(errorMessage);
}

export const API_LIMITS = {
  GPT4_TURBO: {
    MAX_TOKENS_PER_REQUEST: 128000,
    MAX_REQUESTS_PER_MINUTE: 500,
    MAX_TOKENS_PER_MINUTE: 300000,
    PRICING: {
      INPUT_PER_1K_TOKENS: 0.01,
      OUTPUT_PER_1K_TOKENS: 0.03
    }
  },
  GPT4: {
    MAX_TOKENS_PER_REQUEST: 8192,
    MAX_REQUESTS_PER_MINUTE: 200,
    MAX_TOKENS_PER_MINUTE: 40000,
    PRICING: {
      INPUT_PER_1K_TOKENS: 0.03,
      OUTPUT_PER_1K_TOKENS: 0.06
    }
  }
};