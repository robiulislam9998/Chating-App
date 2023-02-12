import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  let [email, setEmail] = useState("");
  let [erremail, setErremail] = useState("");
  let [password, setPassword] = useState("");
  let [errpassword, setErrpassword] = useState("");
  let [show, setShow] = useState(false);
  let [ferr, setFerr] = useState("");
  let [success, setSuccess] = useState("");
  let [loading, setLoading] = useState(false);
  let [forgetshow, setForgetshow] = useState(false);
  let [forgetemail, setForgetemail] = useState("");
  let [forgetloading, setForgetloading] = useState(false);
  let [forgeterremail, setForgeterremail] = useState("");

  // google login
  let handleGoogleLogin = () => {
    signInWithPopup(auth, provider).then(() => {
      navigate("/");
    });
  };

  // submit email and password
  let handleEmail = (e) => {
    setEmail(e.target.value);
    setErremail("");
  };

  let handlePassword = (e) => {
    setPassword(e.target.value);
    setErrpassword("");
    setFerr("");
  };

  let handleSubmit = () => {
    if (!email) {
      setErremail("please inter the email");
    } else {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setErremail("please enter the valid email");
      }
    }
    if (!password) {
      setErrpassword("password is required");
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        toast("Login Successful");

        setSuccess("Login Successful");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })

      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        if (errorCode.includes("auth/wrong-password")) {
          setFerr("Wrong Password");
        }
        if (errorCode.includes("auth/user-not-found")) {
          setFerr("Email not macth");
        }
        setLoading(false);
      });
  };
  // password show
  let handlepassshow = () => {
    setShow(!show);
  };

  //forget password
  let handleForgetEmail = (e) => {
    setForgetemail(e.target.value);
    setForgeterremail("");
  };

  let handleForget = () => {
    setForgetloading(true);
    sendPasswordResetEmail(auth, forgetemail)
      .then(() => {
        toast("Please Check Your Email");
        setTimeout(() => {
          setForgetshow(false);
        }, 2000);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        if (errorCode.includes("auth/network-request-failed")) {
          setForgeterremail("Chack your internet connection");
        }

        if (errorCode.includes("auth/missing-email")) {
          setForgeterremail("Email Not Macth");
        }
        setForgetloading(false);
      });
  };

  return (
    <div className="flex px-2.5 md:px-0 mt-5 sml:mt-0 ">
      <ToastContainer position="bottom-center" theme="dark" />
      <div className="md:w-1/2 flex flex-col items-end sml:mr-[69px] justify-center">
        <div className="xl">
          <h2 className="font-nunito font-bold text-4xl sml:text-[22px] text-center sml:text-left">
            Login to your account!
          </h2>
          {/* google login */}
          <img
            className=" mr-auto m-auto sml:mr-0 sml:ml-0 mt-5 cursor-pointer"
            src="images/google.png"
            onClick={handleGoogleLogin}
          />
          {ferr && (
            <p className="font-nunito font-semibold font-sm bg-red-500 text-white p-1 rounded mt-2.5">
              {ferr}
            </p>
          )}
          {/* email and password box */}
          <div className="sml:w-[370px]">
            <div className="relative">
              <input
                className="border-b border-solid border-black w-full  py-6 sml:p-4 md:!px-6 md:!py-6 mt-9 sml:mt-4 md:!mt-9 outline-0"
                type="email"
                onChange={handleEmail}
              />
              <p className="font-nunito font-semibold font-sm absolute top-6 sml:top-1 md:!top-6  bg-white px-2.5 text-[#11175D]">
                Email Address
              </p>

              <p className="font-nunito font-semibold font-sm text-red-500 p-1 mt-2">
                {erremail}
              </p>
            </div>

            <div className="relative">
              <input
                className="border-b border-solid border-black w-full  py-6 sml:p-4 md:!px-6 md:!py-6 mt-9 sml:mt-4 md:!mt-9 outline-0"
                type={show ? "text" : "password"}
                onChange={handlePassword}
              />
              <p className="font-nunito font-semibold font-sm absolute top-6 sml:top-1 md:!top-6 bg-white px-2.5 text-[#11175D]">
                Password
              </p>
              {/* password show */}
              {show ? (
                <BsEyeFill
                  onClick={handlepassshow}
                  className="absolute top-16 sml:top-9 md:!top-16 right-5"
                />
              ) : (
                <BsEyeSlashFill
                  onClick={handlepassshow}
                  className="absolute top-16 sml:top-9 md:!top-16 right-5"
                />
              )}

              <p className="font-nunito font-semibold font-sm text-red-500 p-1 mt-2">
                {errpassword}
              </p>
            </div>
            {/* loading treedots */}
            {loading ? (
              <div className="ml-[140px] mt-12">
                <ThreeDots
                  height="60"
                  width="60"
                  radius="9"
                  color="#4fa94d"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                className="w-full text-center bg-primary rounded-lg py-5 font-nunito font-semibold font-xl text-white mt-8"
              >
                Login to Continue
              </button>
            )}
            {/* sign up */}
            <p className="font-nunito font-regular font-sm w-full mt-5 pl-[20px]">
              Don’t have an account ?
              <Link className="font-bold text-[#EA6C00]" to="/registration">
                Sign up
              </Link>
            </p>
            {/* forgetpassword */}
            <p className="font-nunito font-regular font-sm w-full mt-1 pl-[20px] text-center">
              <button
                onClick={() => setForgetshow(!forgetshow)}
                className="font-bold text-[#EA6C00]"
                to="/forgetpassword"
              >
                Forget Password
              </button>
            </p>
          </div>
        </div>
      </div>
      {/* picture */}
      <div className="w-1/2 hidden sml:block">
        <picture>
          <img
            className="sml:h-auto md:!h-screen w-full object-cover"
            src="images/loginimg.webp"
            loading="lazy"
          />
        </picture>
      </div>

      {/* forget password box */}
      {forgetshow && (
        <div className="w-full h-screen bg-primary flex justify-center items-center fixed">
          <div className="p-8 bg-white rounded">
            <h1 className="text-4xl text-primary font-blod font-nunito">
              Forget Password
            </h1>

            <div className="relative">
              <input
                className="border border-solid border-black w-full rounded-lg px-6 py-6 sml:p-4 md:!px-6 md:!py-6 mt-9 sml:mt-4 md:!mt-9 outline-0"
                type="email"
                placeholder="Email Address"
                onChange={handleForgetEmail}
              />
              <p className="font-nunito font-semibold font-sm absolute top-6 sml:top-1 md:!top-6 left-8 bg-white px-2.5 text-[#11175D]">
                Email Address
              </p>

              <p className="font-nunito font-semibold font-sm  text-red-500 p-1 mt-2.5">
                {forgeterremail}
              </p>
            </div>
            <button
              onClick={() => setForgetshow(false)}
              className="text-center bg-red-500  rounded-[10px] p-5 font-nunito font-semibold font-xl text-white mt-6 sml:mt-4 md:!mt-6"
            >
              Cancel
            </button>
            {/* treedot loading */}
            {forgetloading ? (
              <div className="ml-[140px] mt-[-60px]">
                <ThreeDots
                  height="60"
                  width="60"
                  radius="9"
                  color="#4fa94d"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            ) : (
              <button
                onClick={handleForget}
                className="text-center bg-primary ml-4 rounded-[10px] p-5 font-nunito font-semibold font-xl text-white mt-6 sml:mt-4 md:!mt-6"
              >
                Change Password
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
