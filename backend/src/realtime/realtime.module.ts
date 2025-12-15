import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime/realtime.gateway';
import { DronesController } from 'src/drones/drones.controller';
import { DronesService } from 'src/drones/drones.service';
import { DronesModule } from 'src/drones/drones.module';

@Module({
  imports: [DronesModule],
  controllers: [DronesController],
  providers: [DronesService, RealtimeGateway],
})
export class RealtimeModule {}
