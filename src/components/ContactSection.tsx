
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Mensagem enviada",
        description: "Agradecemos seu contato. Responderemos em breve!",
        duration: 5000,
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-2">
            <span className="text-blue-primary font-medium text-sm">Entre em Contato</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-primary">Fale Conosco</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tem alguma dúvida, sugestão ou gostaria de conhecer mais sobre nossos projetos? 
            Envie-nos uma mensagem e entraremos em contato.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/5">
            <div className="glass-card p-8 h-full">
              <h3 className="text-2xl font-bold text-blue-primary mb-6">Informações de Contato</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 p-3 rounded-full bg-blue-primary text-white">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-blue-primary">Email</p>
                    <a href="mailto:contato@institutocriancasantamaria.com.br" className="text-gray-600 hover:text-blue-primary transition-colors">
                      contato@institutocriancasantamaria.com.br
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 p-3 rounded-full bg-blue-primary text-white">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-blue-primary">Telefone</p>
                    <a href="tel:+5561993128187" className="text-gray-600 hover:text-blue-primary transition-colors">
                      (61) 99312-8187
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 p-3 rounded-full bg-blue-primary text-white">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-blue-primary">Endereço</p>
                    <address className="text-gray-600 not-italic">
                      Quadra 309 Conjunto A - lote 12<br />
                      Santa Maria, Brasília - DF<br />
                      <a 
                        href="https://maps.app.goo.gl/DCN2rJ3GmN2CwmXL7" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-primary hover:underline mt-1 inline-block"
                      >
                        Ver no Google Maps
                      </a>
                    </address>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="bg-gray-100 rounded-lg p-4">
                  <h4 className="font-medium text-blue-primary mb-2">Horário de Funcionamento</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between">
                      <span>Segunda a Sexta:</span>
                      <span>8h às 18h</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sábado:</span>
                      <span>8h às 12h</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Domingo:</span>
                      <span>Fechado</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-3/5">
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-blue-primary mb-6">Envie uma Mensagem</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nome Completo
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu.email@exemplo.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Assunto
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Assunto da mensagem"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Mensagem
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Digite sua mensagem aqui..."
                    rows={5}
                    required
                  />
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    className="bg-blue-primary hover:bg-blue-light text-white w-full flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                    <Send size={16} className="ml-2" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
