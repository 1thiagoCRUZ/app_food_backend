export const UNIT_OF_WORK_PORT = 'UNIT_OF_WORK_PORT';

export interface UnitOfWorkPort {
  /**
   * Inicia a transação de banco de dados.
   */
  startTransaction(): Promise<void>;

  /**
   * Efetiva as alterações feitas durante a transação.
   */
  commitTransaction(): Promise<void>;

  /**
   * Desfaz as alterações feitas durante a transação em caso de erro.
   */
  rollbackTransaction(): Promise<void>;

  /**
   * Libera os recursos alocados para a transação.
   * Deve ser chamado sempre no bloco finally.
   */
  release(): Promise<void>;

  /**
   * Retorna um repositório vinculado à transação atual.
   * Usamos `any` no retorno para não forçar a camada de domínio a importar 
   * o tipo `Repository` do TypeORM, embora os métodos sejam equivalentes.
   * @param entity A classe da Entidade/Schema.
   */
  getRepository<T>(entity: new () => T): any;
}
