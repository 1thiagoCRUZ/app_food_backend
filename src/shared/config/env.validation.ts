export function validateEnv(): void {
  const required: string[] = [
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
    'JWT_SECRET',
    'JWT_EXPIRATION',
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `[Startup] Variáveis de ambiente obrigatórias não encontradas: ${missing.join(', ')}\n` +
      `Certifique-se de que o arquivo ".env" existe na raiz do projeto e contém essas variáveis.`,
    );
  }
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN.includes('seu_access_token')) {
    console.warn('[Config] MERCADOPAGO_ACCESS_TOKEN não configurada. Pagamentos rodarão em MODO SIMULADO.');
  }
  if (!process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY.includes('sua_chave')) {
    console.warn('[Config] GOOGLE_MAPS_API_KEY não configurada. Geocoding rodará em MODO SIMULADO.');
  }
}
