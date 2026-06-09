# 📚 App Food - Documentação Completa da API

Esta documentação detalha **absolutamente todos** os métodos disponíveis na aplicação, seus propósitos, níveis de permissão exigidos e os dados (Payloads) necessários para cada requisição. A API segue os princípios RESTful e utiliza JWT para autenticação.

## 🔐 Níveis de Acesso (Roles)
- **`CUSTOMER`**: Cliente final (quem pede comida).
- **`RESTAURANT`**: Dono do restaurante (quem prepara a comida).
- **`COURIER`**: Entregador (motoboy, quem faz o delivery).
- **`ADMIN`**: Administrador da plataforma (suporte e manutenção).

> [!IMPORTANT]
> Todas as rotas (exceto `/users/register`, `/users/login`, e `/payments/webhook`) exigem o cabeçalho de autenticação:
> `Authorization: Bearer <SEU_TOKEN_JWT>`

## 🛡️ Tratamento de Erros
- **Erros de Validação (400 Bad Request)**: Retornam de forma nativa e em inglês o motivo exato.
  ```json
  { "statusCode": 400, "message": ["cpf must be a valid CPF"], "error": "Bad Request" }
  ```
- **Erros Internos (500 Internal Server Error)**: Falhas graves são mascaradas como `{"message": "Internal server error"}` para segurança.

---

## 🧑‍💼 Módulo de Usuários (`/users`)
Gerencia o ciclo de vida, autenticação e endereços de clientes, entregadores e donos de restaurantes.

### `POST /users/register`
- **O que faz:** Cria uma conta nova no sistema.
- **Quem acessa:** Público (Sem token).
- **Como funciona:** Recebe os dados de formulário. Cria o usuário e, se houver foto, faz o upload para a Amazon S3.
- **Payload (`multipart/form-data`):**
  - `name` (string, obrigatório)
  - `email` (string, obrigatório)
  - `password` (string, mín 8 chars)
  - `cpf` (string, formato XXX.XXX.XXX-XX)
  - `phone` (string, 10 ou 11 dígitos, opcional)
  - `role` (string, CUSTOMER, RESTAURANT ou COURIER)
  - `photo` (Arquivo Binário, Imagem, opcional)

### `POST /users/login`
- **O que faz:** Autentica o usuário e devolve o Token JWT.
- **Quem acessa:** Público.
- **Payload (`application/json`):**
  ```json
  { "email": "joao@teste.com", "password": "senha" }
  ```

### `GET /users/me`
- **O que faz:** Retorna todos os dados da pessoa logada.
- **Quem acessa:** Qualquer usuário logado.
- **Payload:** Nenhum (Lê pelo Token JWT).

### `PUT /users/:id`
- **O que faz:** Atualiza os dados da conta (ex: trocar telefone, atualizar foto).
- **Quem acessa:** Próprio Usuário logado.
- **Payload (`multipart/form-data`):**
  - Qualquer campo opcional (`name`, `phone`, `photo`).

### `POST /users/me/addresses`
- **O que faz:** Salva um endereço de entrega para o cliente.
- **Quem acessa:** `CUSTOMER`.
- **Payload (`application/json`):**
  ```json
  {
    "street": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01001-000",
    "isDefault": true,
    "latitude": -23.550520,
    "longitude": -46.633308
  }
  ```

---

## 🏪 Módulo de Restaurantes (`/restaurants`)
Gerencia os estabelecimentos parceiros.

### `POST /restaurants`
- **O que faz:** O usuário logado (Dono) cadastra seu próprio restaurante.
- **Quem acessa:** `RESTAURANT`.
- **Payload (`multipart/form-data`):**
  - `name` (string, nome da loja)
  - `cnpj` (string)
  - `isOpen` (boolean)
  - `photo` (Arquivo Binário, logo do restaurante, opcional)

### `GET /restaurants`
- **O que faz:** Retorna a vitrine de restaurantes pro cliente escolher onde pedir.
- **Quem acessa:** Qualquer logado.

### `GET /restaurants/my`
- **O que faz:** Carrega os dados do restaurante atrelado ao Dono que está logado.
- **Quem acessa:** `RESTAURANT`.

### `PATCH /restaurants/:id/status`
- **O que faz:** Botão de "Abrir / Fechar" o restaurante no fim do expediente.
- **Quem acessa:** Dono do restaurante.
- **Payload (`application/json`):**
  ```json
  { "isOpen": true }
  ```

---

## 🍔 Módulo de Catálogo (`/catalog`)
Gerencia o cardápio (produtos).

