import axios from "../middlewares/http-common";
import {
  LOGIN,
  REGISTER,
  COMPLETE,
  COMPLETE_PROGRAM,
  COMPLETE_ACTIVATION,
} from "../routes";

export async function login(data) {
  // const ipAPI = "//api.ipify.org?format=json";
  // const response = await fetch(ipAPI);
  // const responseData = await response.json();
  // const ipAddress = responseData.ip;
  const ipAddress = '127.0.0.1';
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
  //
  const _data = {
    prename: data.prename,
    name: data.name,
    role: "Student",
    sys_role: "student",
    username: data.username,
    password: data.password,
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

export async function completeInscription(data) {
  // const ipAPI = "//api.ipify.org?format=json";
  // const response = await fetch(ipAPI);
  // const responseData = await response.json();
  // const ipAddress = responseData.ip;
  const ipAddress = '127.0.0.1';
  // 
  const _data = {
    id: data.id,
    prename: data.prename,
    name: data.name,
    gender: data.gender,
    sys_role: data.sys_role,
    telephone: data.telephone,
    mail: data?.mail || "",
    birth: data.birth,
    birth_location: data.birth_location,
    nationality: data.nationality,
    username: data.username,
    old_password: data.old_password,
    new_password: data.new_password,
    //
    dates: new Date(),
    location: "N/A",
    latitude: "N/A",
    longitude: "N/A",
    device: "PC",
    ip_address: ipAddress,
    operating_system: "Linux",
    navigator: "Chrome",
    end_date: new Date().setDate(new Date().getDate() + 3),
  };
  return new Promise(async (resolve, reject) => {
    await axios
      .post(COMPLETE, _data, {
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

export function completeProgram(data) {
  const _data = {
    id: data.id,
    inscription_id: data.inscription_id,
    level_id: data.level_id,
  };
  return new Promise(async (resolve, reject) => {
    await axios
      .post(COMPLETE_PROGRAM, _data, {
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

export function completeActivation(data) {
  const _data = {
    id: data.id,
    confirmation_code: data.confirmation_code,
    is_completed: data.is_completed,
  };
  return new Promise(async (resolve, reject) => {
    await axios
      .post(COMPLETE_ACTIVATION, _data, {
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
