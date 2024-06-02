import axios from "../middlewares/http-common";
import {
  LOGIN,
  REGISTER,
  REGISTER_ACTIVATION,
} from "../routes";

export async function login(data) {
  // const ipAPI = "https://api.ipify.org/?format=json" || "";
  // const response = (await fetch(ipAPI)) || "";
  // const responseData = (await response.json()) || "";
  // const ipAddress = responseData.ip || "127.0.0.1";
  const ipAddress = "127.0.0.1";
  //
  const dates = new Date();
  const location = "N/A";
  const latitude = "N/A";
  const longitude = "N/A";
  const device = "PC";
  const ip_address = ipAddress;
  const operating_system = "N/A";
  const navigator = "N/A";
  //
  const _data = {
    username: data.username,
    password: data.password,
    dates: dates,
    location: location,
    latitude: latitude,
    longitude: longitude,
    device: device,
    ip_address: ip_address,
    operating_system: operating_system,
    navigator: navigator,
  };
  return new Promise(async (resolve, reject) => {
    await axios
      .post(LOGIN, _data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function inscription(data) {
  const _data = {
    isRegisterWithPhoneNumber: data?.isRegisterWithPhoneNumber,
    mail: data?.mail,
    telephone: data?.telephone,
    sys_role: "user",
    dates: new Date(),
  };
  return new Promise(async (resolve, reject) => {
    await axios
      .post(REGISTER, _data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function activateInscription(data) {
  // const ipAPI = "https://api.ipify.org/?format=json" || "";
  // const response = (await fetch(ipAPI)) || "";
  // const responseData = (await response.json()) || "";
  // const ipAddress = responseData.ip || "127.0.0.1";
  const ipAddress = "127.0.0.1";
  //
  const _data = {
    inscription: data?.inscription,
    //
    location: "N/A",
    latitude: "N/A",
    longitude: "N/A",
    device: "PC",
    ip_address: ipAddress,
    operating_system: "Linux",
    navigator: "Chrome"
  };
  return new Promise(async (resolve, reject) => {
    await axios
      .post(REGISTER_ACTIVATION, _data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
