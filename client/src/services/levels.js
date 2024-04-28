import { LEVELS, LEVELS_CUSTOMIZED, LEVELS_ACTIVATION } from "../routes";

// Level
export function onCreateLevel(axiosPrivate, data) {
  const _data = {
    program_id: data.program,
    title: data.level,
    description: data.description,
  };
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .post(LEVELS, _data, {
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
export function getLevels(axiosPrivate, signal) {
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .get(LEVELS, {
        signal: signal,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getCustomizedLevels(axiosPrivate, signal) {
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .get(LEVELS_CUSTOMIZED, {
        signal: signal,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function onActivateLevels(axiosPrivate, data) {
  const _data = {
    id: data.level_id,
    status: data.level_status
  };
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .post(LEVELS_ACTIVATION, _data, {
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
