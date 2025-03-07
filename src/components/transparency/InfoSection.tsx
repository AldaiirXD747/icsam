
import React from 'react';

const InfoSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-primary mb-8 text-center">Compromisso com a Transparência</h2>
          
          <div className="text-gray-700 space-y-4 mb-8">
            <p>
              O Instituto Criança Santa Maria tem um compromisso inabalável com a transparência e a prestação de contas. Acreditamos que é nosso dever disponibilizar todas as informações relevantes sobre nossas atividades, projetos e uso de recursos para a sociedade.
            </p>
            <p>
              Todos os documentos aqui disponibilizados são de acesso público e podem ser baixados livremente. Nossa gestão é comprometida com a ética, a responsabilidade social e o uso eficiente dos recursos que nos são confiados.
            </p>
            <p>
              Para mais informações ou esclarecimentos sobre qualquer documento, entre em contato através dos nossos canais oficiais.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h4 className="font-bold text-blue-primary mb-2">Atualização</h4>
              <p className="text-gray-600 text-sm">
                Os documentos são atualizados regularmente conforme novas informações são disponibilizadas.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h4 className="font-bold text-blue-primary mb-2">Acessibilidade</h4>
              <p className="text-gray-600 text-sm">
                Trabalhamos para garantir que todas as informações sejam facilmente acessíveis a qualquer cidadão.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h4 className="font-bold text-blue-primary mb-2">Integridade</h4>
              <p className="text-gray-600 text-sm">
                Todas as informações divulgadas passam por rigoroso processo de verificação e validação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
