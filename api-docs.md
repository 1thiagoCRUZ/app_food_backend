# 📚 App Food - Documentação da API

Esta documentação detalha todas as rotas disponíveis na aplicação, seus propósitos e quem tem permissão de acessá-las. A API segue os princípios RESTful e utiliza JWT para autenticação.

## 🔐 Níveis de Acesso (Roles)
- **`CUSTOMER`**: Cliente final (quem pede comida).
- **`RESTAURANT`**: Dono do restaurante (quem prepara a comida).
- **`COURIER`**: Entregador (motoboy, quem faz o delivery).
- **`ADMIN`**: Administrador da plataforma (suporte e manutenção).

> [!NOTE]
> Todas as rotas (exceto as de registro, login e webhooks) exigem que o cabeçalho `Authorization: Bearer <TOKEN>` seja enviado.

## 🛡️ Tratamento de Erros e Segurança
A API segue padrões de segurança rigorosos para ambientes de produção:
- **Erros de Validação (400 Bad Request)**: Retornam de forma nativa e em inglês o motivo exato (ex: `["cpf must be a valid CPF"]`), ideal para o App/Front-end tratar e exibir para o usuário.
- **Erros Internos (500 Internal Server Error)**: Falhas de banco de dados, falhas de conexão com AWS S3, ou exceções não tratadas são **mascaradas** de forma proposital. A API sempre responderá com uma mensagem genérica `{"message": "Internal server error"}` para evitar vazamento de arquitetura ou dados sensíveis.

---

## 🧑‍💼 Módulo de Usuários (`/users`)
Gerencia o ciclo de vida, autenticação e endereços de qualquer pessoa no sistema (Cliente, Entregador, Restaurante ou Admin).

| Método | Rota | Descrição | Quem Usa? |
| :--- | :--- | :--- | :--- |
| **POST** | `/users/register` | Cria uma nova conta no sistema. Aceita upload binário de foto (multipart/form-data). | Público |
| **POST** | `/users/login` | Autentica um usuário usando Email e Senha. Retorna o Token JWT. | Público |
| **GET** | `/users` | Lista todos os usuários cadastrados na plataforma. | `ADMIN` |
| **GET** | `/users/me` | Retorna o perfil completo do usuário que está logado (usando o Token). | Qualquer Logado |
| **GET** | `/users/:id` | Retorna o perfil de um usuário específico por ID (inclui endereços). | Qualquer Logado |
| **PUT** | `/users/:id` | Atualiza dados do perfil (Nome, Telefone, foto via multipart/form-data). | Próprio Usuário |
| **DELETE** | `/users/:id` | Deleta permanentemente a conta de um usuário. | Próprio ou `ADMIN` |
| **POST** | `/users/me/addresses` | Adiciona um novo endereço de entrega na conta do cliente logado. | `CUSTOMER` |
| **GET** | `/users/me/addresses` | Lista os endereços salvos do cliente logado. | `CUSTOMER` |

---

## 🏪 Módulo de Restaurantes (`/restaurants`)
Gerencia os estabelecimentos parceiros e o status operacional deles.

| Método | Rota | Descrição | Quem Usa? |
| :--- | :--- | :--- | :--- |
| **POST** | `/restaurants` | Cadastra um novo Restaurante atrelando-o ao usuário logado (Dono). | `RESTAURANT` |
| **GET** | `/restaurants` | Lista restaurantes disponíveis (Vitrine do App). Pode filtrar por abertos. | `CUSTOMER` |
| **GET** | `/restaurants/my` | Retorna o painel do restaurante pertencente ao dono logado. | `RESTAURANT` |
| **PUT** | `/restaurants/:id` | Atualiza dados do restaurante (Nome, CNPJ) e Foto (multipart/form-data). | Dono ou `ADMIN` |
| **DELETE** | `/restaurants/:id` | Remove o restaurante da plataforma. | Dono ou `ADMIN` |
| **PATCH** | `/restaurants/:id/status` | Abre ou fecha o restaurante (`isOpen: boolean`). | Dono |
| **POST** | `/restaurants/:id/addresses`| Adiciona ou define o endereço físico do restaurante. | Dono |
| **GET** | `/restaurants/:id/addresses` | Lista endereços/filiais do restaurante. | Qualquer Logado |

---

## 🍔 Módulo de Catálogo (`/catalog`)
Gerencia o cardápio e o estoque de produtos dos restaurantes.

