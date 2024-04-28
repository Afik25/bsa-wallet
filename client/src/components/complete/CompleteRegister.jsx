import React, { useState, useEffect } from "react";
import { MdOutlineArrowForwardIos } from "../../middlewares/icons";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import useAxiosPrivate from "../../hooks/context/state/useAxiosPrivate";
import {
  isEmpty,
  wait,
  validationCompleteInscription,
  validationCompleteProgram,
  validationCompleteActivation,
} from "../../utils/utils";
import {
  completeInscription,
  completeProgram,
  completeActivation,
} from "../../services/authentication";
import countries from "../../middlewares/countries.json";
import { getPrograms } from "../../services/programs";
import { getLevels } from "../../services/levels";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/context/state/useLogout";
import { capitalize } from "../../utils/utils";

const CompleteRegister = ({ sys_role }) => {
  const axiosPrivate = useAxiosPrivate();
  const { t } = useTranslation();
  const [activeOption, setActiveOption] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activationCode, setActivationCode] = useState();
  //
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = useLogout();
  const signOut = async () => {
    await logout();
    navigate("/login");
  };
  //
  const user = useSelector(
    (state) => state.setInitConf.initConnectedUser.connectedUserData
  );
  const programsData = useSelector(
    (state) => state.setProgramSlice.initPrograms?.programsData
  );
  const levelsData = useSelector(
    (state) => state.setLevelSlice.initLevels?.levelsData
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    getPrograms(axiosPrivate, signal).then((result) => {
      dispatch({
        type: "setUpPrograms/getPrograms",
        payload: result,
      });
    });

    getLevels(axiosPrivate, signal).then((result) => {
      dispatch({
        type: "setUpLevels/getLevels",
        payload: result,
      });
    });

    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, []);

  let validations = {
    0: validationCompleteInscription,
    1: validationCompleteProgram,
    2: validationCompleteActivation,
  };
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(validations[activeOption]),
    defaultValues: {
      id: user.userInfo?.user_id,
      is_completed: true,
      prename: user.userInfo?.prename,
      name: user.userInfo?.name,
      telephone: user.userInfo?.telephone,
      mail: user.userInfo?.mail,
      sys_role: user.userInfo?.sys_role,
      username: user.userInfo?.username,
    },
  });
  const onSubmit = async (data) => {
    await wait(400);
    if (activeOption === 0) {
      setIsSubmitting(!isSubmitting);
      completeInscription(data)
        .then((result) => {
          let response = result;
          if (response?.data?.status === 1) {
            setIsSubmitting(false);
            swal({
              title: "Registration Completion",
              text: `${response?.data?.message}. ${
                sys_role !== "student"
                  ? "Activation's code : " + response?.data?.code
                  : ""
              }`,
              icon: "success",
              button: "Ok",
            });
            setActivationCode(response?.data?.code);
            setValue("inscription_id", response?.data?.inscription_id);
            setActiveOption(sys_role === "student" ? 1 : 2);
          }
        })
        .catch((error) => {
          setIsSubmitting(false);
          if (!error?.response) {
            swal({
              title: "Oups!",
              text: "No server response!",
              icon: "warning",
              buttons: true,
            });
          } else {
            swal({
              title: "Process failed!",
              text: error?.response?.data?.message,
              icon: "warning",
              buttons: true,
            });
          }
        });
    } else if (activeOption === 1) {
      setIsSubmitting(!isSubmitting);
      completeProgram(data)
        .then((result) => {
          let response = result;
          if (response?.data?.status === 1) {
            setIsSubmitting(false);
            swal({
              title: "Registration completion",
              text: `${response?.data?.message}. Activation's code : ${activationCode}`,
              icon: "success",
              button: "Ok",
            }).then((res) => {
              swal("An activation's code was sent to provided number by SMS.");
            });
            setActiveOption(2);
          }
        })
        .catch((error) => {
          setIsSubmitting(false);
          if (!error?.response) {
            swal({
              title: "Oups!",
              text: "No server response!",
              icon: "warning",
              buttons: true,
            });
          } else {
            swal({
              title: "Process failed!",
              text: error?.response?.data?.message,
              icon: "warning",
              buttons: true,
            });
          }
        });
    } else {
      setIsSubmitting(!isSubmitting);
      completeActivation(data)
        .then((result) => {
          let response = result;
          if (response?.data?.status === 1) {
            setIsSubmitting(false);
            swal({
              title: "Registration completion",
              text: response?.data?.message,
              icon: "success",
              button: "Ok",
            }).then((res) => {
              swal(
                "The system will disconnect you automatically in order to take care of update. Please get connected again !"
              );
              signOut();
            });
          }
        })
        .catch((error) => {
          setIsSubmitting(false);
          if (!error?.response) {
            swal({
              title: "Oups!",
              text: "No server response!",
              icon: "warning",
              buttons: true,
            });
          } else {
            swal({
              title: "Process failed!",
              text: error?.response?.data?.message,
              icon: "warning",
              buttons: true,
            });
          }
        });
    }
  };
  let fragments = {
    0: (
      <div className="steps">
        <p className="title t-2">Complete your Personal Informations</p>
        <div className="input-div">
          <input
            type="text"
            className="input-form"
            autoComplete="none"
            placeholder=" "
            {...register("prename")}
          />
          <label htmlFor="prename" className="label-form">
            Lastname
          </label>
          {errors.prename && (
            <span className="fade-in">{errors.prename.message}</span>
          )}
        </div>
        <div className="input-div">
          <input
            type="text"
            className="input-form"
            autoComplete="none"
            placeholder=" "
            {...register("name")}
          />
          <label htmlFor="name" className="label-form">
            Firstname
          </label>
          {errors.name && (
            <span className="fade-in">{errors.name.message}</span>
          )}
        </div>
        <div className="input-div">
          <select className="input-form" {...register("gender")}>
            <option value="" style={{ color: "grey" }} selected>
              Gender
            </option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
          {errors.gender && (
            <span className="fade-in">{errors.gender.message}</span>
          )}
        </div>
        <div className="input-div">
          <select className="input-form" {...register("role")}>
            <option value="" style={{ color: "grey" }}>
              You are (Role){" "}
            </option>
            <option value={user.userInfo?.sys_role} selected>
              {capitalize(user.userInfo?.sys_role)}
            </option>
            {/* <option value="parent">Parent</option>
              <option value="teacher">Enseignant</option> */}
          </select>
        </div>
        <div className="input-div">
          <input
            type="text"
            className="input-form"
            autoComplete="none"
            placeholder=" "
            {...register("telephone")}
          />
          <label htmlFor="telephone" className="label-form">
            Telephone
          </label>
          {errors.telephone && (
            <span className="fade-in">{errors.telephone.message}</span>
          )}
        </div>
        <div className="input-div">
          <input
            type="text"
            className="input-form"
            autoComplete="none"
            placeholder=" "
            {...register("mail")}
          />
          <label htmlFor="mail" className="label-form">
            E-mail
          </label>
          {errors.mail && (
            <span className="fade-in">{errors.mail.message}</span>
          )}
        </div>
        <div className="input-div">
          <input
            type="date"
            className="input-form"
            autoComplete="none"
            placeholder=" "
            {...register("birth")}
          />
          <label htmlFor="birth" className="label-form">
            Date of Birth
          </label>
          {errors.birth && (
            <span className="fade-in">{errors.birth.message}</span>
          )}
        </div>
        <div className="input-div">
          <input
            type="text"
            className="input-form"
            autoComplete="none"
            placeholder=" "
            {...register("birth_location")}
          />
          <label htmlFor="birth_location" className="label-form">
            Birth location
          </label>
          {errors.birth_location && (
            <span className="fade-in">{errors.birth_location.message}</span>
          )}
        </div>
        <div className="input-div">
          <select className="input-form" {...register("nationality")}>
            <option value="" style={{ color: "grey" }}>
              Nationality
            </option>
            {isEmpty(countries) ? (
              <option value="" selected>
                No country available!
              </option>
            ) : (
              countries.map((item, i) => (
                <option key={i} value={item.name.official}>
                  {item.name.official}
                </option>
              ))
            )}
          </select>
          {errors.nationality && (
            <span className="fade-in">{errors.nationality.message}</span>
          )}
        </div>
        <div className="input-div">
          <input
            type="text"
            className="input-form"
            autoComplete="none"
            placeholder=" "
            {...register("username")}
          />
          <label htmlFor="username" className="label-form">
            Username
          </label>
          {errors.username && (
            <span className="fade-in">{errors.username.message}</span>
          )}
        </div>
        <div className="input-div">
          <input
            type="text"
            className="input-form"
            autoComplete="none"
            placeholder=" "
            {...register("old_password")}
          />
          <label htmlFor="old_password" className="label-form">
            Old password
          </label>
          {errors.old_password && (
            <span className="fade-in">{errors.old_password.message}</span>
          )}
        </div>
        <div className="input-div">
          <input
            type="text"
            className="input-form"
            autoComplete="none"
            placeholder=" "
            {...register("new_password")}
          />
          <label htmlFor="new_password" className="label-form">
            New password
          </label>
          {errors.new_password && (
            <span className="fade-in">{errors.new_password.message}</span>
          )}
        </div>
        <div className="input-div">
          <input
            type="text"
            className="input-form"
            autoComplete="none"
            placeholder=" "
            {...register("confirm_password")}
          />
          <label htmlFor="confirm_password" className="label-form">
            Confirm new password
          </label>
          {errors.confirm_password && (
            <span className="fade-in">{errors.confirm_password.message}</span>
          )}
        </div>
      </div>
    ),
    1: (
      <div className="steps">
        <p className="title t-2">Complete your Program's Informations</p>
        <div className="input-div">
          <input
            type="hidden"
            className="input-form"
            autoComplete="none"
            placeholder=" "
            {...register("inscription_id")}
          />
        </div>
        <div className="input-div">
          <select
            className="input-form"
            {...register("program_id")}
            onChange={(e) => {
              let _data = levelsData?.data?.levels.filter(
                (item) => item.program_id == e.target.value
              );
              setSelectedProgram(_data);
            }}
          >
            <option value="" style={{ color: "grey" }}>
              --- Choose a program ---
            </option>
            {isEmpty(programsData?.data?.programs) ? (
              <option value="" disabled>
                {programsData?.data?.message}
              </option>
            ) : (
              programsData?.data?.programs?.map((prog) => {
                return (
                  prog.status === 1 && (
                    <option value={prog.id}>
                      {prog.language + " / " + prog.country}
                    </option>
                  )
                );
              })
            )}
          </select>
          {errors.program_id && (
            <span className="fade-in">{errors.program_id.message}</span>
          )}
        </div>
        <div className="input-div">
          <select className="input-form" {...register("level_id")}>
            <option value="" style={{ color: "grey" }}>
              --- Choose level of study (Classe & section) ---
            </option>
            {isEmpty(selectedProgram) ? (
              <option value="" disabled>
                No level available
              </option>
            ) : (
              selectedProgram.map((lev) => {
                return (
                  lev.status === 1 && (
                    <option value={lev.id}>{lev.title.toLowerCase()}</option>
                  )
                );
              })
            )}
          </select>
          {errors.level_id && (
            <span className="fade-in">{errors.level_id.message}</span>
          )}
        </div>
      </div>
    ),
    2: (
      <div className="steps">
        <p className="title t-2">
          Un code de confirmation permettant l'activation de votre compte a été
          envoyé par SMS via le numéro de téléphone que vous avez renseigné.
        </p>
        <div className="input-div">
          <input
            type="text"
            className="input-form"
            autoComplete="none"
            placeholder=" "
            {...register("confirmation_code")}
          />
          <label htmlFor="username" className="label-form">
            Confirmation code
          </label>
          {errors.confirmation_code && (
            <span className="fade-in">{errors.confirmation_code.message}</span>
          )}
        </div>
      </div>
    ),
  };
  return (
    <div className="complete-register">
      <div className="cr-head">
        <div className={activeOption === 0 ? "cr-tab active-tab" : "cr-tab"}>
          <span>Personal Informations</span>
        </div>
        <div className="cr-tab">
          <MdOutlineArrowForwardIos />
        </div>
        {sys_role === "student" && (
          <>
            <div
              className={activeOption === 1 ? "cr-tab active-tab" : "cr-tab"}
            >
              <span>Program's Informations</span>
            </div>
            <div className="cr-tab">
              <MdOutlineArrowForwardIos />
            </div>
          </>
        )}
        <div className={activeOption === 2 ? "cr-tab active-tab" : "cr-tab"}>
          <span>Account activation</span>
        </div>
      </div>
      <div className="cr-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          {fragments[activeOption]}
          <div className="buttons">
            {isSubmitting ? (
              <div className="loader"></div>
            ) : (
              <button type="submit" className="button validate">
                {activeOption !== 2 ? "Valider" : "Confirmer & Activer"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteRegister;
