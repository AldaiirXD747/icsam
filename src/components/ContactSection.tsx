
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { sendEmail } from '@/services/emailService';
import { Loader2 } from 'lucide-react';

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Informe um email válido' }),
  subject: z.string().min(5, { message: 'O assunto deve ter pelo menos 5 caracteres' }),
  message: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' }),
});

type ContactFormValues = z.infer<typeof formSchema>;

const ContactSection = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Form submission handler
  const onSubmit = async (values: ContactFormValues) => {
    setSubmitting(true);
    
    try {
      // Define admin email that will receive contact form submissions
      const adminEmail = 'contato@institutocriancasantamaria.com.br'; // Updated with the actual email
      
      const { success, error } = await sendEmail({
        to: adminEmail,
        subject: `Formulário de Contato: ${values.subject}`,
        name: values.name,
        email: values.email,
        message: values.message,
        type: 'contact',
      });
      
      if (success) {
        toast({
          title: "Mensagem enviada!",
          description: "Agradecemos seu contato. Responderemos em breve.",
          variant: "default",
        });
        
        // Reset form after successful submission
        form.reset();
      } else {
        throw new Error(error || 'Falha ao enviar mensagem');
      }
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-primary mb-4">Entre em Contato</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tem alguma dúvida, sugestão ou quer saber mais sobre a Copa Sesc? 
            Preencha o formulário abaixo e entraremos em contato o mais breve possível.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu-email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assunto</FormLabel>
                    <FormControl>
                      <Input placeholder="Assunto da mensagem" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite sua mensagem aqui..." 
                        className="min-h-[150px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full md:w-auto btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Mensagem'
                )}
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="text-gray-600">contato@institutocriancasantamaria.com.br</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Telefone</h3>
            <p className="text-gray-600">(61) 99312-8187</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Endereço</h3>
            <p className="text-gray-600">Quadra 309 Conjunto A - lote 12<br />Santa Maria, Brasília - DF</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