### `POST /catalog`
- **O que faz:** Cria um novo produto no cardápio.
- **Quem acessa:** Dono do Restaurante (`RESTAURANT`).
- **Payload (`multipart/form-data`):**
  - `restaurantId` (número, obrigatório)
  - `name` (string, ex: Pizza Calabresa)
  - `price` (número)
  - `description` (string, opcional)
  - `stock` (número, opcional)
  - `available` (boolean)
  - `image` (Arquivo Binário, Foto da comida, opcional)

### `GET /catalog`
- **O que faz:** Lista produtos de um restaurante (usado no App do Cliente).
- **Como funciona:** Usar Query param `?restaurantId=1`.

### `PUT /catalog/:id`
- **O que faz:** Edita nome, preço ou atualiza a foto do produto.
- **Quem acessa:** Dono.
- **Payload (`multipart/form-data`):** Mesmos campos do POST (tudo opcional).

---

## 🎟️ Módulo de Cupons (`/coupons`)
Descontos aplicáveis a pedidos.

### `POST /coupons`
- **O que faz:** Cria um novo cupom.
- **Quem acessa:** Dono do Restaurante.
- **Payload (`application/json`):**
  ```json
  {
    "restaurantId": 1,
    "code": "BEMVINDO10",
    "type": "percent", 
    "value": "10",
    "min": 50,
    "limit": 100,
    "isActive": true,
    "expiresAt": "2026-12-31T23:59:59.000Z"
  }
  ```
  *(Obs: type pode ser `percent`, `fixed` ou `shipping`)*

---

## 📦 Módulo de Pedidos (`/orders`)
Regras de checkout, aceite e delivery.

### `POST /orders`
- **O que faz:** Cria um pedido novo. Baixa estoque, calcula cupons, e trava o pedido em ABERTO.
- **Quem acessa:** Cliente (`CUSTOMER`).
- **Payload (`application/json`):**
  ```json
  {
    "restaurantId": 1,
    "deliveryAddressId": 2,
    "couponCode": "BEMVINDO10",
    "paymentMethod": "PIX",
    "items": [
      { "productId": 10, "name": "Pizza Calabresa", "price": 49.90, "quantity": 2 }
    ]
  }
  ```

### `PATCH /orders/:id/pay`
- **O que faz:** Simula o pagamento do pedido (Muda para `PAID`), pulando a integração real com Mercado Pago.
- **Quem acessa:** Cliente dono do pedido ou Admin/Restaurante.

### `PATCH /orders/:id/confirm`
- **O que faz:** O restaurante **aceita** o pedido e começa a preparar na cozinha.
- **Quem acessa:** Dono do restaurante (`RESTAURANT`).

### `PATCH /orders/:id/ready`
- **O que faz:** Restaurante avisa que a comida está embalada e chama o Motoboy.
- **Quem acessa:** Dono do restaurante.

### `GET /orders/available`
- **O que faz:** Radar do Motoboy. Lista pedidos que estão prontos no balcão aguardando retirada.
- **Quem acessa:** Motoboy (`COURIER`).

### `PATCH /orders/:id/accept`
- **O que faz:** Motoboy aceita fazer a corrida no seu App. (Status muda para IN_TRANSIT).
- **Quem acessa:** Motoboy.

### `PATCH /orders/:id/pickup`
- **O que faz:** Motoboy bipa o QR Code (ou PIN) no balcão da loja e pega a sacola.
- **Quem acessa:** Motoboy.

### `PATCH /orders/:id/deliver`
- **O que faz:** Motoboy chega na casa do cliente, cliente passa o PIN de segurança, e a entrega é finalizada.
- **Quem acessa:** Motoboy.

---

## 💳 Módulo de Pagamentos (`/payments`)

### `POST /payments/checkout`
- **O que faz:** Envia o Pedido para a API do Mercado Pago/Stripe para gerar o QRCode PIX ou link de cartão.
- **Quem acessa:** Cliente.
- **Payload (`application/json`):**
  ```json
  { "orderId": 123, "method": "PIX", "customerEmail": "cliente@teste.com" }
  ```

### `POST /payments/webhook`
- **O que faz:** Rota secreta onde o Mercado Pago avisa nosso backend que o cliente pagou a conta.
- **Quem acessa:** Mercado Pago (Rota cega sem JWT).

---

## 📡 Comunicação em Tempo Real (WebSocket)
Rota: `ws://localhost:3000`

### Eventos (Socket.io)
- **Emitir `joinOrderRoom`**: O App (Cliente ou Entregador) envia `{"orderId": 123}` para se inscrever no chat GPS daquele pedido.
- **Emitir `sendLocation`**: O Celular do Motoboy envia `{"orderId": 123, "latitude": -23.5, "longitude": -46.6}` a cada 5 segundos.
- **Receber `locationUpdate`**: O App do Cliente escuta este evento para mover o ícone da moto ao vivo no mapa do celular.
