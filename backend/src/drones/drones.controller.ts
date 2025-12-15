import { Body, Controller, Get } from '@nestjs/common';
import { DronesService } from './drones.service';
import { Drone } from './drone.entity';

@Controller('drones')
export class DronesController {
  constructor(private readonly dronesService: DronesService) {}

  @Get()
  findAll(): Promise<Drone[]> {
    return this.dronesService.findAll();
  }
}
