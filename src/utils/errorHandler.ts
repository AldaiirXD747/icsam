
import { toast } from '@/components/ui/use-toast';

// Type definitions for error responses
interface ApiError {
  message?: string;
  error?: string;
  statusCode?: number;
  details?: string | string[];
}

/**
 * Standardized error handler that can be used across the application
 */
export const handleError = (error: unknown, customMessage?: string): string => {
  console.error('Error caught by handler:', error);
  
  // Default error message
  let errorMessage = customMessage || 'Ocorreu um erro inesperado. Tente novamente.';
  
  if (error instanceof Error) {
    // Handle standard JavaScript Error objects
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    // Handle string errors
    errorMessage = error;
  } else if (error && typeof error === 'object') {
    // Handle API-like error objects
    const apiError = error as ApiError;
    
    if (apiError.message) {
      errorMessage = apiError.message;
    } else if (apiError.error) {
      errorMessage = apiError.error;
    }
    
    // Enrich with details if available
    if (apiError.details) {
      const details = Array.isArray(apiError.details) 
        ? apiError.details.join(', ') 
        : apiError.details;
      
      errorMessage = `${errorMessage} (${details})`;
    }
  }
  
  return errorMessage;
};

/**
 * Show a toast with an error message
 */
export const showErrorToast = (error: unknown, title = 'Erro'): void => {
  const message = handleError(error);
  
  toast({
    title,
    description: message,
    variant: 'destructive',
  });
};

/**
 * Higher-order function to wrap async operations with error handling
 */
export const withErrorHandling = <T>(
  asyncFn: () => Promise<T>,
  errorHandler?: (error: unknown) => void
): Promise<T> => {
  return asyncFn().catch((error) => {
    if (errorHandler) {
      errorHandler(error);
    } else {
      showErrorToast(error);
    }
    throw error;
  });
};

/**
 * Map common API/Supabase error codes to user-friendly messages
 */
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  // Handle Supabase-specific errors
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const errorCode = (error as { code: string }).code;
    
    switch (errorCode) {
      case 'PGRST116':
        return 'Você não tem permissão para acessar este recurso.';
      case '23505':
        return 'Este registro já existe no sistema.';
      case '23503':
        return 'Este registro não pode ser removido pois está sendo usado em outros lugares.';
      case '42P01':
        return 'Erro de configuração do banco de dados. Por favor, contate o suporte.';
      case 'auth/email-already-in-use':
        return 'Este email já está sendo usado por outra conta.';
      case 'auth/user-not-found':
        return 'Usuário não encontrado.';
      case 'auth/wrong-password':
        return 'Senha incorreta.';
      default:
        // For other codes, extract message if possible
        if ('message' in error && typeof (error as any).message === 'string') {
          return (error as any).message;
        }
        return `Erro inesperado (Código: ${errorCode}).`;
    }
  }
  
  // Fallback to generic error handler
  return handleError(error);
};
