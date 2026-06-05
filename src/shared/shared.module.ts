import { Module } from '@nestjs/common';
import { GEO_CODING_PORT } from './ports/geo-coding.port';
import { GoogleMapsAdapter } from './adapters/google-maps.adapter';
@Module({
  providers: [
    {
      provide: GEO_CODING_PORT,
      useClass: GoogleMapsAdapter,
    },
  ],
  exports: [GEO_CODING_PORT],
})
export class SharedModule {}
