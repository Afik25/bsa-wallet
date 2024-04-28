import { PROGRAMS, PROGRAMS_CUSTOMIZED, PROGRAMS_ACTIVATION } from "../routes";

// Program
export function onCreatePrograms(axiosPrivate, data) {
  const _data = {
    country: data.program_country,
    language: data.program_language,
    title: data.program_type,
  };
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .post(PROGRAMS, _data, {
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
export function getPrograms(axiosPrivate, signal) {
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .get(PROGRAMS, {
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
export function getCustomizedPrograms(axiosPrivate, signal) {
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .get(PROGRAMS_CUSTOMIZED, {
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
export function onActivatePrograms(axiosPrivate, data) {
  const _data = {
    id: data.program_id,
    status: data.program_status
  };
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .post(PROGRAMS_ACTIVATION, _data, {
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

