export type StudyTopic = {
  track: "COMUM" | "PMPE" | "PCPE AGENTE";
  subject: string;
  detail: string;
};

export type StudyWeek = {
  period: string;
  title: string;
  topics: StudyTopic[];
};

export const dailyBlocks = [
  { time: "1h15", label: "Teoria e legislação", detail: "Estude conteúdo novo; em Direito, leia os dispositivos legais pertinentes." },
  { time: "1h", label: "Questões", detail: "Resolva questões do assunto e corrija cada resposta." },
  { time: "45 min", label: "Revisão", detail: "Recorde sem consulta, revise temas anteriores e analise os erros." },
];

export const weeklyRoutine = [
  { day: "Segunda", subject: "Língua Portuguesa", focus: "Teoria, interpretação e gramática.", track: "COMUM" },
  { day: "Terça", subject: "História de Pernambuco", focus: "Conteúdo histórico e cronologia.", track: "PMPE" },
  { day: "Quarta", subject: "Raciocínio Lógico", focus: "Conceitos, técnicas e exercícios.", track: "COMUM" },
  { day: "Quinta", subject: "Informática", focus: "Conceitos, sistemas e questões práticas.", track: "COMUM" },
  { day: "Sexta", subject: "Direito Constitucional", focus: "Constituição e legislação relacionada.", track: "COMUM" },
  { day: "Sábado", subject: "Direitos Humanos + Legislação", focus: "Divida as 3 horas entre as duas áreas; inclua legislação específica PCPE Agente.", track: "PMPE + PCPE" },
  { day: "Domingo", subject: "Revisão + simulado + redação", focus: "Priorize pontos fracos, questões mistas e treino discursivo.", track: "ALTERNAR" },
];

const topic = (track: StudyTopic["track"], subject: string, detail: string): StudyTopic => ({ track, subject, detail });

