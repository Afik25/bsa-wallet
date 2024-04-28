import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import QRCode from "react-qr-code";
//
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  validationSchemaLoginStepOne,
  validationSchemaLoginStepTwo,
  wait,
} from "../utils/utils";
//
import { login } from "../services/authentication";
import useAuth from "../hooks/context/state/useAuth";
//
//
const Login = () => {
  const [signMode, setSignMode] = useState(0);
  const [step, setStep] = useState({ mode1: 0, mode2: 0 });
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [classNameMsg, setClassNameMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(
      step === 0 ? validationSchemaLoginStepOne : validationSchemaLoginStepTwo
    ),
  });

  const onSubmit = async (data) => {
    setIsSending(true);
    await wait(500);
    //
    step === 0
      ? login(data)
          .then((response) => {
            if (response?.data?.isLogged) {
              setIsSending(false);
              signMode === 0
                ? setStep({ mode1: 1, mode2: step.mode2 })
                : setStep({ mode1: step.mode1, mode2: 1 });
            }
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
          })
      : login(data)
          .then((response) => {
            if (response?.data?.isLogged) {
              setIsSending(false);
            }
            const accessToken = response?.data?.accessToken;
            const sys_role = response?.data?.sys_role;
            const to = "/" + sys_role;
            setAuth({ sys_role, accessToken });
            navigate(to, { replace: true });
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
  };
  return (
    <div className="sign-in">
      <div className="left col-l-6 col-s-12">
        <div className="head display-flex justify-content-space-between">
          <Link to="/" className="link">
            <img
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt="log-app"
              className="logo"
            />
          </Link>
        </div>
        <form className="body m-auto" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="title t-1">Welcome back!</h1>
          <p className="title t-2">Get connected and manage your Wallet...</p>
          <div className="sign-mode">
            <button
              className={signMode === 0 ? "button active" : "button"}
              onClick={() => setSignMode(0)}
            >
              Sign In with QR Code
            </button>
            <button
              className={signMode === 1 ? "button active" : "button"}
              onClick={() => setSignMode(1)}
            >
              Sign In with Classic mode
            </button>
          </div>
          <div className={classNameMsg}>
            <span>{responseMessage}</span>
          </div>
          {signMode === 0 && (
            <div className="qrcode-mode">
              {step.mode2 === 0 && (
                <button className="button">Get started</button>
              )}
              <div className="qrcode-refresh">
                <p className="title t-2">QRCode expired</p>
                <button className="button">Refresh</button>
              </div>
              <div className="qrcode">
                <QRCode
                  value="BSA-Wallet"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          )}
          {signMode === 1 && (
            <>
              {step.mode1 === 0 && (
                <div className="input-div">
                  <label htmlFor="telephone" className="label">
                    Phone number
                  </label>
                  <PhoneInput
                    country={"cd"}
                    // inputProps={{ required: true }}
                    {...register("telephone")}
                    inputStyle={{ width: "100%" }}
                  />
                  {errors.telephone && (
                    <span className="fade-in">{errors.telephone.message}</span>
                  )}
                </div>
              )}
              {step.mode1 === 1 && (
                <div className="section">
                  <div className="input-div">
                    <input
                      type="text"
                      className="input-form"
                      autoComplete="none"
                      placeholder=" "
                      {...register("code")}
                    />
                    <label htmlFor="code" className="label-form">
                      Code
                    </label>
                    {errors.code && (
                      <span className="fade-in">{errors.code.message}</span>
                    )}
                  </div>
                  <div className="input-div">
                    <input
                      type="text"
                      className="input-form"
                      autoComplete="none"
                      placeholder=" "
                      {...register("bsa")}
                    />
                    <label htmlFor="bsa" className="label-form">
                      BSA
                    </label>
                    {errors.bsa && (
                      <span className="fade-in">{errors.bsa.message}</span>
                    )}
                  </div>
                </div>
              )}
              <button
                type={isSending ? "button" : "submit"}
                className={isSending ? "button normal" : "button validate"}
              >
                {isSending ? "Connexion..." : "Next"}
              </button>
            </>
          )}
        </form>
        <div className="foot display-flex justify-content-center align-items-center">
          <span>Do not have account yet ?</span>
          <Link to="/register" className="link">
            Sing Up at
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
          <p className="title t-1">Manage your BSA-Wallet easily...</p>
          <img
            src={process.env.PUBLIC_URL + "/pic-1.png"}
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
  );
};
export default Login;
