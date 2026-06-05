export interface HashProviderPort {
  hash(plainText: string): Promise<string>;
  compare(plainText: string, hash: string): Promise<boolean>;
}

export const HASH_PROVIDER_PORT = 'HASH_PROVIDER_PORT';
