import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Drone } from './drone.entity';
import { Repository } from 'typeorm';
import { CreateDroneDto } from './dto/create-drone.dto';

@Injectable()
export class DronesService {
  constructor(
    @InjectRepository(Drone)
    private readonly droneRepo: Repository<Drone>,
  ) {}

  async create(dto: CreateDroneDto): Promise<Drone> {
    const drone = this.droneRepo.create({
      coordinates: {
        x: dto.longitude,
        y: dto.latitude,
      },
      type: dto.type,
      altitude: dto.altitude,
    });

    return await this.droneRepo.save(drone);
  }
}
