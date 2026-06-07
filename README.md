# 🍔 App Food - Enterprise Backend Architecture

Este repositório é a base do **App Food**, um ecossistema de delivery robusto projetado para alta escalabilidade e manutenibilidade. Diferente de projetos comuns em MVC, este backend foi estruturado seguindo rigorosamente princípios de **Domain-Driven Design (DDD)** e **Arquitetura Hexagonal (Ports & Adapters)**.

O objetivo desta documentação é servir como um **Guia de Estudos Avançado** sobre a engenharia de software aplicada no projeto.

---

## 🏗️ 1. Padrões Arquiteturais Adotados

### 1.1. Arquitetura Hexagonal (Ports & Adapters)
O objetivo principal da Arquitetura Hexagonal é **isolar a regra de negócio (Domínio)** de agentes externos (Banco de Dados, Frameworks web, APIs de terceiros). 
No App Food, o Domínio não sabe que estamos usando NestJS ou PostgreSQL. Toda a comunicação com o mundo externo é feita através de **Ports** (Interfaces) e **Adapters** (Implementações concretas).

### 1.2. Domain-Driven Design (DDD)
Aplicamos os seguintes conceitos de DDD para proteger as invariantes de negócio:
- **Bounded Contexts (Contextos Delimitados):** O sistema não é um monólito misturado. Ele é dividido em Módulos independentes (`Users`, `Restaurants`, `Catalog`, `Orders`).
- **Entities (Entidades):** Objetos de negócio que possuem identidade única (ID) e estado mutável através de métodos seguros, não através de setters anêmicos.
- **Value Objects (Objetos de Valor):** Tipos primitivos encapsulados que se autovalidam. Exemplo: A classe `CPF` não é uma string; ela possui lógica interna no construtor que lança exceção se o cálculo do dígito verificador for inválido.

---

## 📂 2. Estrutura de Diretórios (Por Contexto)

Dentro de `src/contexts/`, cada módulo de negócio obedece exatamente à mesma topologia de 4 camadas:

```text
src/contexts/<nome-do-modulo>/
├── domain/            # 1. CORE: Regras puras. Sem dependências externas.
│   ├── entities/      # Classes ricas (Ex: Order, User).
│   ├── exceptions/    # Erros de domínio (Ex: InvalidCpfException).
│   └── value-objects/ # Tipos base (Ex: CpfVO, CnpjVO).
│
├── application/       # 2. ORQUESTRADOR: Casos de Uso.
│   ├── ports/         # Interfaces que a infraestrutura DEVE implementar.
│   ├── use-cases/     # Lógicas como CreateOrderUseCase, AcceptOrderUseCase.
│   └── *.facade.ts    # Padrão Facade que agrupa casos de uso para o Controller.
│
├── infrastructure/    # 3. EXTERNO: Adapters para o mundo real.
│   ├── database/      # TypeORM Schemas e Repositórios concretos.
│   └── providers/     # Integrações (Ex: BcryptHashProvider).
│
└── presentation/      # 4. ENTRADA: Interface de comunicação (HTTP).
    ├── controllers/   # Recebe as chamadas REST (NestJS Controllers).
    └── dtos/          # Data Transfer Objects com class-validator (@IsString).
```

### Regra de Dependência
A camada `domain` **nunca** importa nada das outras. A `application` só conhece o `domain`. A `infrastructure` e `presentation` enxergam a `application` e o `domain`. **A Inversão de Dependência (SOLID)** garante esse isolamento.

---

## 🧩 3. Bounded Contexts (Os Módulos de Negócio)

### 👤 3.1. Users (Usuários e Autenticação)
Responsável por Identidade, Segurança e Localização do consumidor.
- **Domínio:** `User` e `Address`. Usa Value Objects de `CPF` e `Email`.
- **Autenticação:** Possui JWT nativo do NestJS (`@nestjs/jwt`) com estratégias do Passport. A encriptação de senha é feita injetando a Port `HashProviderPort` cuja implementação concreta vive na infraestrutura (`BcryptHashProvider`).
- **Lógica:** Gerencia perfis. Possui métodos de login, onde retorna o DTO contendo o token de sessão e `role` (`CUSTOMER`, `RESTAURANT`, `DELIVERY`).

### 🏪 3.2. Restaurants (Lojistas)
Ecossistema focado no vendedor.
- **Domínio:** `Restaurant` e `Coupon`. Usa o VO `CNPJ`.
- **Cupons:** Gerencia cupons transacionais. Um cupom possui `limit` (limite global de uso), `expiresAt` (data limite), `min` (compra mínima), e `type` (percentual ou fixo).

### 📦 3.3. Catalog (Catálogo)
Vitrine de vendas do restaurante.
- **Domínio:** `Product`.
- **Regras:** Controla o `stock` (estoque físico) e a flag `available` (se o restaurante desativou o produto temporariamente, por exemplo, o pão acabou).

