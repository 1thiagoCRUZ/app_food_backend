import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { HashProviderPort } from '../../application/ports/hash.provider.port';

@Injectable()
export class BcryptHashProvider implements HashProviderPort {
  private readonly saltRounds = 10;

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
