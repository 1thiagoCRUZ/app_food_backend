import { Module } from '@nestjs/common';
import { TrackingGateway } from './presentation/gateways/tracking.gateway';

@Module({
  providers: [TrackingGateway],
  exports: [TrackingGateway]
})
export class CommunicationsModule {}
