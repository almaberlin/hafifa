import axios, { type AxiosResponse } from "axios";
import type { DronePayload, Drone } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

export default {
    drones() {
        return {
            create: (
                data: DronePayload,
            ): Promise<AxiosResponse<Drone>> => 
                axiosInstance.post("drones", data),      
        };
    },

};