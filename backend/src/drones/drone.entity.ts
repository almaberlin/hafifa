import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DroneType } from './droneType.enum';

type Point = { x: number; y: number };

@Entity({ schema: 'hafifa', name: 'drones' })
export class Drone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'point',
    transformer: {
      // DB -> Entity
      from: (value: string | Point | null): Point | null => {
        if (!value) return null;

        // Sometimes pg returns {x,y}, sometimes "(x,y)" depending on driver/settings
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        if (typeof value === 'object') return value as Point;

        const match = value.match(/^\(?\s*([-0-9.]+)\s*,\s*([-0-9.]+)\s*\)?$/);
        if (!match) return null;

        return { x: Number(match[1]), y: Number(match[2]) };
      },

      // Entity -> DB
      to: (value: Point | null): string | null => {
        if (!value) return null;
        return `(${value.x},${value.y})`;
      },
    },
  })
  coordinates: Point;

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
