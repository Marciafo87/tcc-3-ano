/* ==========================================================================
   NEXT LEVEL EXPERIENCE — Conteúdo padrão (demonstrativo)
   --------------------------------------------------------------------------
   Este arquivo contém o conteúdo inicial do site. Tudo aqui pode ser
   editado pelo painel administrativo (/admin). Projetos marcados com
   demo: true ficam ocultos no site (rascunho).
   Não edite à mão, a menos que saiba o que está fazendo: prefira o painel.
   ========================================================================== */
window.NLX_DEFAULTS = {
  schema: 1,

  site: {
    name: "NEXT LEVEL EXPERIENCE",
    slogan: "O futuro não é apenas planejado. É administrado, construído e transformado.",
    institution: "",
    course: "Curso de Administração",
    classGroup: "",
    eventDate: "",
    eventPlace: "",
    contact: "",
    social: []
  },

  texts: {
    heroKicker: "Curso de Administração · Experiência Digital",
    heroTitle: "GESTÃO É TRANSFORMAR IDEIAS EM RESULTADOS.",
    heroSubtitle: "Uma experiência para descobrir como o conhecimento, a estratégia e a inovação constroem o futuro.",
    ctaPrimary: "EXPLORAR EXPERIÊNCIA",
    ctaSecondary: "CONHECER A FORMAÇÃO",

    formacaoTitle: "DO CONHECIMENTO À PRÁTICA.",
    formacaoLead: "Ao longo de dois anos de formação em Administração, os estudantes percorrem áreas que, juntas, ensinam a planejar, organizar, liderar e controlar. Toque em uma área para ver como ela funciona na prática.",
    formacaoNote: "",

    jornadaTitle: "DO PRIMEIRO PASSO AO PRÓXIMO NÍVEL.",
    jornadaLead: "Dois anos, uma evolução. Do primeiro contato com os fundamentos até a aplicação prática em projetos e decisões.",

    praticaTitle: "ADMINISTRAR É FAZER ACONTECER.",
    praticaLead: "Administração vai muito além do escritório. Está em cada decisão de uma padaria, de uma startup, de um hospital ou de um time. Escolha uma situação e veja o passo a passo.",

    simTitle: "VOCÊ É O GESTOR.",
    simLead: "Assuma o comando de uma empresa fictícia. Seis meses, seis decisões. Cada escolha muda os indicadores — e o resultado final depende de você.",
    simDisclaimer: "Simulação educativa com empresa e números fictícios. Não é uma ferramenta de consultoria empresarial.",

    projetosTitle: "IDEIAS QUE SE TRANSFORMARAM EM PROJETOS.",
    projetosLead: "Trabalhos desenvolvidos pelos estudantes: problemas reais, soluções propostas e conhecimentos aplicados.",

    palestrasTitle: "CONHECIMENTO QUE INSPIRA.",
    palestrasLead: "A programação de palestras, demonstrações e atividades da apresentação.",
    palestrasEmpty: "A programação está sendo finalizada. Em breve, horários, temas e palestrantes estarão disponíveis aqui.",

    expTitle: "APRENDA JOGANDO.",
    expLead: "Três experiências rápidas para testar seus conhecimentos, tomar decisões e descobrir com quais áreas da Administração você mais se identifica.",

    mercadoTitle: "ONDE A ADMINISTRAÇÃO PODE LEVAR VOCÊ?",
    mercadoLead: "A formação em Administração abre caminhos em praticamente todo tipo de organização. Conheça algumas possibilidades de atuação e de continuidade dos estudos.",
    mercadoDisclaimer: "As funções apresentadas são exemplos de possibilidades. Oportunidades, requisitos e remuneração variam conforme a região, a organização e o perfil de cada pessoa.",

    inscricaoTitle: "FAÇA SUA INSCRIÇÃO.",
    inscricaoText: "Garanta sua participação. Clique no botão abaixo e preencha o formulário de inscrição.",
    inscricaoButton: "QUERO ME INSCREVER",
    inscricaoEmpty: "Inscrições em breve",

    formTitle: "SEU PRÓXIMO NÍVEL COMEÇA AQUI.",
    formText: "Quer conhecer mais, acompanhar as novidades ou demonstrar seu interesse? Participe através do nosso formulário.",
    formEmpty: "O formulário de interesse ainda não foi configurado. Ele será disponibilizado aqui em breve.",

    sobreTitle: "SOBRE O PROJETO.",
    sobreText: "O NEXT LEVEL EXPERIENCE é uma plataforma digital criada para apresentar o curso de Administração de forma imersiva: o conhecimento adquirido, a sua aplicação prática e a forma como a gestão transforma ideias em resultados. Foi pensada para estudantes, professores, convidados e todas as pessoas interessadas em conhecer o curso.",
    galeriaTitle: "Galeria",
    galeriaEmpty: "As fotos e registros da apresentação serão publicados aqui.",

    closingTitle: "ADMINISTRAR É TRANSFORMAR O PRESENTE PARA CONSTRUIR O FUTURO.",
    closingText: "Cada planejamento começa com uma ideia. Cada resultado nasce de uma decisão. E cada grande transformação começa com pessoas preparadas para fazer acontecer.",
    closingThanks: "OBRIGADO POR FAZER PARTE DESSA EXPERIÊNCIA."
  },

  links: {
    googleForm: "",
    signup: "",
    extra: []
  },

  areas: [
    { id: "a1", icon: "compass", name: "Fundamentos da Administração", image: "",
      description: "As funções clássicas de planejar, organizar, dirigir e controlar, e as principais teorias que explicam como as organizações funcionam.",
      practice: "Entender o papel de cada função ajuda a enxergar a empresa como um sistema em que todas as áreas se conectam.",
      market: "Um gerente de loja planeja as metas do mês, organiza escalas, orienta a equipe e acompanha os resultados." },
    { id: "a2", icon: "target", name: "Planejamento Estratégico", image: "",
      description: "Definição de missão, visão e valores, análise de cenário (como a matriz SWOT) e construção de objetivos e metas.",
      practice: "Transformar um objetivo amplo em metas mensuráveis, com prazos e responsáveis.",
      market: "Uma rede de farmácias decide em quais bairros abrir novas unidades após analisar concorrência e demanda." },
    { id: "a3", icon: "users", name: "Gestão de Pessoas", image: "",
      description: "Liderança, motivação, trabalho em equipe, comunicação e clima organizacional.",
      practice: "Organizar equipes, delegar tarefas e dar feedback que ajude as pessoas a crescer.",
      market: "Um líder de equipe faz reuniões rápidas semanais para alinhar prioridades e reconhecer bons resultados." },
    { id: "a4", icon: "idcard", name: "Recursos Humanos", image: "",
      description: "Recrutamento, seleção, treinamento, desenvolvimento e rotinas de departamento pessoal.",
      practice: "Estruturar um processo seletivo e um plano de integração para novos colaboradores.",
      market: "O setor de RH de uma indústria organiza treinamentos de segurança e acompanha a evolução dos funcionários." },
    { id: "a5", icon: "rocket", name: "Empreendedorismo", image: "",
      description: "Identificação de oportunidades, modelo de negócio, plano de negócios e inovação.",
      practice: "Testar uma ideia com clientes reais antes de investir alto nela.",
      market: "Uma confeiteira valida seu cardápio vendendo por encomenda antes de abrir um ponto físico." },
    { id: "a6", icon: "megaphone", name: "Marketing", image: "",
      description: "Composto de marketing (4 Ps), comportamento do consumidor, posicionamento e comunicação de marca.",
      practice: "Definir público-alvo, proposta de valor e os canais certos para alcançar os clientes.",
      market: "Uma academia cria uma campanha nas redes sociais voltada para iniciantes, com aula experimental gratuita." },
    { id: "a7", icon: "chart", name: "Gestão Financeira", image: "",
      description: "Fluxo de caixa, custos, formação de preço, capital de giro, orçamento e análise de resultados.",
      practice: "Acompanhar entradas e saídas para tomar decisões antes que o caixa fique negativo.",
      market: "Um restaurante revisa o preço dos pratos após calcular o custo real de cada ingrediente." },
    { id: "a8", icon: "calculator", name: "Contabilidade", image: "",
      description: "Registro e organização das informações patrimoniais e financeiras de uma organização.",
      practice: "Ler os principais demonstrativos para entender a saúde da empresa.",
      market: "Uma pequena empresa usa os relatórios contábeis para conseguir crédito em um banco." },
    { id: "a9", icon: "truck", name: "Logística", image: "",
      description: "Compras, estoques, armazenagem, transporte e distribuição.",
      practice: "Evitar falta ou excesso de estoque, equilibrando custo e disponibilidade.",
      market: "Um e-commerce organiza o estoque por giro de produtos para despachar pedidos mais rápido." },
    { id: "a10", icon: "flow", name: "Gestão de Processos", image: "",
      description: "Mapeamento, padronização e melhoria contínua de processos, como no ciclo PDCA.",
      practice: "Desenhar o passo a passo de uma atividade para eliminar retrabalho e desperdício.",
      market: "Uma clínica reorganiza o fluxo de recepção e reduz o tempo de espera dos pacientes." },
    { id: "a11", icon: "chat", name: "Comunicação Empresarial", image: "",
      description: "Comunicação interna e externa, redação empresarial, apresentações e negociação.",
      practice: "Transmitir informações com clareza para equipes, clientes e parceiros.",
      market: "Uma empresa comunica uma mudança de horário aos clientes com antecedência e por vários canais." },
    { id: "a12", icon: "building", name: "Organização Empresarial", image: "",
      description: "Estrutura organizacional, organogramas, departamentos, níveis hierárquicos e responsabilidades.",
      practice: "Definir quem faz o quê e a quem cada pessoa responde.",
      market: "Uma empresa em crescimento cria um organograma para deixar claras as funções de cada setor." },
    { id: "a13", icon: "headset", name: "Atendimento ao Cliente", image: "",
      description: "Qualidade no atendimento, relacionamento, pós-venda e tratamento de reclamações.",
      practice: "Transformar uma reclamação em oportunidade de fidelizar o cliente.",
      market: "Uma loja cria um canal de pós-venda para acompanhar a satisfação depois da compra." },
    { id: "a14", icon: "branch", name: "Tomada de Decisões", image: "",
      description: "Análise de problemas, levantamento de alternativas, avaliação de riscos e escolha baseada em dados.",
      practice: "Comparar opções com critérios claros em vez de decidir por impulso.",
      market: "Um gestor compara três fornecedores por preço, prazo e qualidade antes de fechar contrato." }
  ],

  journeyIntro: {
    year1: "Apresentação dos fundamentos, conceitos, conhecimentos iniciais e desenvolvimento das primeiras habilidades administrativas.",
    year2: "Aprofundamento dos conhecimentos, aplicação prática, desenvolvimento de projetos, organização, planejamento e tomada de decisões."
  },

  journey: [
    { id: "j1", year: "1", title: "Fundamentos", text: "Primeiro contato com os conceitos de Administração e com o funcionamento das organizações." },
    { id: "j2", year: "1", title: "Conceitos-chave", text: "Construção do vocabulário da gestão: planejamento, organização, direção e controle." },
    { id: "j3", year: "1", title: "Primeiras habilidades", text: "Desenvolvimento das primeiras habilidades administrativas, de comunicação e de trabalho em equipe." },
    { id: "j4", year: "2", title: "Aprofundamento", text: "Aprofundamento dos conhecimentos nas diferentes áreas da gestão." },
    { id: "j5", year: "2", title: "Aplicação prática", text: "Aplicação dos conceitos em situações práticas e no desenvolvimento de projetos." },
    { id: "j6", year: "2", title: "Próximo nível", text: "Organização, planejamento e tomada de decisões: a preparação para os próximos passos." }
  ],

  practice: [
    { id: "p1", icon: "building", title: "Organizar uma empresa", concept: "Estrutura organizacional",
      steps: ["Definir as atividades principais", "Agrupar atividades em setores", "Distribuir funções e responsabilidades", "Desenhar o organograma", "Revisar quando a empresa crescer"],
      example: "Uma lanchonete separa as funções de caixa, cozinha e entregas, e define um responsável por turno." },
    { id: "p2", icon: "rocket", title: "Planejar um negócio", concept: "Plano de negócios",
      steps: ["Identificar a oportunidade", "Conhecer o público e a concorrência", "Definir produto, preço e canais", "Projetar custos e receitas", "Testar, medir e ajustar"],
      example: "Antes de abrir um brechó on-line, a empreendedora pesquisa o público, calcula custos de envio e testa as vendas por um mês." },
    { id: "p3", icon: "layers", title: "Administrar recursos", concept: "Recursos e prioridades",
      steps: ["Listar recursos: pessoas, dinheiro, tempo e materiais", "Definir prioridades", "Alocar recursos onde geram mais resultado", "Acompanhar o uso", "Redistribuir quando necessário"],
      example: "Uma ONG decide aplicar a maior parte da verba no projeto com mais impacto e reduz gastos administrativos." },
    { id: "p4", icon: "users", title: "Organizar equipes", concept: "Liderança e delegação",
      steps: ["Conhecer as habilidades de cada pessoa", "Definir objetivos comuns", "Delegar tarefas com clareza", "Acompanhar e dar feedback", "Reconhecer resultados"],
      example: "Na organização de um evento, a líder divide a equipe em recepção, logística e comunicação, cada uma com metas próprias." },
    { id: "p5", icon: "wallet", title: "Controlar despesas", concept: "Fluxo de caixa",
      steps: ["Registrar todas as entradas e saídas", "Separar custos fixos e variáveis", "Comparar com o orçamento", "Cortar desperdícios com critério", "Criar uma reserva de segurança"],
      example: "Uma família empreendedora descobre, pelo fluxo de caixa, que pequenas compras sem controle somavam boa parte das despesas." },
    { id: "p6", icon: "target", title: "Planejar estratégias", concept: "Análise SWOT",
      steps: ["Analisar forças e fraquezas internas", "Mapear oportunidades e ameaças externas", "Definir objetivos estratégicos", "Transformar objetivos em metas", "Monitorar indicadores"],
      example: "Uma livraria de bairro percebe a ameaça das lojas on-line e aposta em eventos e clube de leitura como diferencial." },
    { id: "p7", icon: "headset", title: "Atender clientes", concept: "Experiência do cliente",
      steps: ["Ouvir com atenção", "Entender a necessidade real", "Oferecer uma solução clara", "Cumprir o combinado", "Acompanhar no pós-venda"],
      example: "Uma assistência técnica envia uma mensagem dias depois do conserto para saber se está tudo funcionando." },
    { id: "p8", icon: "bulb", title: "Solucionar problemas", concept: "Ciclo PDCA",
      steps: ["Planejar: identificar o problema e a causa", "Executar: aplicar a solução", "Checar: medir os resultados", "Agir: padronizar ou corrigir", "Recomeçar o ciclo"],
      example: "Uma padaria com muitas sobras de pão analisa as vendas por horário e ajusta a produção ao longo do dia." }
  ],

  categories: ["Empreendedorismo", "Planejamento", "Gestão Empresarial", "Marketing", "Finanças", "Recursos Humanos", "Logística", "Projetos Integradores"],

  projects: [],

  talks: [],

  gallery: [],

  simulator: {
    company: "Horizonte Café & Co.",
    intro: "A Horizonte Café & Co. é uma cafeteria fictícia que está perdendo clientes e com o caixa apertado. Você foi contratado(a) para assumir a gestão pelos próximos seis meses. Seu objetivo: equilibrar finanças, clientes, equipe, processos e marca.",
    startCash: 60000,
    start: { clientes: 50, equipe: 50, processos: 40, marca: 45 },
    rounds: [
      { title: "Mês 1 · O diagnóstico",
        situation: "As vendas caíram nos últimos meses e o caixa está apertado. Qual é o seu primeiro movimento como gestor(a)?",
        options: [
          { text: "Cortar 20% das despesas imediatamente", cash: 8000, effects: { equipe: -8, clientes: -4 }, concept: "Controle de custos",
            feedback: "O caixa respirou. Mas cortes sem critério atingiram a equipe e a qualidade. Reduzir custos funciona melhor quando se sabe exatamente onde cortar." },
          { text: "Fazer um diagnóstico completo antes de agir (análise SWOT)", cash: -1000, effects: { processos: 8, clientes: 2, equipe: 2 }, flag: "diagnostico", concept: "Planejamento estratégico",
            feedback: "Você descobriu que o problema principal é a demora no atendimento e a falta de divulgação. Decidir com informação reduz riscos — esse diagnóstico vai ajudar nas próximas decisões." },
          { text: "Lançar uma promoção agressiva de preços", cash: -5000, effects: { clientes: 10, marca: 2 }, concept: "Formação de preço",
            feedback: "Os clientes voltaram, mas a margem de lucro caiu. Promoções atraem, porém preço baixo sem controle de custos pode comprometer o caixa." },
          { text: "Investir em divulgação nas redes sociais", cash: -6000, effects: { marca: 12, clientes: 5 }, concept: "Marketing digital",
            feedback: "A marca ganhou visibilidade. Divulgação é investimento — o retorno vem se a empresa conseguir atender bem quem chega." }
        ] },
      { title: "Mês 2 · Filas e reclamações",
        situation: "Os clientes reclamam da demora no atendimento, principalmente no horário de pico. O que você faz?",
        options: [
          { text: "Treinar a equipe de atendimento", cash: -4000, effects: { equipe: 10, clientes: 10, processos: 4 }, flag: "treino", concept: "Desenvolvimento de pessoas",
            feedback: "Equipe mais preparada, atendimento mais rápido e cordial. Treinamento é um investimento que continua gerando resultado ao longo do tempo." },
          { text: "Contratar mais um funcionário", cash: -7000, effects: { clientes: 8, equipe: 4 }, concept: "Dimensionamento de equipe",
            feedback: "As filas diminuíram, mas a folha de pagamento aumentou. Contratar resolve, mas é preciso verificar se o problema não está no processo." },
          { text: "Mapear e reorganizar o fluxo de pedidos", cash: -1500, effects: { processos: 14, clientes: 6 }, concept: "Gestão de processos",
            feedback: "Você eliminou etapas desnecessárias e o tempo de espera caiu. Muitas vezes, melhorar o processo resolve sem aumentar custos." },
          { text: "Ignorar por enquanto e focar no caixa", cash: 0, effects: { clientes: -12, marca: -8 }, concept: "Experiência do cliente",
            feedback: "As reclamações se espalharam nas avaliações on-line. Problemas de atendimento ignorados costumam crescer e afetar a reputação." }
        ] },
      { title: "Mês 3 · A proposta do fornecedor",
        situation: "Um fornecedor oferece 15% de desconto para uma compra de grande volume, com pagamento à vista. Como você negocia?",
        options: [
          { text: "Aceitar e comprar o estoque grande à vista", cash: -12000, effects: { processos: -2 }, concept: "Capital de giro",
            feedback: "O desconto foi bom, mas muito dinheiro ficou parado em estoque. Comprometer o capital de giro pode deixar a empresa sem fôlego para imprevistos." },
          { text: "Negociar um prazo maior de pagamento", cash: -2000, effects: { processos: 4 }, cashBonus: 4000, concept: "Negociação",
            feedback: "Você conseguiu parte do desconto e um prazo melhor. Negociar prazos ajuda a manter o caixa saudável sem perder boas condições." },
          { text: "Pesquisar e comparar outros fornecedores", cash: -500, effects: { processos: 3 }, cashBonus: 2500, concept: "Tomada de decisão",
            feedback: "Comparando preço, prazo e qualidade, você encontrou uma condição equilibrada. Decisões melhores nascem de alternativas comparadas." },
          { text: "Manter tudo como está", cash: 0, effects: {}, concept: "Análise de oportunidades",
            feedback: "Nada mudou — nem para melhor, nem para pior. Às vezes não agir é uma escolha válida, mas pode significar perder uma oportunidade." }
        ] },
      { title: "Mês 4 · Equipe desmotivada",
        ifFlag: { flag: "treino", effects: { equipe: 4 }, note: "O treinamento do mês 2 deixou a equipe mais preparada para este momento." },
        situation: "Dois funcionários experientes estão pensando em sair. O clima na equipe não está bom. Qual é a sua atitude?",
        options: [
          { text: "Conversar com a equipe e criar um plano de reconhecimento", cash: -2500, effects: { equipe: 14, clientes: 4 }, concept: "Liderança",
            feedback: "Ouvir as pessoas revelou problemas simples de resolver. Reconhecimento e diálogo aumentam o engajamento." },
          { text: "Dar aumento salarial para todos", cash: -9000, effects: { equipe: 10 }, concept: "Gestão de pessoas",
            feedback: "A equipe ficou satisfeita no curto prazo, mas o custo fixo subiu bastante. Dinheiro importa, mas não resolve sozinho problemas de clima." },
          { text: "Delegar responsabilidades com metas claras", cash: -500, effects: { equipe: 8, processos: 6 }, concept: "Delegação",
            feedback: "Com autonomia e metas definidas, as pessoas se sentiram valorizadas e a operação ficou mais organizada." },
          { text: "Não fazer nada — eles que decidam", cash: 0, effects: { equipe: -14, clientes: -5 }, concept: "Clima organizacional",
            feedback: "Os dois funcionários saíram e levaram experiência com eles. Repor pessoas custa tempo e dinheiro." }
        ] },
      { title: "Mês 5 · Uma oportunidade de expansão",
        situation: "Um shopping próximo convida a empresa para abrir um quiosque. O investimento é alto. O que você decide?",
        options: [
          { text: "Abrir o quiosque agora", cash: -20000, effects: { marca: 10, clientes: 6 }, risky: true, concept: "Expansão",
            feedback: "A marca ganhou presença. Mas expandir exige caixa: se as finanças não estiverem saudáveis, o risco aumenta muito." },
          { text: "Fazer um estudo de viabilidade primeiro", cash: -1500, effects: { processos: 4, marca: 2 }, concept: "Análise de viabilidade",
            ifFlag: { flag: "diagnostico", effects: { marca: 3, processos: 2 }, note: "O diagnóstico do mês 1 adiantou o estudo e revelou um bom ponto para crescer." },
            feedback: "O estudo mostrou o momento certo e o investimento necessário. Planejar antes de expandir evita prejuízos." },
          { text: "Recusar e fortalecer o negócio atual", cash: 0, effects: { processos: 4, clientes: 2 }, concept: "Foco estratégico",
            feedback: "Você priorizou consolidar a operação. Dizer não a uma oportunidade também é estratégia." },
          { text: "Buscar um parceiro para dividir o investimento", cash: -8000, effects: { marca: 8, clientes: 4 }, concept: "Parcerias estratégicas",
            feedback: "Dividindo custos e riscos, a empresa cresceu com mais segurança. Parcerias bem escolhidas ampliam a capacidade da empresa." }
        ] },
      { title: "Mês 6 · Crise inesperada",
        situation: "A máquina de café principal quebra em pleno sábado de movimento. Como você gerencia a crise?",
        options: [
          { text: "Comprar uma máquina nova imediatamente", cash: -15000, effects: { clientes: 4 }, concept: "Gestão de riscos",
            feedback: "O problema foi resolvido rápido, mas o gasto não planejado pesou no caixa. Uma reserva de emergência faz diferença nessas horas." },
          { text: "Comunicar os clientes com transparência e oferecer um cardápio alternativo", cash: -800, effects: { marca: 8, clientes: 4 }, concept: "Gestão de crise",
            feedback: "A transparência gerou empatia, e o cardápio alternativo manteve as vendas. Comunicação clara transforma crises em confiança." },
          { text: "Fechar a loja no dia", cash: -4000, effects: { clientes: -10, marca: -6 }, concept: "Continuidade do negócio",
            feedback: "A empresa perdeu um dia inteiro de vendas e deixou clientes sem resposta. Ter um plano B evita paradas totais." },
          { text: "Acionar a assistência e reorganizar o atendimento com os equipamentos reserva", cash: -3000, effects: { processos: 6, clientes: 2 }, concept: "Plano de contingência",
            ifKpi: { kpi: "processos", min: 55, effects: { clientes: 5, marca: 3 }, note: "Como seus processos já estavam organizados, a equipe reagiu rápido e os clientes quase não perceberam o problema." },
            feedback: "Com um plano de contingência, a operação continuou funcionando. Processos bem organizados fazem a empresa reagir melhor a imprevistos." }
        ] }
    ]
  },

  quiz: [
    { id: "q1", topic: "Planejamento", question: "O que significa a sigla SWOT, usada no planejamento estratégico?",
      options: ["Forças, Fraquezas, Oportunidades e Ameaças", "Vendas, Lucros, Ofertas e Taxas", "Sistema, Workflow, Organização e Tempo", "Serviços, Web, Operações e Tecnologia"], correct: 0,
      explain: "SWOT vem do inglês Strengths, Weaknesses, Opportunities e Threats. Forças e fraquezas são internas; oportunidades e ameaças vêm do ambiente externo." },
    { id: "q2", topic: "Gestão", question: "No ciclo PDCA, o que representa a letra C?",
      options: ["Controlar custos", "Checar (verificar os resultados)", "Comunicar a equipe", "Criar novos produtos"], correct: 1,
      explain: "PDCA significa Plan (planejar), Do (executar), Check (checar) e Act (agir). É uma ferramenta de melhoria contínua." },
    { id: "q3", topic: "Marketing", question: "Quais são os 4 Ps do composto de marketing?",
      options: ["Pessoas, Processos, Prazos e Planos", "Produto, Preço, Praça e Promoção", "Público, Parceria, Publicidade e Pesquisa", "Produção, Pagamento, Pedido e Perfil"], correct: 1,
      explain: "Produto, Preço, Praça (distribuição) e Promoção (comunicação) formam o composto de marketing clássico." },
    { id: "q4", topic: "Finanças", question: "Qual destes é um exemplo de custo fixo para uma loja?",
      options: ["Aluguel do ponto comercial", "Matéria-prima de cada produto vendido", "Comissão por venda", "Embalagem de cada pedido"], correct: 0,
      explain: "Custos fixos não variam com a quantidade vendida no curto prazo, como o aluguel. Os demais variam conforme as vendas: são custos variáveis." },
    { id: "q5", topic: "Finanças", question: "Para que serve o fluxo de caixa?",
      options: ["Para registrar apenas as vendas do mês", "Para controlar as entradas e saídas de dinheiro ao longo do tempo", "Para calcular o salário dos funcionários", "Para definir a missão da empresa"], correct: 1,
      explain: "O fluxo de caixa mostra o dinheiro que entra e sai em um período, ajudando a prever falta de recursos e a planejar." },
    { id: "q6", topic: "Planejamento", question: "Qual é a diferença entre missão e visão de uma empresa?",
      options: ["Não há diferença, são sinônimos", "Missão é a razão de existir; visão é onde a empresa quer chegar", "Missão é o lucro desejado; visão é o logotipo", "Missão é o futuro; visão é o passado"], correct: 1,
      explain: "A missão descreve o propósito da organização no presente. A visão expressa o futuro que ela deseja alcançar." },
    { id: "q7", topic: "Organização", question: "O que é um organograma?",
      options: ["Um gráfico de vendas mensais", "A representação gráfica da estrutura de uma organização", "Uma agenda de reuniões", "Um tipo de contrato de trabalho"], correct: 1,
      explain: "O organograma mostra visualmente setores, cargos e relações de hierarquia dentro da organização." },
    { id: "q8", topic: "Finanças", question: "O que é o ponto de equilíbrio?",
      options: ["O momento em que a empresa tem mais clientes", "O nível de vendas em que as receitas cobrem exatamente os custos totais", "O dia do pagamento dos funcionários", "O preço máximo que o cliente aceita pagar"], correct: 1,
      explain: "No ponto de equilíbrio não há lucro nem prejuízo. Vender acima dele gera lucro; abaixo, prejuízo." },
    { id: "q9", topic: "Liderança", question: "Qual atitude representa melhor uma boa liderança?",
      options: ["Centralizar todas as decisões sem ouvir ninguém", "Influenciar e orientar pessoas para alcançar objetivos comuns", "Evitar dar feedback para não gerar conflitos", "Cobrar resultados sem definir metas"], correct: 1,
      explain: "Liderar é influenciar pessoas de forma positiva, com objetivos claros, comunicação e feedback." },
    { id: "q10", topic: "Empreendedorismo", question: "Em uma meta SMART, o que significa a letra M?",
      options: ["Mensurável", "Motivadora", "Mínima", "Mensal"], correct: 0,
      explain: "SMART: Específica, Mensurável, Atingível, Relevante e Temporal. Metas mensuráveis permitem acompanhar o progresso." }
  ],

  challenges: [
    { id: "c1", title: "Reclamação nas redes", situation: "Um cliente publicou uma reclamação sobre um pedido atrasado e o post está ganhando comentários. O que você faz?",
      options: [
        { text: "Apagar o comentário e bloquear o cliente", score: 0, outcome: "A situação piorou: outros clientes perceberam e a reputação foi afetada. Esconder problemas costuma ampliá-los." },
        { text: "Responder rapidamente, com empatia, e resolver no privado", score: 2, outcome: "Melhor escolha! O cliente se sentiu ouvido, o problema foi resolvido e quem acompanhou viu uma empresa responsável." },
        { text: "Esperar a repercussão passar sozinha", score: 1, outcome: "O assunto até esfriou, mas o cliente não voltou e a imagem ficou arranhada. O tempo de resposta importa." }
      ] },
    { id: "c2", title: "Vendas em queda", situation: "As vendas caíram 30% em um mês. Qual deve ser o primeiro passo?",
      options: [
        { text: "Baixar todos os preços imediatamente", score: 1, outcome: "Pode atrair clientes, mas sem conhecer a causa você pode reduzir a margem à toa." },
        { text: "Demitir parte da equipe para economizar", score: 0, outcome: "Reduziu custos, mas enfraqueceu a operação sem resolver a causa da queda." },
        { text: "Analisar os dados para entender a causa antes de agir", score: 2, outcome: "Melhor escolha! Ao analisar, você descobre se o problema é preço, atendimento, concorrência ou sazonalidade — e age no ponto certo." }
      ] },
    { id: "c3", title: "Conflito na equipe", situation: "Dois funcionários estão em conflito e isso está atrapalhando o setor inteiro. Como agir?",
      options: [
        { text: "Mediar uma conversa, ouvir os dois lados e definir acordos", score: 2, outcome: "Melhor escolha! A mediação resolveu o conflito e deixou combinados claros para o futuro." },
        { text: "Escolher um lado e advertir o outro", score: 0, outcome: "O conflito ficou ainda maior e a equipe passou a ver a liderança como injusta." },
        { text: "Separar os dois em turnos diferentes", score: 1, outcome: "Diminuiu o atrito, mas o problema de fundo não foi resolvido." }
      ] },
    { id: "c4", title: "Sobrou dinheiro", situation: "Depois de um ótimo mês, sobrou dinheiro no caixa. O que fazer com ele?",
      options: [
        { text: "Gastar tudo em reformas e decoração", score: 0, outcome: "A loja ficou bonita, mas a empresa ficou sem reserva para imprevistos." },
        { text: "Formar uma reserva de emergência e planejar investimentos", score: 2, outcome: "Melhor escolha! A empresa ganhou segurança e pode investir com planejamento." },
        { text: "Distribuir todo o valor entre os sócios", score: 1, outcome: "Os sócios gostaram, mas a empresa perdeu fôlego para crescer e enfrentar meses fracos." }
      ] }
  ],

  profiles: [
    { key: "empreendedor", icon: "rocket", name: "Perfil Empreendedor", description: "Você enxerga oportunidades onde outros veem problemas e gosta de tirar ideias do papel.", areas: "Empreendedorismo, inovação, novos negócios" },
    { key: "estrategico", icon: "target", name: "Perfil Estratégico", description: "Você pensa no longo prazo, analisa cenários e gosta de traçar o caminho até o objetivo.", areas: "Planejamento estratégico, análise de mercado, projetos" },
    { key: "financeiro", icon: "chart", name: "Perfil Financeiro", description: "Números fazem sentido para você. Você gosta de controle, precisão e decisões baseadas em dados.", areas: "Finanças, contabilidade, controle de custos" },
    { key: "lideranca", icon: "users", name: "Perfil de Liderança", description: "Você mobiliza pessoas, assume responsabilidades e gosta de conduzir equipes até o resultado.", areas: "Gestão de pessoas, coordenação de equipes, recursos humanos" },
    { key: "organizacional", icon: "flow", name: "Perfil Organizacional", description: "Você gosta de ordem, processos claros e de fazer tudo funcionar do jeito certo.", areas: "Processos, logística, rotinas administrativas" },
    { key: "comunicacao", icon: "chat", name: "Perfil de Comunicação", description: "Você se conecta com pessoas, sabe se expressar e gosta de criar relacionamentos.", areas: "Marketing, atendimento, comunicação empresarial" }
  ],

  profileQuestions: [
    { id: "pq1", question: "Em um trabalho em grupo, você normalmente...",
      options: [
        { text: "Dá a ideia inicial do projeto", profile: "empreendedor" },
        { text: "Define o plano e as etapas", profile: "estrategico" },
        { text: "Cuida do orçamento e dos números", profile: "financeiro" },
        { text: "Coordena e motiva o grupo", profile: "lideranca" },
        { text: "Organiza prazos e arquivos", profile: "organizacional" },
        { text: "Apresenta o trabalho para a turma", profile: "comunicacao" }
      ] },
    { id: "pq2", question: "Qual desafio parece mais interessante?",
      options: [
        { text: "Criar um negócio do zero", profile: "empreendedor" },
        { text: "Planejar o futuro de uma empresa", profile: "estrategico" },
        { text: "Descobrir por que o lucro caiu", profile: "financeiro" },
        { text: "Transformar um grupo em um time", profile: "lideranca" },
        { text: "Acabar com a bagunça de um setor", profile: "organizacional" },
        { text: "Conquistar novos clientes", profile: "comunicacao" }
      ] },
    { id: "pq3", question: "Uma ferramenta que você usaria todos os dias:",
      options: [
        { text: "Um quadro de ideias", profile: "empreendedor" },
        { text: "Um mapa de metas", profile: "estrategico" },
        { text: "Uma planilha bem feita", profile: "financeiro" },
        { text: "Reuniões rápidas com a equipe", profile: "lideranca" },
        { text: "Uma lista de tarefas e processos", profile: "organizacional" },
        { text: "Redes sociais e apresentações", profile: "comunicacao" }
      ] },
    { id: "pq4", question: "Você se sente mais realizado(a) quando...",
      options: [
        { text: "Algo novo que você criou dá certo", profile: "empreendedor" },
        { text: "Um plano sai exatamente como previsto", profile: "estrategico" },
        { text: "As contas fecham no azul", profile: "financeiro" },
        { text: "A equipe alcança a meta junta", profile: "lideranca" },
        { text: "Tudo funciona sem atrasos", profile: "organizacional" },
        { text: "As pessoas entendem e gostam da sua mensagem", profile: "comunicacao" }
      ] },
    { id: "pq5", question: "Qual frase combina mais com você?",
      options: [
        { text: "\"E se a gente tentasse algo diferente?\"", profile: "empreendedor" },
        { text: "\"Qual é o objetivo final?\"", profile: "estrategico" },
        { text: "\"Quanto isso custa?\"", profile: "financeiro" },
        { text: "\"Vamos juntos, eu ajudo.\"", profile: "lideranca" },
        { text: "\"Primeiro, vamos organizar.\"", profile: "organizacional" },
        { text: "\"Deixa que eu explico.\"", profile: "comunicacao" }
      ] }
  ],

  careers: [
    { id: "cr1", icon: "briefcase", title: "Assistente Administrativo", description: "Apoia as rotinas da empresa: documentos, atendimento, organização de informações e suporte aos setores." },
    { id: "cr2", icon: "chart", title: "Auxiliar Financeiro", description: "Ajuda no controle de contas a pagar e a receber, no fluxo de caixa e na organização de relatórios." },
    { id: "cr3", icon: "idcard", title: "Assistente de Recursos Humanos", description: "Apoia processos seletivos, integração de novos colaboradores, treinamentos e rotinas de pessoal." },
    { id: "cr4", icon: "megaphone", title: "Assistente de Marketing", description: "Colabora em campanhas, redes sociais, pesquisas de mercado e materiais de divulgação." },
    { id: "cr5", icon: "handshake", title: "Assistente Comercial", description: "Atua no relacionamento com clientes, propostas, acompanhamento de vendas e pós-venda." },
    { id: "cr6", icon: "truck", title: "Auxiliar de Logística", description: "Apoia o controle de estoque, recebimento, expedição de mercadorias e organização de pedidos." },
    { id: "cr7", icon: "rocket", title: "Empreendedor", description: "Cria e administra o próprio negócio, aplicando planejamento, finanças, marketing e gestão de pessoas." },
    { id: "cr8", icon: "target", title: "Assistente de Planejamento", description: "Ajuda a organizar metas, acompanhar indicadores e preparar informações para a tomada de decisões." }
  ],

  studies: [
    { id: "st1", title: "Graduação", description: "Bacharelado em Administração ou cursos superiores de tecnologia em áreas de gestão, como Recursos Humanos, Logística, Marketing e Gestão Financeira." },
    { id: "st2", title: "Cursos técnicos e de qualificação", description: "Formações complementares em áreas específicas, como logística, finanças, recursos humanos ou vendas." },
    { id: "st3", title: "Programas de estágio e aprendizagem", description: "Oportunidades para colocar o conhecimento em prática e ganhar experiência profissional." },
    { id: "st4", title: "Aprendizado contínuo", description: "Cursos livres, certificações e eventos para acompanhar as mudanças do mercado." }
  ],

  nex: [
    { id: "n1", keywords: "o que e administracao, administracao, adm, curso, o que faz", target: "formacao",
      answer: "Administração é a área que ensina a planejar, organizar, dirigir e controlar recursos — pessoas, dinheiro, tempo e materiais — para transformar ideias em resultados. Está presente em empresas, ONGs, órgãos públicos e no próprio negócio." },
    { id: "n2", keywords: "aprendem, aprender, estudam, materias, disciplinas, conteudo, formacao, areas", target: "formacao",
      answer: "Os estudantes passam por áreas como planejamento, gestão de pessoas, marketing, finanças, logística e processos. Veja as áreas de conhecimento na seção Nossa Formação." },
    { id: "n3", keywords: "dois anos, jornada, primeiro ano, segundo ano, evolucao, linha do tempo", target: "jornada",
      answer: "No primeiro ano, os fundamentos e as primeiras habilidades. No segundo, o aprofundamento, a aplicação prática e os projetos. Confira a linha do tempo completa." },
    { id: "n4", keywords: "projeto, projetos, trabalhos, galeria", target: "projetos",
      answer: "{projects}" },
    { id: "n5", keywords: "palestra, palestras, programacao, horario, horarios, agenda, palestrante", target: "palestras",
      answer: "{talks}" },
    { id: "n11", keywords: "inscricao, inscrever, inscrevo, inscrições, inscricoes, participar, participacao", target: "inscricao",
      answer: "{signup}" },
    { id: "n6", keywords: "formulario, forms, interesse, qr, qr code, contato", target: "formulario",
      answer: "{form}" },
    { id: "n7", keywords: "profissao, profissoes, emprego, trabalho, carreira, mercado, areas profissionais, onde trabalhar", target: "mercado",
      answer: "A formação abre caminhos como assistente administrativo, auxiliar financeiro, assistente de RH, de marketing, comercial, de logística e também o empreendedorismo. Veja a seção Mercado de Trabalho." },
    { id: "n8", keywords: "simulador, gestor, jogo, jogar, simulacao", target: "simulador",
      answer: "No simulador Você é o Gestor, você administra uma empresa fictícia por seis meses e vê as consequências de cada decisão. Vamos lá?" },
    { id: "n9", keywords: "quiz, perguntas, teste, perfil, desafio", target: "experiencias",
      answer: "Temos três experiências: um quiz de Administração, um desafio empresarial e o Descubra seu Perfil. Escolha a sua!" },
    { id: "n10", keywords: "oi, ola, bom dia, boa tarde, boa noite, quem e voce, nex", target: "",
      answer: "Olá! Eu sou o NEX, o assistente do NEXT LEVEL EXPERIENCE. Posso te levar até a formação, os projetos, as palestras, o formulário ou o simulador. O que você quer explorar?" }
  ],

  meta: { updatedAt: 0, log: [] }
};