export const studyWeeks: StudyWeek[] = [
  { period: "19–25 out", title: "Construção da base", topics: [
    topic("COMUM", "Português", "Compreensão e interpretação de textos; tipologias e gêneros textuais."),
    topic("PMPE", "História", "Ocupação e colonização; contatos iniciais com os povos nativos; Capitanias Hereditárias; Duarte Coelho."),
    topic("COMUM", "Raciocínio Lógico", "Proposições, conectivos, quantificadores e falácias."),
    topic("COMUM", "Informática", "Internet, intranet, navegadores, serviços de internet e computação em nuvem."),
    topic("COMUM", "Constitucional", "Princípios fundamentais."),
    topic("PMPE", "Direitos Humanos", "Conceito, terminologia, estrutura normativa, fundamentos, classificação e especificidades."),
    topic("PMPE", "Legislação", "ECA: direitos e garantias fundamentais."),
    topic("PCPE AGENTE", "Legislação estadual", "Constituição de Pernambuco e estatutos do cargo."),
  ] },
  { period: "26 out–1 nov", title: "Base e direitos", topics: [
    topic("COMUM", "Português", "Figuras de linguagem; relações semânticas entre orações, períodos e parágrafos."),
    topic("PMPE", "História", "Importância do açúcar; formação de Olinda e Recife."),
    topic("COMUM", "Raciocínio Lógico", "Analogias, inferências, deduções, equivalência e implicação lógica, argumentos e conclusões."),
    topic("COMUM", "Informática", "Segurança da informação: ameaças, vulnerabilidades, malwares, phishing, criptografia e autenticação."),
    topic("COMUM", "Constitucional", "Direitos e deveres individuais e coletivos; vida, liberdade, igualdade, segurança e propriedade."),
    topic("PMPE", "Direitos Humanos", "Evolução histórica e gerações de direitos."),
    topic("PMPE", "Legislação", "ECA: ato infracional, apreensão, apresentação, atuação policial, Conselho Tutelar e disposições pertinentes."),
    topic("PCPE AGENTE", "Constitucional", "Princípios, direitos e organização do Estado."),
  ] },
  { period: "2–8 nov", title: "Segurança e tratados", topics: [
    topic("COMUM", "Português", "Ortografia oficial; acentuação gráfica."),
    topic("PMPE", "História", "Presença holandesa e governo de Maurício de Nassau."),
    topic("COMUM", "Raciocínio Lógico", "Diagramas lógicos."),
    topic("COMUM", "Informática", "Armazenamento de dados, dispositivos, backup e restauração."),
    topic("COMUM", "Constitucional", "Direitos sociais, nacionalidade, direitos políticos e remédios constitucionais."),
    topic("PMPE", "Direitos Humanos", "Tratados no ordenamento brasileiro; CF, art. 5º, §§ 2º e 3º; hierarquia normativa."),
    topic("PMPE", "Legislação", "Lei de Abuso de Autoridade (Lei nº 13.869/2019) e Lei de Tortura (Lei nº 9.455/1997)."),
    topic("PCPE AGENTE", "Administrativo", "Princípios, atos e poderes administrativos."),
  ] },
  { period: "9–15 nov", title: "Gramática e história", topics: [
    topic("COMUM", "Português", "Classes de palavras."),
    topic("PMPE", "História", "Movimentos de resistência: quilombos e Insurreição Pernambucana (1654)."),
    topic("COMUM", "Raciocínio Lógico", "Princípios da contagem, princípio multiplicativo e técnicas de contagem."),
    topic("COMUM", "Informática", "Arquivos, pastas, programas, componentes do computador, memória, processador e periféricos."),
    topic("COMUM", "Constitucional", "Organização político-administrativa do Estado e repartição de competências."),
    topic("PMPE", "Direitos Humanos", "Declaração Universal dos Direitos Humanos (1948)."),
    topic("PMPE", "Legislação", "Lei Maria da Penha (Lei nº 11.340/2006)."),
    topic("PCPE AGENTE", "Penal", "Lei penal, aplicação e teoria do crime."),
  ] },
  { period: "16–22 nov", title: "Organização do Estado", topics: [
    topic("COMUM", "Português", "Crase."),
    topic("PMPE", "História", "Guerra dos Mascates (1710), Revolução Pernambucana (1817) e Confederação do Equador (1824)."),
    topic("COMUM", "Raciocínio Lógico", "Permutações, arranjos e combinações."),
    topic("COMUM", "Informática", "Windows 11: configurações, recursos do sistema, Painel de Controle e Prompt de Comando."),
    topic("COMUM", "Constitucional", "União, Estados, Municípios e Administração Pública: disposições gerais."),
    topic("PMPE", "Direitos Humanos", "Convenção Americana sobre Direitos Humanos: Pacto de San José da Costa Rica."),
    topic("PMPE", "Legislação", "Lei dos Crimes resultantes de Preconceito de Raça ou de Cor (Lei nº 7.716/1989)."),
    topic("PCPE AGENTE", "Processual Penal", "Investigação, inquérito policial e ação penal."),
  ] },
  { period: "23–29 nov", title: "Aplicação e competências", topics: [
    topic("COMUM", "Português", "Sintaxe da oração e do período; termos essenciais, integrantes e acessórios; coordenação e subordinação."),
    topic("PMPE", "História", "Guerra dos Cabanos (1835) e Revolução Praieira (1848)."),
    topic("COMUM", "Raciocínio Lógico", "Probabilidade."),
    topic("COMUM", "Informática", "Microsoft Office 2019 e LibreOffice 7: edição, formatação e recursos básicos de documentos."),
    topic("COMUM", "Constitucional", "Servidores públicos e militares dos Estados, do Distrito Federal e dos Territórios."),
    topic("PMPE", "Direitos Humanos", "Revisão da teoria geral, gerações, tratados e instrumentos internacionais."),
    topic("PMPE", "Legislação", "Lei de Crimes Ambientais (Lei nº 9.605/1998)."),
    topic("PCPE AGENTE", "Penal e Processo Penal", "Questões de aplicação da lei penal e procedimentos investigativos."),
  ] },
  { period: "30 nov–6 dez", title: "Ferramentas e leis", topics: [
    topic("COMUM", "Português", "Funções do “que” e do “se”; mecanismos de coesão textual."),
    topic("PMPE", "História", "Pernambuco durante o período republicano."),
    topic("COMUM", "Informática", "Excel, Calc, PowerPoint e Impress: fórmulas, funções, gráficos, tabelas e exportação."),
    topic("COMUM", "Constitucional", "Poder Legislativo, Executivo e Judiciário; Funções Essenciais à Justiça."),
    topic("PMPE", "Direitos Humanos", "Questões sobre a Declaração Universal e o Pacto de San José."),
    topic("PMPE", "Legislação", "Lei dos Crimes Hediondos (Lei nº 8.072/1990) e Lei de Drogas (Lei nº 11.343/2006)."),
    topic("COMUM", "Português · reforço", "Questões acumuladas de sintaxe, coesão e interpretação."),
    topic("PCPE AGENTE", "Contabilidade", "Patrimônio, contas, lançamentos e escrituração."),
  ] },
  { period: "7–13 dez", title: "Fechamento de grupos", topics: [
    topic("COMUM", "Português", "Pontuação; concordância nominal e verbal."),
    topic("PMPE", "História", "Frevo, maracatu, culinária, festas populares e aspectos afro-brasileiros em Pernambuco."),
    topic("COMUM", "Informática", "Revisão de internet, segurança, backup, Windows, Office e LibreOffice."),
    topic("COMUM", "Constitucional", "Defesa do Estado e instituições democráticas; súmulas, jurisprudência dominante e legislação relacionada."),
    topic("PMPE", "Direitos Humanos", "Questões de revisão dos tópicos do edital."),
    topic("PMPE", "Legislação", "Estatuto dos Policiais Militares de Pernambuco (Lei Estadual nº 6.783/1974)."),
    topic("PCPE AGENTE", "Estatística", "Estatística descritiva, análise exploratória, tabelas e gráficos."),
  ] },
  { period: "14–20 dez", title: "Consolidação", topics: [
    topic("COMUM", "Português", "Regência nominal e verbal; colocação pronominal."),
    topic("PMPE", "História", "Revisão dos movimentos históricos e da cronologia de Pernambuco."),
    topic("COMUM", "Raciocínio Lógico", "Revisão de estruturas lógicas, argumentação, diagramas e contagem."),
    topic("COMUM", "Informática", "Questões mistas, com foco nos assuntos de menor aproveitamento."),
    topic("COMUM", "Constitucional", "Revisão de direitos fundamentais, organização do Estado e dos Poderes."),
    topic("PMPE", "Direitos Humanos", "Revisão de legislação e tratados."),
    topic("PMPE", "Legislação", "Estatuto da Pessoa Idosa (Lei nº 10.741/2003) e Estatuto da Juventude (Lei nº 12.852/2013)."),
    topic("PCPE AGENTE", "Informática", "Windows, Microsoft 365, internet e segurança da informação."),
  ] },
  { period: "21–27 dez", title: "Conclusão dos tópicos", topics: [
    topic("COMUM", "Português", "Formação de palavras, significação das palavras e variação linguística."),
    topic("PMPE", "História", "Questões de todo o conteúdo histórico e cultural."),
    topic("COMUM", "Raciocínio Lógico", "Bateria de exercícios dos tópicos do edital."),
    topic("COMUM", "Informática", "Simulado específico e revisão de erros."),
    topic("COMUM", "Constitucional", "Questões de todos os tópicos, incluindo jurisprudência e súmulas relacionadas."),
    topic("PMPE", "Direitos Humanos + Legislação", "Súmulas, jurisprudência e legislação relacionada aos temas, conforme o edital."),
    topic("PCPE AGENTE", "Discursiva", "Redigir e corrigir texto sobre tema atual de segurança pública."),
  ] },
  { period: "28 dez–3 jan", title: "Revisão integral", topics: [
    topic("COMUM", "Português + História", "Revisão completa e questões dos tópicos estudados."),
    topic("COMUM", "Raciocínio Lógico + Informática", "Revisão completa e bateria de questões."),
    topic("COMUM", "Constitucional", "Revisão integral e questões dos assuntos com menor aproveitamento."),
    topic("PMPE", "Direitos Humanos + Legislação", "Revisão integral das leis e instrumentos do edital."),
    topic("COMUM", "Questões", "Questões mistas cronometradas; classifique os erros recorrentes."),
    topic("PMPE", "Redação", "Produzir um texto completo e revisar estrutura, argumentação e gramática."),
    topic("PCPE AGENTE", "Simulado", "Questões das matérias específicas e treino da prova discursiva."),
  ] },
  { period: "4–10 jan", title: "Ajuste final do ciclo de 12 semanas", topics: [
    topic("COMUM", "Segunda a sábado", "Revisões direcionadas, leitura dos pontos de lei esquecidos e questões dos assuntos com menor percentual de acertos."),
    topic("PMPE", "Domingo", "Simulado completo com 60 questões, tempo controlado e redação de treino."),
    topic("COMUM", "Pós-simulado", "Classifique erros por matéria e monte a lista de revisão final."),
    topic("PCPE AGENTE", "Revisão", "Revisar legislação estadual, Administrativo, Penal, Processo Penal, Contabilidade e Estatística."),
  ] },
  { period: "11–17 jan", title: "Extensão · revisão dirigida", topics: [
    topic("COMUM", "Base compartilhada", "Revisão espaçada D+1, D+7 e D+30; priorize erros recorrentes."),
    topic("PMPE", "Prova objetiva", "Questões cronometradas de Português, História, Raciocínio, Informática e Constitucional."),
    topic("PMPE", "Redação + TAF", "Uma redação completa e continuidade dos treinos físicos."),
    topic("PCPE AGENTE", "Específicas", "Rodada de questões de legislação estadual, Administrativo e Penal."),
  ] },
  { period: "18–24 jan", title: "Extensão · simulados", topics: [
    topic("COMUM", "Simulado integrado", "Corrija por assunto e registre taxa de acerto."),
    topic("PMPE", "Simulado completo", "60 questões objetivas e redação de 40 pontos."),
    topic("PMPE", "Revisão", "Retome os três assuntos com pior desempenho."),
    topic("PCPE AGENTE", "Discursiva", "Treino de texto e revisão de Contabilidade e Estatística."),
  ] },
  { period: "25–31 jan", title: "Extensão · pontos fracos", topics: [
    topic("COMUM", "Caderno de erros", "Revisar regras, conceitos e dispositivos legais que geraram erro."),
    topic("PMPE", "História + legislação", "Questões sobre cronologia, cultura e leis do edital."),
    topic("PMPE", "Redação + TAF", "Redação cronometrada e treino físico com recuperação adequada."),
    topic("PCPE AGENTE", "Específicas", "Questões de Direito Administrativo, Penal e Processual Penal."),
  ] },
  { period: "1–7 fev", title: "Extensão · revisão final PMPE", topics: [
    topic("COMUM", "Revisão final", "Português, Raciocínio, Informática e Constitucional."),
    topic("PMPE", "Simulados", "Dois simulados parciais e correção detalhada."),
    topic("PMPE", "Redação + TAF", "Redação cronometrada e preparação física específica."),
    topic("PCPE AGENTE", "Manutenção", "Um simulado curto e revisão das leis estaduais."),
  ] },
  { period: "8–14 fev", title: "Extensão · desaceleração", topics: [
    topic("COMUM", "Caderno de erros", "Revisar os tópicos de maior incidência e menor aproveitamento."),
    topic("PMPE", "Último simulado", "Realizar até 14/02; depois reduzir o volume e preservar descanso."),
    topic("PMPE", "Redação", "Revisão de estrutura, argumentação e gramática."),
    topic("PCPE AGENTE", "Manutenção leve", "Manter contato com as matérias específicas sem tirar prioridade da PMPE."),
  ] },
  { period: "15–21 fev", title: "Prova PMPE", topics: [
    topic("COMUM", "Revisões curtas", "Sono regular, revisão leve e descanso na véspera."),
    topic("PMPE", "Prova", "Prova de Soldado PMPE prevista para 21/02/2027."),
    topic("PCPE AGENTE", "Manutenção", "Retomar o foco PCPE após a prova PMPE."),
  ] },
  { period: "22–28 fev", title: "Foco PCPE Agente", topics: [
    topic("COMUM", "Questões Cebraspe", "Português, Raciocínio, Informática e Constitucional."),
    topic("PCPE AGENTE", "Direito", "Legislação estadual, Administrativo, Penal e Processual Penal."),
    topic("PCPE AGENTE", "Específicas", "Contabilidade Geral, Estatística e treino discursivo."),
  ] },
  { period: "1–7 mar", title: "Prova PCPE Agente", topics: [
    topic("COMUM", "Revisão final", "Tópicos comuns e caderno de erros; revisão leve na véspera."),
    topic("PCPE AGENTE", "Simulado", "Último simulado e revisão dos assuntos mais errados."),
    topic("PCPE AGENTE", "Prova", "Prova de Agente prevista para 07/03/2027, no período da tarde."),
  ] },
];

export const revisionIntervals = [
  { interval: "D+1 · dia seguinte", duration: "10 min", activity: "Recorde conceitos sem consulta e confira os erros." },
  { interval: "D+7 · uma semana", duration: "15 min", activity: "Resolva questões do assunto e revise o que errou." },
  { interval: "D+30 · um mês", duration: "20 min", activity: "Faça um teste sem consulta e avalie a retenção." },
];

export const questionGoals = [
  { subject: "Português", count: "15–20" },
  { subject: "História de Pernambuco", count: "15–20" },
  { subject: "Raciocínio Lógico", count: "10–15" },
  { subject: "Informática", count: "15–20" },
  { subject: "Direito Constitucional", count: "15–20" },
  { subject: "Direitos Humanos + Legislação", count: "15–20" },
];
