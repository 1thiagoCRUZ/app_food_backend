import { Module } from '@nestjs/common';
import { GEO_CODING_PORT } from './ports/geo-coding.port';
import { GoogleMapsAdapter } from './adapters/google-maps.adapter';
import { STORAGE_PORT } from './ports/storage.port';
import { S3StorageAdapter } from './adapters/s3-storage.adapter';
import { UNIT_OF_WORK_PORT } from './application/ports/unit-of-work.port';
import { TypeOrmUnitOfWork } from './infrastructure/database/typeorm-unit-of-work';

@Module({
  providers: [
    {
      provide: GEO_CODING_PORT,
      useClass: GoogleMapsAdapter,
    },
    {
      provide: STORAGE_PORT,
      useClass: S3StorageAdapter,
    },
    {
      provide: UNIT_OF_WORK_PORT,
      useClass: TypeOrmUnitOfWork,
    },
  ],
  exports: [GEO_CODING_PORT, STORAGE_PORT, UNIT_OF_WORK_PORT],
})
export class SharedModule {}
