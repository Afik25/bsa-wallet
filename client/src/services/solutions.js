import { SOLUTIONS_CUSTOMIZED, SOLUTIONS_ACTIVATION } from "../routes";

export function getCustomizedSolutions(axiosPrivate, signal) {
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .get(SOLUTIONS_CUSTOMIZED, {
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
export function onActivateSolutions(axiosPrivate, data) {
  const _data = {
    id: data.lesson_id,
    status: data.lesson_status,
  };
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .post(SOLUTIONS_ACTIVATION, _data, {
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
