import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drone } from './drone.entity';
import { DronesController } from './drones.controller';
import { DronesService } from './drones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Drone])],
  controllers: [DronesController],
  providers: [DronesService],
})
export class DronesModule {}
