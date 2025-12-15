export type DroneType = "תוקף" | "תצפית" | "מיירט" | "מתאבד"; 

export type CreateDroneDto = {
  latitude: number;
  longitude: number;
  type: DroneType;
  altitude: number;
};

export type Drone = {
  id: number;
  coordinates: { x: number; y: number };
  type: DroneType;
  altitude: number;
};