import { DroneType } from '../droneType.enum';

export class CreateDroneDto {
  latitude: number;
  longitude: number;
  type: DroneType;
  altitude: number;
}
