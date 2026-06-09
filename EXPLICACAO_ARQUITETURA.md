# Explicação do Projeto - Food App Backend

Este documento explica a estrutura e o código do sistema de Delivery. O backend foi dividido usando os princípios de Domain-Driven Design (DDD) e Arquitetura Hexagonal, com módulos isolados e independentes.

---

## 1. Contextos da Aplicação (`src/contexts/`)

Aqui ficam as regras de negócios específicas de cada área do app. Como solicitado, aqui está a explicação genérica dos módulos (Bounded Contexts):

- **`users/` (Usuários e Autenticação):**
  - Gerencia o login (JWT) e o registro de todos que entram na plataforma.
  - Guarda a regra de *Roles* (Admin, Cliente, Motoboy e Lojista), garantindo que ninguém acesse rotas proibidas.
- **`restaurants/` (Restaurantes):**
  - Controla o catálogo (produtos, categorias), o status do restaurante (Aberto/Fechado) e os dados do Lojista.
  - Todas as validações garantem que um Lojista só possa alterar seu próprio menu e perfil.
- **`orders/` (Pedidos):**
  - É o "Coração do Sistema".
  - Mantém a Máquina de Estados das Entidades (PENDENTE, PAGO, PREPARANDO, PRONTO_PARA_RETIRADA, EM_TRANSITO, ENTREGUE).
  - Centraliza a dupla verificação de segurança: os códigos de retirada do balcão e de entrega no cliente.
- **`delivery/` (Entregas e Entregadores):**
  - Gerencia a mochila virtual do motoboy, se ele está online ou offline e o repasse financeiro de cada viagem concluída.
- **`payments/` (Pagamentos):**
  - Lida com integrações bancárias (ex: Mercado Pago).
  - Opera por meio de webhooks de forma isolada, não misturando faturamento direto na tabela do pedido.
- **`communications/` (Comunicações):**
  - Módulo preparado para disparar E-mails, SMS, ou Push Notifications para manter clientes informados dos status dos seus pedidos.

---

## 2. Módulo Compartilhado (`src/shared/`)

A pasta `shared` (compartilhado) contém tudo aquilo que pode ser usado por **qualquer módulo** do sistema. Coisas como banco de dados, conexão com APIs externas (Google Maps, AWS S3), configurações de ambiente e os contratos (Ports).
Abaixo, a explicação **linha a linha** de cada arquivo:

### `src/shared/adapters/google-maps.adapter.ts`
Conecta nossa aplicação na API real do Google Maps, ou simula coordenadas caso não tenha uma chave configurada.
- **Linha 1-4:** Importamos as dependências do NestJS (Injeção e Logs), módulo de config e a SDK oficial do Google Maps, além de nossos tipos (Interfaces) do `geo-coding.port.ts`.
- **Linha 5-6:** Decorador `@Injectable()` que diz pro NestJS que isso é um provedor, declarando que essa classe assina o contrato de `GeoCodingPort`.
- **Linha 7-10:** Definimos as variáveis internas da classe (o gerador de loggers, o cliente do google, a apiKey e uma flag pra saber se tá simulando a distância).
- **Linha 11-25 (Constructor):** Inicializamos a classe. Ele tenta pegar a chave `GOOGLE_MAPS_API_KEY` do arquivo `.env`. Se a chave for inválida ou genérica (ex: `sua_chave`), ele entra no modo Simulado, senão ele instancia a SDK oficial do Google.
- **Linha 26-54 (geocodeAddress):** Método que transforma um endereço por extenso (ex: "Av Paulista 100") em coordenadas geográficas (Latitude e Longitude). Se for simulado, ele gera números aleatórios. Se for real, chama a API do google passando o idioma `pt-BR` e tenta retornar o `lat` e `lng`. Se der erro na requisição externa, captura (catch) e avisa no logger.
- **Linha 55-89 (calculateRoute):** Método que recebe um ponto A (lat/lng) e um ponto B (lat/lng). Se estiver simulado, ele faz uma conta matemática com o Teorema de Pitágoras ignorando as ruas (linha reta) pra calcular uma estimativa de KM e de tempo de rota, ótimo para desenvolvimento local. Se tiver chave real, ele consulta a rota na API do Google Maps para ter a distância oficial por vias e o tempo com trânsito.

### `src/shared/adapters/s3-storage.adapter.ts`
Faz o envio (upload) de fotos de usuários e restaurantes para o armazenamento da AWS (Amazon S3).
- **Linha 1-4:** Importa serviços básicos, o Port de armazenamento, o SDK nativo da Amazon (`@aws-sdk/client-s3`) e o Serviço de Config.
- **Linha 6-10:** Declaração da classe e das variáveis que guardam o cliente S3 e o nome do bucket.
- **Linha 11-28 (Constructor):** Tenta buscar no `.env` a região da AWS, a Access Key, a Secret Key e o Bucket. Se faltar qualquer um desses 4, ele "crasha" o sistema (lança exceção InternalServerError). Se estiver tudo certo, constrói a instância do `S3Client` logando com essas credenciais.
- **Linha 30-46 (uploadFile):** O método que efetivamente salva arquivos. Ele pega os bytes da foto (`fileBuffer`), o nome original e o tipo dela, monta um pacote (comando) `PutObjectCommand` apontando pro bucket e o envia. No final da função, ele retorna a URL pública construída em texto, que é o link da foto que ficará salvo no nosso banco de dados.
- **Linha 48-56 (deleteFile):** Método que manda um comando `DeleteObjectCommand` para o S3 para apagar a foto antiga de um usuário/restaurante se ele fizer o upload de uma foto nova, economizando espaço em disco.

