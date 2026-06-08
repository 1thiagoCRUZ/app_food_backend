import { Module } from '@nestjs/common';
import { GEO_CODING_PORT } from './ports/geo-coding.port';
import { GoogleMapsAdapter } from './adapters/google-maps.adapter';
import { STORAGE_PORT } from './ports/storage.port';
import { S3StorageAdapter } from './adapters/s3-storage.adapter';

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
  ],
  exports: [GEO_CODING_PORT, STORAGE_PORT],
})
export class SharedModule {}
