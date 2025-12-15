import { Body, Controller, Post } from '@nestjs/common';
import { DronesService } from './drones.service';
import { Drone } from './drone.entity';
import { CreateDroneDto } from './dto/create-drone.dto';

@Controller('drones')
export class DronesController {
  constructor(private readonly dronesService: DronesService) {}

  @Post()
  create(@Body() body: CreateDroneDto): Promise<Drone> {
    return this.dronesService.create(body);
  }
}
