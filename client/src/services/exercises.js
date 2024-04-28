import { EXERCISES_CUSTOMIZED, EXERCISES_ACTIVATION } from "../routes";

export function getCustomizedExercises(axiosPrivate, signal) {
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .get(EXERCISES_CUSTOMIZED, {
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
export function onActivateExercises(axiosPrivate, data) {
  const _data = {
    id: data.exercise_id,
    status: data.exercise_status,
  };
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .post(EXERCISES_ACTIVATION, _data, {
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
