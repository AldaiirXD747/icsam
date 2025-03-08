
import { supabase } from '@/integrations/supabase/client';

interface EmailParams {
  to: string;
  subject: string;
  name?: string;
  email?: string;
  message?: string;
  type: 'contact' | 'notification' | 'reset_password';
  resetToken?: string;
}

export const sendEmail = async (params: EmailParams): Promise<{success: boolean; error?: string}> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: params,
    });

    if (error) {
      console.error('Error invoking send-email function:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
};

// Generate a reset password token
export const generateResetToken = (email: string): string => {
  // Simple token generation - in production you would use a more secure method
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  return btoa(`${email}:${timestamp}:${randomString}`);
};

// Validate a reset token
export const validateResetToken = (token: string): {valid: boolean; email?: string} => {
  try {
    const decoded = atob(token);
    const [email, timestamp] = decoded.split(':');
    
    // Check if token is expired (24 hours)
    const tokenTime = parseInt(timestamp);
    const currentTime = new Date().getTime();
    
    if (currentTime - tokenTime > 24 * 60 * 60 * 1000) {
      return { valid: false };
    }
    
    return { valid: true, email };
  } catch (error) {
    return { valid: false };
  }
};
