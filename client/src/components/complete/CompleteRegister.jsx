import React from "react";

const CompleteRegister = () => {
  return (
    <div className="complete-register">
      <div className="container">
        <h1 className="title t-1">Complete your Registration</h1>
        <p className="title t-3">
          Complete your personal informations and setup your the way to get
          access to your account.
        </p>
        <form>
          <div className="wrapper">
            <div className="left">
              <h3 className="title t-2">Personal Information</h3>
              <div className="input-div">
                <input
                  type="text"
                  className="input-form"
                  autoComplete="none"
                  placeholder=" "
                  // {...register("firstname")}
                />
                <label htmlFor="firstname" className="label-form">
                  First name
                </label>
                {/* {errors.firstname && (
                  <span className="fade-in">{errors.firstname.message}</span>
                )} */}
              </div>
              <div className="input-div">
                <input
                  type="text"
                  className="input-form"
                  autoComplete="none"
                  placeholder=" "
                  // {...register("lastname")}
                />
                <label htmlFor="lastname" className="label-form">
                  Last name
                </label>
                {/* {errors.lastname && (
                  <span className="fade-in">{errors.lastname.message}</span>
                )} */}
              </div>
            </div>
            <div className="right">
              <h3 className="title t-2">Authentication setup</h3>
            </div>
          </div>
          <button className="button">Validate & Finish</button>
        </form>
      </div>
    </div>
  );
};

export default CompleteRegister;
