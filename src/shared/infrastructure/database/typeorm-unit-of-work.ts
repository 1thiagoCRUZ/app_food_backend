import { Injectable, Scope } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { UnitOfWorkPort } from '../../application/ports/unit-of-work.port';

@Injectable({ scope: Scope.TRANSIENT })
export class TypeOrmUnitOfWork implements UnitOfWorkPort {
  private queryRunner: QueryRunner;

  constructor(private readonly dataSource: DataSource) {}

  async startTransaction(): Promise<void> {
    if (this.queryRunner) {
      throw new Error('Transaction is already started on this UnitOfWork instance');
    }
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    this.ensureTransactionStarted();
    await this.queryRunner.commitTransaction();
  }

  async rollbackTransaction(): Promise<void> {
    this.ensureTransactionStarted();
    await this.queryRunner.rollbackTransaction();
  }

  async release(): Promise<void> {
    if (this.queryRunner && !this.queryRunner.isReleased) {
      await this.queryRunner.release();
    }
  }

  getRepository<T>(entity: new () => T): any {
    this.ensureTransactionStarted();
    return this.queryRunner.manager.getRepository(entity);
  }

  private ensureTransactionStarted() {
    if (!this.queryRunner) {
      throw new Error('Transaction has not been started. Call startTransaction() first.');
    }
  }
}
