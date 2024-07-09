import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import QRCode from "react-qr-code";
//
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchemaLoginStepOne, wait } from "../utils/utils";
//
import { login } from "../services/authentication";
import useAuth from "../hooks/context/state/useAuth";
import { BiCheck, BiRefresh } from "../middlewares/icons";
//
//
const Login = () => {
  const [step, setStep] = useState(0);
  const [loginCode, setLoginCode] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [switched, setSwitched] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [classNameMsg, setClassNameMsg] = useState("");

  const toggle = () => {
    reset();
    setSwitched(!switched);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(validationSchemaLoginStepOne),
  });

  const onSubmit = async (data) => {
    setIsSending(true);
    await wait(500);
    //
    login(data)
      .then((response) => {
        // console.log({ "1. response checking ": response });
        if (response?.data?.isLogged) {
          setIsSending(false);
          setLoginCode(response?.data?.loginCode);
          setStep(1);
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
      });
  };
  return (
    <div className="sign-in">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="s-header">
          <Link to="/" className="link">
            <img
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt="log-app"
              className="logo"
            />
          </Link>
          <h1 className="title t-1">Welcome back!</h1>
          <p className="title t-2">Get connected and manage your Wallet...</p>
        </div>
        <div className={classNameMsg}>
          <span>{responseMessage}</span>
        </div>
        {step === 0 ? (
          <div className="step">
            <div className="input-div">
              <div className="tile">
                <p className="title t-3">Sign in with</p>
                <div className="switch-wrapper">
                  <span>E-mail</span>
                  <div className="switch" onClick={toggle}>
                    <div
                      className={
                        switched
                          ? "switched switched-active"
                          : "switched switched-inactive"
                      }
                      onClick={toggle}
                    >
                      <BiCheck className="icon" />
                    </div>
                  </div>
                  <span>QR Code</span>
                </div>
              </div>
            </div>
            {!switched && (
              <>
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
                <button className="button validate">Sign In</button>
              </>
            )}
            {switched && (
              <div className="input-div">
                <div className="qr-code-wrapper">
                  <div className="inner">
                    <QRCode
                      value="BSA-Wallet Platform"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <div className="outer">
                    <BiRefresh className="icon" />
                    <button className="button">Refresh</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="step step-2">
            <h3 className="title t-2">Confirm code from your Mobile</h3>
            <h1 className="title t-1">{loginCode}</h1>
          </div>
        )}
      </form>
    </div>
  );
};
export default Login;
