
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  name?: string;
  email?: string;
  message?: string;
  type: "contact" | "notification" | "reset_password";
  resetToken?: string; // Adicionado para suportar token de redefinição
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, name, email, message, type, resetToken }: EmailRequest = await req.json();

    // Validate required fields
    if (!to || !subject || !type) {
      throw new Error("Missing required fields: to, subject, or type");
    }

    let html = "";
    let from = "Copa Sesc <noreply@resend.dev>";

    // Different email templates based on type
    if (type === "contact") {
      if (!name || !email || !message) {
        throw new Error("Contact form requires name, email, and message");
      }
      
      html = `
        <h1>Nova mensagem de contato</h1>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
      `;
      
      // Also send confirmation to the user
      await resend.emails.send({
        from,
        to: email,
        subject: "Recebemos sua mensagem - Copa Sesc",
        html: `
          <h1>Olá, ${name}!</h1>
          <p>Recebemos sua mensagem e responderemos em breve.</p>
          <p>Esta é uma mensagem automática, por favor não responda a este email.</p>
          <hr>
          <p><strong>Sua mensagem:</strong></p>
          <p>${message}</p>
        `,
      });
    } else if (type === "notification") {
      html = `
        <h1>${subject}</h1>
        <p>${message || "Notificação do sistema Copa Sesc."}</p>
      `;
    } else if (type === "reset_password") {
      const resetUrl = resetToken 
        ? `${Deno.env.get("PUBLIC_APP_URL") || "http://localhost:5173"}/reset-password?token=${resetToken}`
        : `${Deno.env.get("PUBLIC_APP_URL") || "http://localhost:5173"}/reset`;
        
      html = `
        <h1>${subject}</h1>
        <p>Você solicitou uma redefinição de senha para sua conta no Copa Sesc.</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <p><a href="${resetUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir minha senha</a></p>
        <p>Se o botão acima não funcionar, copie e cole o link a seguir em seu navegador:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Este link expira em 24 horas.</p>
        <p>Se você não solicitou esta redefinição de senha, por favor ignore este email.</p>
        <p>Este é um email automático, por favor não responda.</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
