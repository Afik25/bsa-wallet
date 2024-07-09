import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
//
import { BiCheck, IoCloseOutline } from "../middlewares/icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  validationSchemaRegisterWithEmailAddress,
  validationSchemaRegisterWithPhoneNumber,
  validationSchemaNull,
  wait,
} from "../utils/utils";
//
import { inscription, activateInscription } from "../services/authentication";

const Register = () => {
  const [switched, setSwitched] = useState(false);
  const [step, setStep] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [classNameMsg, setClassNameMsg] = useState("");
  const [otpCode, setOtpCode] = useState(new Array(6).fill(""));
  const [tmpCode, setTmpCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(
      step === 0
        ? switched
          ? validationSchemaRegisterWithPhoneNumber
          : validationSchemaRegisterWithEmailAddress
        : validationSchemaNull
    ),
    defaultValues: {
      isRegisterWithPhoneNumber: true,
    },
  });

  const toggle = () => {
    reset();
    setSwitched(!switched);
  };

  const onOtpDigitHandling = (e, idx) => {
    if (isNaN(e.target.value)) return false;
    setOtpCode([
      ...otpCode.map((val, k) => (k === idx ? e.target.value : val)),
    ]);
    if (e.target.value && e.target.nextSibling) e.target.nextSibling.focus();
  };

  const onSubmit = async (data) => {
    setIsSending(true);
    await wait(1000);
    setValue("isRegisterWithPhoneNumber", switched ? true : false);
    //
    if (step === 0) {
      inscription(data)
        .then((response) => {
          if (response?.data?.status) {
            setIsSending(false);
            setClassNameMsg("msg-box msg-box-success fade-in");
            setResponseMessage(
              `${response?.data?.message}. Code : ${response?.data?.inscription?.code}`
            );
            reset();
          }
          //
          setTmpCode(response?.data?.inscription?.code);
          setValue("inscription", response?.data?.inscription);
          //
          const timer = setTimeout(() => {
            setClassNameMsg("display-none");
            setStep(1);
          }, 4000);
          return () => clearTimeout(timer);
        })
        .catch((error) => {
          setIsSending(false);
          setClassNameMsg("msg-box msg-box-failed fade-in");
          if (!error?.response) {
            setResponseMessage("No server response");
          } else {
            setResponseMessage(error?.response?.data?.message);
          }
          const timer = setTimeout(() => {
            setClassNameMsg("display-none");
          }, 4000);
          return () => clearTimeout(timer);
        });
    }
    if (step === 1) {
      const _otpCode = otpCode.join("");
      if (_otpCode.length < 6) {
        setClassNameMsg("msg-box msg-box-failed fade-in");
        setResponseMessage(
          "(Digit length incorrect) : The OTP Code must have 6-digit."
        );
        setIsSending(false);
        const timer = setTimeout(() => {
          setClassNameMsg("display-none");
        }, 4000);
        return () => clearTimeout(timer);
      }
      console.log({
        "tmpCode typeof": typeof tmpCode,
        "_otpCode typeof": typeof _otpCode,
      });
      console.log({ "tmpCode ": tmpCode, _otpCode: _otpCode });
      if (tmpCode === _otpCode) {
        activateInscription(data)
          .then((response) => {
            if (response?.data?.status) {
              setIsSending(false);
              setClassNameMsg("msg-box msg-box-success fade-in");
              setResponseMessage(response?.data?.message);
            }
            const timer = setTimeout(() => {
              setClassNameMsg("display-none");
              setStep(0);
            }, 4000);
            return () => clearTimeout(timer);
          })
          .catch((error) => {
            setIsSending(false);
            setClassNameMsg("msg-box msg-box-failed fade-in");
            if (!error?.response) {
              setResponseMessage("No server response");
            } else {
              setResponseMessage(error?.response?.data?.message);
            }
            const timer = setTimeout(() => {
              setClassNameMsg("display-none");
            }, 4000);
            return () => clearTimeout(timer);
          });
      } else {
        setClassNameMsg("msg-box msg-box-failed fade-in");
        setResponseMessage("The OTP Code invalid.");
        setIsSending(false);
        const timer = setTimeout(() => {
          setClassNameMsg("display-none");
        }, 4000);
        return () => clearTimeout(timer);
      }
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>BSA - Wallet</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
      </Helmet>
      <div className="sign-up">
        <div className="left col-l-6 col-s-12">
          <div className="head display-flex justify-content-space-between">
            <Link to="/" className="link">
              <img
                src={process.env.PUBLIC_URL + "/logo.png"}
                alt="register-logo"
                className="logo"
              />
            </Link>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="body m-auto">
            <h1 className="title t-1">Sin In to BSA-Wallet</h1>
            <p className="title t-2">
              Get register and get your very secures wallet...
            </p>
            <div className={classNameMsg}>
              <span>{responseMessage}</span>
            </div>
            {step === 0 && (
              <div className="input-div">
                <div className="tile">
                  <p className="title t-3">Sign Up with</p>
                  <div className="switch-wrapper">
                    <span>E-mail address</span>
                    <div className="switch" onClick={toggle}>
                      <div
                        className={
                          switched
                            ? "switched switched-active"
                            : "switched switched-inactive"
                        }
                        onClick={toggle}
                      >
                        {switched ? (
                          <BiCheck className="icon" />
                        ) : (
                          <IoCloseOutline className="icon" />
                        )}
                      </div>
                    </div>
                    <span>Phone number</span>
                  </div>
                </div>
                {!switched && (
                  <div className="input-div">
                    <input
                      type="text"
                      className="input-form"
                      autoComplete="none"
                      placeholder=" "
                      {...register("mail")}
                    />
                    <label htmlFor="mail" className="label-form">
                      E-mail address
                    </label>
                    {errors.mail && (
                      <span className="fade-in">{errors.mail.message}</span>
                    )}
                  </div>
                )}
                {switched && (
                  <div className="input-div">
                    <PhoneInput
                      onChange={(val) => setValue("telephone", val)}
                      inputStyle={{ width: "100%" }}
                      country={"cd"}
                      countryCodeEditable={false}
                      inputProps={{
                        name: "telephone",
                        required: true,
                        autoFocus: true,
                      }}
                      autoFormat={true}
                      enableSearch={true}
                      specialLabel={"Phone Number"}
                    />
                    {errors.telephone && (
                      <span className="fade-in">
                        {errors.telephone.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
            {step === 1 && (
              <div className="input-otp">
                {otpCode.map((el, i) => (
                  <input
                  key={i}
                    type="text"
                    className="input-form"
                    value={el}
                    maxLength={1}
                    onChange={(e) => onOtpDigitHandling(e, i)}
                  />
                ))}
              </div>
            )}
            <button
              type={isSending ? "button" : "submit"}
              className={isSending ? "button normal" : "button validate"}
            >
              {isSending ? "Inscription..." : "Continue"}
            </button>
          </form>
          <div
            className="foot width display-flex justify-content-center align-items-center"
            style={{ marginTop: "0.60rem" }}
          >
            <span>Already have account ?</span>
            <Link to="/login" className="link">
              Sign in at
            </Link>
          </div>
        </div>
        <div className="right col-l-6 col-s-12">
          <div className="banner m-auto">
            <div className="circle circle-1">
              <img
                src={process.env.PUBLIC_URL + "/notebook-and-pencil.png"}
                alt="login-banner"
                className="image"
              />
            </div>
            <div className="circle circle-2">
              <img
                src={process.env.PUBLIC_URL + "/book-and-pencil.png"}
                alt="login-banner"
                className="image"
              />
            </div>
            <p className="title t-1">Your wallet at your fingerpoint.</p>
            <img
              src={process.env.PUBLIC_URL + "/register.png"}
              alt="login-banner"
              className="image fade-in"
            />
          </div>
          <div className="foot">
            <span>
              &copy; {new Date().getFullYear()} BSA-Wallet. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Register;