### `src/shared/config/env.validation.ts`
Proteção anti-burrada. Garante que ninguém tente ligar a API sem configurar o banco de dados antes.
- **Linha 1:** Declara uma função de validação (executada na inicialização do NestJS).
- **Linha 2-10:** Monta uma matriz contendo todas as strings que obrigatoriamente precisam existir dentro do arquivo `.env` (ex: `DB_HOST`, `DB_PASSWORD`, `JWT_SECRET`).
- **Linha 11:** Filtra a lista de cima cruzando com as variáveis globais que o Node processou (`process.env`). Retorna só as que estão faltando.
- **Linha 12-17:** Se achou alguma coisa faltando na lista de cima, ele interrompe o sistema imediatamente jogando um erro gigante na tela vermelha: *"Variáveis de ambiente obrigatórias não encontradas"*.
- **Linha 18-24:** Verifica as variáveis opcionais do Mercado Pago e do Google Maps. Se o dev configurou as chaves fictícias, ele não desliga a API, só imprime um aviso no console de log que as funcionalidades entraram em `MODO SIMULADO`.

### `src/shared/ports/geo-coding.port.ts`
É o "contrato" de GPS da aplicação. Serve para as regras de negócio não dependerem do Google Maps.
- **Linha 1-4:** Cria a "forminha" do tipo `GeoCoordinates` com `lat` e `lng`.
- **Linha 5-8:** Cria a "forminha" do tipo `RouteResult` com distância e duração.
- **Linha 9-12:** Cria a "Interface" (O Contrato). Obriga que qualquer adaptador geográfico tenha as funções `geocodeAddress` e `calculateRoute`.
- **Linha 13:** Exporta a string constante do nome do contrato para o container de injeção de dependências do NestJS.

### `src/shared/ports/storage.port.ts`
É o "contrato" de disco da aplicação. Serve para as regras de negócio não dependerem da AWS S3.
- **Linha 1:** Exporta a string constante do nome do contrato.
- **Linha 3-6:** Cria a Interface que exige a implementação dos métodos `uploadFile` (salvar um arquivo binário e retornar um link) e `deleteFile`. Se amanhã quisermos mudar da Amazon S3 pro Google Cloud Storage, é só criar uma classe que assine e cumpra esse contrato.

### `src/shared/typeorm/config/data-source.ts`
Faz a "ponte" que liga o banco de dados SQL (Postgres) ao backend sem precisarmos escrever query SQL na mão.
- **Linha 1-3:** Importações essenciais do TypeORM e funções nativas do sistema pra achar caminhos de pastas e ler variáveis `.env`.
- **Linha 5:** Executa a leitura do `.env` e sobe as variáveis na memória do Node.
- **Linha 7-18 (dataSourceOptions):** Cria as configurações completas de infraestrutura:
  - **L8-13:** Usa o Dialeto Postgres e pega todos os dados (host, port, senha) direto do `.env`, ou usa padrões se por algum motivo não achar.
  - **L14:** Pede pro TypeORM rastrear todos os arquivos que terminam com `.schema.ts` pelo projeto todo. Onde achar um `schema`, ele transforma em uma tabela de banco.
  - **L15:** Indica onde ficam gravadas as Migrations.
  - **L16:** O `synchronize: false` é por segurança: proíbe o TypeORM de apagar dados sozinho, obrigando a fazer atualizações usando Migrations!
  - **L17:** Ativa suporte SSL (Criptografia de rede) caso a API esteja em produção em plataformas que exigem isso, como a Render.
- **Linha 20:** Exporta uma instância final desse DataSource para o NestJS de fato ligar o motor na hora de inicializar.

### `src/shared/shared.module.ts`
Junta todas as peças acima pra compartilhar para os outros `contexts` usarem.
- **Linha 1-5:** Importa os adaptadores (Google e S3) e seus Ports (Contratos).
- **Linha 7-20:** Pega as ferramentas concretas (`GoogleMapsAdapter` e `S3StorageAdapter`) e registra no container de injeção dizendo: *"Se alguém no projeto pedir o contrato GEO_CODING_PORT, entregue um GoogleMapsAdapter para ele!"* e aí exporta esses registros (`exports`) pra qualquer Contexto que chame o módulo Shared ter acesso imediato às rotas do Google e upload de imagens S3.
