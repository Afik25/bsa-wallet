import * as Yup from "yup";

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "object" && Object.entries(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

export const wait = (duration = 1000) => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
};

export const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

export const colors = [
  "#0FA3B1",
  "#B5E2FA",
  "#F9F7F3",
  "#EDDEA4",
  "#F7A072",
  "#4DE2EF",
  "#8C3608",
  "#594B12",
];

export const validationSchemaRegister = Yup.object().shape({
  prename: Yup.string()
    .required("First Name is required")
    .min(2, "The first name must have at least 2 caractors"),
  name: Yup.string()
    .required("Last Name is required")
    .min(2, "The last name must have at least 2 caractors"),
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "The password must have at least 4 caractors"),
  confirm_password: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "The password must match!"),
  gcu: Yup.boolean().oneOf(
    [true],
    "You have to be agree with the terms and privacy of using."
  ),
});

export const validationSchemaLoginStepOne = Yup.object().shape({
  telephone: Yup.string().required(
    "Phone number is required."
  ),
});

export const validationSchemaLoginStepTwo = Yup.object().shape({
  code: Yup.string().required(
    "Code is required."
  ),
  bsa: Yup.string().required("Complete BSA is required."),
});

export const validationCompleteInscription = Yup.object().shape({
  prename: Yup.string()
    .required("First name(Prename) is required")
    .min(2, "First name require at least 2 caractors"),
  name: Yup.string()
    .required("Last name(Name) is required")
    .min(2, "Last name require at least 2 caractors"),
  gender: Yup.string().required("Gender is required"),
  telephone: Yup.number()
    .typeError("You should specify a phone number")
    .required("Phone number is required")
    .min(8, "Input a valid phone number"),
  mail: Yup.string()
    .required("E-mail is required")
    .email("Input a valid address e-mail"),
  birth: Yup.string().required("Birth date is required"),
  birth_location: Yup.string().required("Birth location is required"),
  nationality: Yup.string().required("Nationality is required"),
  username: Yup.string().required("Username is required"),
  old_password: Yup.string().required("Old Password is required"),
  new_password: Yup.string()
    .required("New Password is required")
    .min(4, "The password must have at least 6 caractors"),
  confirm_password: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("new_password"), null], "The password must match!"),
});

export const validationCompleteProgram = Yup.object().shape({
  program_id: Yup.string().required("Program is required"),
  level_id: Yup.string().required("Level of study is required"),
});

export const validationCompleteActivation = Yup.object().shape({
  confirmation_code: Yup.string().required("Input confirmation's code"),
});

export const validationProgram = Yup.object().shape({
  program_country: Yup.string().required(
    "Choose the country that based the program"
  ),
  program_language: Yup.string().required(
    "Specify the language of the program"
  ),
  program_type: Yup.string().required("Specify the type of the program"),
});

export const validationLevel = Yup.object().shape({
  program: Yup.string().required("Choose the concerned program"),
  level: Yup.string().required("Provide the level of study"),
  description: Yup.string().required("Describe the level of study"),
});

export const validationCourse = Yup.object().shape({
  program: Yup.string().required("Choose the concerned program"),
  level: Yup.string().required("Provide the level of study"),
  title: Yup.string().required("Grab the title of course"),
  description: Yup.string().required(
    "Procide Description or Summary of the course"
  ),
});

export const validationAddingContent = Yup.object().shape({
  title: Yup.string().required("Grab the title content"),
  type: Yup.string().required(
    "Provide the type of accessibility to the content"
  ),
  language: Yup.string().required("Provide the langauge of the content"),
  description: Yup.string().required(
    "Provide Description or Summary of the content"
  ),
  thumbnail: Yup.string().required("Grab the content"),
});
