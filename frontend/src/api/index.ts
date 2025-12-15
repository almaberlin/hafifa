import axios, { type AxiosResponse } from "axios";
import type { CreateDroneDto, Drone } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

export default {
    drones() {
        return {
            create: (
                data: CreateDroneDto,
            ): Promise<AxiosResponse<Drone>> => 
                axiosInstance.post("drones", data),      
        };
    },

};