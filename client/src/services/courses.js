import {
  COURSES,
  COURSES_CUSTOMIZED,
  COURSES_CUSTOMIZED_BY_LEVELS,
  COURSES_ACTIVATION,
  LESSONS,
  EXERCISES,
  SOLUTIONS,
} from "../routes";

export function onCreateCourse(axiosPrivate, data) {
  const _data = {
    level: data.level,
    title: data.title,
    description: data.description,
  };
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .post(COURSES, _data, {
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
export function getCourses(axiosPrivate, signal) {
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .get(COURSES, {
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
export function getCustomizedCourses(axiosPrivate, signal) {
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .get(COURSES_CUSTOMIZED, {
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
export function getCustomizedCoursesByLevels(axiosPrivate, level, signal) {
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .get(COURSES_CUSTOMIZED_BY_LEVELS, {
        signal: signal,
        params: {
          level_id: level,
        },
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function onActivateCourses(axiosPrivate, data) {
  const _data = {
    id: data.course_id,
    status: data.course_status,
  };
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .post(COURSES_ACTIVATION, _data, {
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
export function onCreateContent(axiosPrivate, keyTitle, data) {
  return new Promise(async (resolve, reject) => {
    await axiosPrivate
      .post(
        keyTitle === "isLesson"
          ? LESSONS
          : keyTitle === "isExercise"
          ? EXERCISES
          : SOLUTIONS,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
