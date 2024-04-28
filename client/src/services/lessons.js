import { LESSONS_CUSTOMIZED, LESSONS_ACTIVATION } from "../routes";

export function getCustomizedLessons(axiosPrivate, signal) {
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .get(LESSONS_CUSTOMIZED, {
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
export function onActivateLessons(axiosPrivate, data) {
  const _data = {
    id: data.lesson_id,
    status: data.lesson_status,
  };
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .post(LESSONS_ACTIVATION, _data, {
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
