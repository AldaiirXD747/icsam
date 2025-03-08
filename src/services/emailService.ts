
import { supabase } from '@/integrations/supabase/client';

interface EmailParams {
  to: string;
  subject: string;
  name?: string;
  email?: string;
  message?: string;
  type: 'contact' | 'notification' | 'reset_password';
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
