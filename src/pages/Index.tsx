import { Header } from "@/components/Header";
import { DepartmentCard } from "@/components/DepartmentCard";

const departments = [
  {
    title: "Administração e Finanças",
    description: "Gestão administrativa e financeira do município",
    metrics: [
      { label: "Orçamento", value: "R$ 1.2M" },
      { label: "Processos", value: "45" },
    ],
  },
  {
    title: "Cultura e Esporte",
    description: "Promoção de eventos culturais e esportivos",
    metrics: [
      { label: "Eventos", value: "12" },
      { label: "Participantes", value: "2.5k" },
    ],
  },
  {
    title: "Desenvolvimento Econômico",
    description: "Fomento à economia local e sustentabilidade",
    metrics: [
      { label: "Projetos", value: "8" },
      { label: "Empresas", value: "124" },
    ],
  },
  {
    title: "Desenvolvimento Social",
    description: "Programas e ações sociais",
    metrics: [
      { label: "Beneficiários", value: "1.8k" },
      { label: "Programas", value: "15" },
    ],
  },
  {
    title: "Educação",
    description: "Gestão da rede municipal de ensino",
    metrics: [
      { label: "Escolas", value: "32" },
      { label: "Alunos", value: "12k" },
    ],
  },
  {
    title: "Governo",
    description: "Coordenação das ações governamentais",
    metrics: [
      { label: "Projetos", value: "23" },
      { label: "Reuniões", value: "45" },
    ],
  },
  {
    title: "Infraestrutura",
    description: "Obras e serviços públicos",
    metrics: [
      { label: "Obras", value: "18" },
      { label: "Manutenções", value: "156" },
    ],
  },
  {
    title: "Saúde",
    description: "Gestão da saúde pública municipal",
    metrics: [
      { label: "Unidades", value: "24" },
      { label: "Atendimentos", value: "5.6k" },
    ],
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Painel de Controle</h2>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie todas as secretarias municipais em um só lugar.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {departments.map((dept, index) => (
            <DepartmentCard
              key={index}
              title={dept.title}
              description={dept.description}
              metrics={dept.metrics}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;