| Método | Rota | Descrição | Quem Usa? |
| :--- | :--- | :--- | :--- |
| **POST** | `/catalog` | Cria um novo produto (ex: Hambúrguer, Bebida) para o restaurante. Aceita foto nativa (multipart). | `RESTAURANT` |
| **GET** | `/catalog` | Lista produtos. Pode passar `?restaurantId=1` para listar o cardápio. | Público |
| **PUT** | `/catalog/:id` | Atualiza preço, foto, nome, disponibilidade e estoque do produto. | Dono do Restaurante |
| **DELETE** | `/catalog/:id` | Remove um produto do cardápio. | Dono do Restaurante |

---

## 🎟️ Módulo de Cupons (`/coupons`)
Gerencia descontos e campanhas promocionais atreladas a restaurantes.

| Método | Rota | Descrição | Quem Usa? |
| :--- | :--- | :--- | :--- |
| **POST** | `/coupons` | Cria um novo cupom de desconto (fixo ou porcentagem). | `RESTAURANT` |
| **GET** | `/coupons` | Lista cupons disponíveis de um restaurante. | `CUSTOMER` |
| **PUT** | `/coupons/:id` | Atualiza regras do cupom (validade, valor). | Dono do Restaurante |
| **DELETE** | `/coupons/:id` | Desativa ou deleta o cupom. | Dono do Restaurante |

---

## 📦 Módulo de Pedidos (`/orders`)
Coração do sistema. Conecta o Cliente, o Restaurante e o Entregador, aplicando regras de estoque, fraude e faturamento.

| Método | Rota | Descrição | Quem Usa? |
| :--- | :--- | :--- | :--- |
| **POST** | `/orders` | Cria o pedido, recalcula preços com base no banco, debita o estoque e gera códigos de verificação (Pickup/Delivery). | `CUSTOMER` |
| **GET** | `/orders` | Lista os meus pedidos (Se for Cliente mostra os que eu pedi, se for dono mostra os que meu restaurante recebeu). | `CUSTOMER` / `RESTAURANT` |
| **GET** | `/orders/:id` | Retorna todos os detalhes do pedido, itens e endereços. | Envolvidos no Pedido |
| **PATCH** | `/orders/:id/cancel` | Cancela o pedido (Apenas se o restaurante ainda não despachou) e devolve produtos pro estoque. | `CUSTOMER` / `RESTAURANT` |
| **GET** | `/orders/available` | Radar do Entregador: Lista pedidos prontos aguardando motoboy. | `COURIER` |
| **GET** | `/orders/courier/my` | Lista o histórico de entregas do motoboy logado. | `COURIER` |
| **PATCH** | `/orders/:id/ready` | Restaurante marca que a comida está pronta na bancada. | `RESTAURANT` |
| **PATCH** | `/orders/:id/accept` | Motoboy aceita a corrida no App (Muda status para IN_TRANSIT). | `COURIER` |
| **PATCH** | `/orders/:id/pickup` | Motoboy informa o PIN do garçom e retira a sacola. | `COURIER` |
| **PATCH** | `/orders/:id/deliver` | Motoboy informa o PIN do Cliente e finaliza a entrega na porta. | `COURIER` |

---

## 🛵 Módulo de Delivery (`/couriers`)
Gerencia especificamente os metadados dos Entregadores.

| Método | Rota | Descrição | Quem Usa? |
| :--- | :--- | :--- | :--- |
| **PATCH** | `/couriers/me/status` | Motoboy fica Online para receber chamados ou Offline. | `COURIER` |
| **GET** | `/couriers` | Lista entregadores e o status operacional deles. | `ADMIN` / `RESTAURANT` |

---

## 💳 Módulo de Pagamentos (`/payments`)
Integração com gateways externos de pagamento (Stripe/MercadoPago).

| Método | Rota | Descrição | Quem Usa? |
| :--- | :--- | :--- | :--- |
| **POST** | `/payments/checkout` | Inicia fluxo de pagamento do pedido e devolve URL do Gateway. | `CUSTOMER` |
| **POST** | `/payments/webhook` | Rota cega (secreta) para a plataforma de pagamento confirmar se o cartão passou. | Plataforma Externa |

---

## 📡 Módulo de Comunicação (WebSocket)
Conexões de tempo real na rota base `ws://localhost:3000`.

| Evento | Direção | Descrição | Quem Usa? |
| :--- | :--- | :--- | :--- |
| `joinOrderRoom` | Cliente ➡️ Servidor | Informa o servidor em qual pedido você está focado. | Cliente / Entregador |
| `joinedRoom` | Servidor ➡️ Cliente | Confirma a conexão na sala segura do pedido. | Servidor |
| `sendLocation` | Entregador ➡️ Servidor | App do motoboy dispara as coordenadas de GPS. | `COURIER` |
| `locationUpdate` | Servidor ➡️ Sala | Servidor rebate o GPS do motoboy para mostrar no mapa do App do Cliente. | Cliente |
