export const AREAS = [
  // ELEMENTAR
  {
    codigo: 'MAT', nome: 'Matemática', nivel: 'elementar', cor: '#3B82F6', icone: 'calculator',
    topicos: ['Aritmética e números', 'Frações e proporções', 'Álgebra básica', 'Equações', 'Geometria plana', 'Geometria espacial', 'Trigonometria', 'Funções', 'Estatística e probabilidade'],
  },
  {
    codigo: 'POR', nome: 'Português', nivel: 'elementar', cor: '#10B981', icone: 'book-open',
    topicos: ['Fonologia e ortografia', 'Morfologia', 'Sintaxe', 'Semântica', 'Interpretação de texto', 'Redação dissertativa', 'Literatura brasileira', 'Literatura portuguesa'],
  },
  {
    codigo: 'FIS', nome: 'Física', nivel: 'elementar', cor: '#F59E0B', icone: 'zap',
    topicos: ['Grandezas e medidas', 'Cinemática', 'Dinâmica (Leis de Newton)', 'Trabalho e energia', 'Termodinâmica', 'Eletrostática', 'Eletrodinâmica', 'Magnetismo', 'Óptica', 'Ondulatória'],
  },
  {
    codigo: 'QUI', nome: 'Química', nivel: 'elementar', cor: '#8B5CF6', icone: 'flask-conical',
    topicos: ['Matéria e energia', 'Tabela periódica', 'Ligações químicas', 'Estequiometria', 'Soluções', 'Termoquímica', 'Cinética química', 'Equilíbrio químico', 'Eletroquímica', 'Química orgânica'],
  },
  {
    codigo: 'BIO', nome: 'Biologia', nivel: 'elementar', cor: '#06B6D4', icone: 'dna',
    topicos: ['Citologia (célula)', 'Histologia', 'Fisiologia humana', 'Genética', 'Evolução', 'Ecologia', 'Reinos dos seres vivos', 'Biotecnologia'],
  },
  {
    codigo: 'HIS', nome: 'História', nivel: 'elementar', cor: '#EF4444', icone: 'landmark',
    topicos: ['Pré-história', 'Antiguidade', 'Idade Média', 'Idade Moderna', 'Colonização do Brasil', 'Revolução Industrial', 'Brasil Império', 'Brasil República', 'Guerras Mundiais', 'Guerra Fria', 'Brasil contemporâneo'],
  },
  {
    codigo: 'GEO', nome: 'Geografia', nivel: 'elementar', cor: '#84CC16', icone: 'globe',
    topicos: ['Cartografia', 'Relevo e hidrografia', 'Clima e vegetação', 'Geopolítica mundial', 'Brasil: regiões e estados', 'Urbanização', 'Globalização', 'Problemas ambientais'],
  },
  {
    codigo: 'FIL', nome: 'Filosofia', nivel: 'elementar', cor: '#F97316', icone: 'brain',
    topicos: ['O que é filosofia', 'Pré-socráticos', 'Sócrates, Platão, Aristóteles', 'Filosofia medieval', 'Filosofia moderna (Descartes, Kant, Hegel)', 'Filosofia contemporânea', 'Lógica e argumentação', 'Ética e moral', 'Política e sociedade', 'Epistemologia'],
  },
  {
    codigo: 'SOC', nome: 'Sociologia', nivel: 'elementar', cor: '#EC4899', icone: 'users',
    topicos: ['O que é sociologia', 'Durkheim, Marx, Weber', 'Cultura e identidade', 'Estratificação social', 'Estado e política', 'Movimentos sociais', 'Globalização e sociedade', 'Racismo e desigualdade'],
  },
  // AVANÇADO
  {
    codigo: 'TEC', nome: 'Tecnologia', nivel: 'avancado', cor: '#0EA5E9', icone: 'code-2',
    topicos: ['Fundamentos de programação', 'HTML/CSS/JS', 'Python', 'Banco de dados', 'APIs e backend', 'Cloud computing', 'IA e Machine Learning', 'Segurança da informação', 'Arquitetura de sistemas'],
  },
  {
    codigo: 'BUS', nome: 'Business', nivel: 'avancado', cor: '#D97706', icone: 'briefcase',
    topicos: ['Estratégia empresarial', 'Finanças pessoais', 'Contabilidade básica', 'Marketing e vendas', 'Gestão de pessoas', 'Empreendedorismo', 'Negociação', 'Economia básica'],
  },
  {
    codigo: 'IDI', nome: 'Idiomas', nivel: 'avancado', cor: '#7C3AED', icone: 'languages',
    topicos: ['Inglês: gramática', 'Inglês: vocabulário', 'Inglês: conversação', 'Inglês: escrita', 'Espanhol: base', 'Leitura em inglês (técnico)', 'Listening e pronúncia'],
  },
  {
    codigo: 'CAR', nome: 'Carreira', nivel: 'avancado', cor: '#059669', icone: 'trending-up',
    topicos: ['Comunicação escrita', 'Apresentações', 'Liderança', 'Gestão de tempo', 'Aprendizado acelerado (meta)', 'Networking', 'Marca pessoal', 'Tomada de decisão'],
  },
  {
    codigo: 'HOB', nome: 'Hobbies', nivel: 'avancado', cor: '#DB2777', icone: 'star',
    topicos: [],
  },
] as const

export type AreaSeed = (typeof AREAS)[number]