### 🛵 3.4. Orders (O Coração da Aplicação)
Integra Usuários, Catálogo e Restaurantes. **Foi arquitetado para impedir fraudes.**

#### A. Trava Antifraude na Criação
No `POST /orders`, a camada de Facade não confia no carrinho vindo do app.
1. Percorre o array de produtos da requisição.
2. Faz query no Banco do `Catalog` pelo `productId`.
3. **Validação de Estoque:** `if (product.stock < requestedQuantity)` -> Lança Erro.
4. **Validação de Preço:** Substitui forçadamente o preço do JSON pelo `product.price` do banco para evitar "inspecionar elemento".
5. **Dedução Atômica:** Executa `product.stock -= quantity` salvando no ato.

#### B. Mecânica de Aplicação de Cupons
Se o DTO trouxer `couponCode`:
- Busca no banco e realiza um pipeline de Ifs: Está ativo? Pertence ao restaurante? Expirou? Atingiu o teto de usos? O subtotal da comida atinge o valor mínimo?
- Só então calcula o `discount` e debita da variável `total`, gravando ambos separadamente no Banco de Dados para auditoria. Ao final, executa `coupon.uses += 1`.

#### C. Snapshot de Pedido (Pattern de Imutabilidade)
O TypeORM não faz um mero `@ManyToOne` entre Pedido e Cliente no momento do faturamento. O código **Copia (Snapshot)** os valores atuais do `CustomerName`, `CustomerPhone` e o `DeliveryAddress` inteiro e salva nas colunas de texto da tabela `Orders`.
- **Motivo Técnico:** Se um cliente trocar de nome ou deletar o endereço 1 ano depois, o recibo do pedido continuará imaculado com os dados daquele momento exato.

#### D. Estorno e Cancelamento (`PATCH /orders/:id/cancel`)
Bloqueia tentativas caso a comida já tenha saído (`IN_TRANSIT`). Se cancelado, aciona o fluxo inverso: mapeia os itens do pedido, vai na tabela de `Products` e devolve a quantidade para o estoque (`product.stock += quantity`).

---

## 🔒 4. O Módulo Compartilhado (`/shared`)

Tudo que é transversal à aplicação, ou seja, que pode ser usado por vários módulos, reside aqui.

- **Decorators (`@CurrentUser`):** Um Parameter Decorator avançado do NestJS. Ele intercepta o objeto HTTP Request criado pelo JWT Guard e extrai metadados da sessão (ex: `@CurrentUser('userId')`). Isso limpa os Controllers, evitando boilerplate de `req.user`.
- **TypeORM Configuration:** Configurações de conexão baseadas no `DataSource` para garantir que CLI e App bebam da mesma fonte.
- **Migrations:** Controle de versão do esquema de dados. Como o `synchronize` é `false` (padrão de empresa), qualquer alteração no `@Column()` das entidades exige a geração de um arquivo de migração para rastreabilidade de DDL (Data Definition Language).

---

## 🛵 5. Máquina de Estados de Entrega (PIN Security)

O sistema lida com o ciclo de vida da logística usando um controle de transição de estado rígido aliado a senhas transacionais.

**Fluxograma:**
1. `PENDING` -> Criado, aguardando validações financeiras.
2. `PREPARING` -> Restaurante visualiza e clica em preparar.
3. `READY_FOR_PICKUP` -> Dispara no Radar do Entregador. Apenas entregadores ociosos veem.
4. Entregador aceita (`PATCH /orders/:id/accept`) -> A API atrela o `courierId` e some do radar dos demais motoboys.
5. `IN_TRANSIT` -> Exige verificação dupla. O Restaurante passa o **Pickup PIN** (4 dígitos gerados na criação da ordem) para o Entregador digitar no app. Isso formaliza a passagem de posse do pacote e evita roubos.
6. `DELIVERED` -> Exige o **Delivery PIN**. O Cliente dita os dígitos finais para o Entregador, carimbando o recebimento oficial.

---

## 📚 6. Ferramental e Scripts

**1. Dependências Base**
```bash
npm install
```

**2. Ambiente Local (Desenvolvimento)**
```bash
# Inicia a API na porta 3000 escutando mudanças nos arquivos TS
npm run start:dev
```

**3. Migrations (Controle de Banco)**
```bash
# Lê as Entidades TypeORM vs Banco e cria um arquivo .ts com os comandos ALTER TABLE
npm run migration:generate --name=AddNovaColuna

# Aplica no banco de dados (equivalente a Commitar as mudanças)
npm run migration:run
```

**4. Build de Produção**
```bash
# Compila tudo para /dist ignorando arquivos de teste e types
npm run build
```

**5. Swagger Docs**
Acesse `http://localhost:3000/api` para ler as anotações completas de cada endpoint, testar proteções Bearer Token e debugar respostas de DTOs via Open API.
