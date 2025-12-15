import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DroneType } from './droneType.enum';

@Entity({ schema: 'hafifa', name: 'drones' })
export class Drone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'point',
  })
  coordinates: { x: number; y: number };

  @Column({
    type: 'enum',
    enum: DroneType,
    enumName: 'drone_type',
  })
  type: DroneType;

  @Column({ type: 'int' })
  altitude: number;

  get latitude(): number {
    return this.coordinates.y;
  }

  get longitude(): number {
    return this.coordinates.x;
  }
}
