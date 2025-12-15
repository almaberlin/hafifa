import axios, { type AxiosResponse } from "axios";
import type { Drone } from "../utils/types";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

export default {
    drones() {
        return {
            getAll: (): Promise<AxiosResponse<Drone[]>> =>
                axiosInstance.get("drones"),
        };
    },

};