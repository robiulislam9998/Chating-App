import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { ThreeDots } from "react-loader-spinner";
import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {
  const auth = getAuth();
  const db = getDatabase();
  let navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [fullname, setFullname] = useState("");
  let [password, setPassword] = useState("");
  let [erremail, setErremail] = useState("");
  let [errfullname, setErrFullname] = useState("");
  let [errpassword, setErrpassword] = useState("");
  let [show, setShow] = useState(false);
  let [ferr, setFerr] = useState("");
  let [success, setSuccess] = useState("");
  let [loading, setLoading] = useState(false);

  let handleEmail = (e) => {
    setEmail(e.target.value);
    setErremail("");
    setFerr("");
  };

  let handleFullname = (e) => {
    setFullname(e.target.value);
    setErrFullname("");
  };

  let handlePassword = (e) => {
    setPassword(e.target.value);
    setErrpassword("");
  };

  let handleSubmit = () => {
    if (!email) {
      setErremail("email is required");
    } else {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setErremail("please enter the valid email");
      }
    }
    if (!fullname) {
      setErrFullname("fullname is required");
    } else {
      if (fullname.length < 3) {
        setErrFullname("fullname must be 3 letter");
      }
    }
    if (!password) {
      setErrpassword("password is required");
    } else {
      if (!/^(?=.*?[a-z])/.test(password)) {
        setErrpassword("At least one lower & upper case English letter");
      } else if (!/^(?=.*?[A-Z])/.test(password)) {
        setErrpassword("At least one upper case English letter");
      } else if (!/^(?=.*?[#?!@$%^&*-])/.test(password)) {
        setErrpassword("At least one special character");
      } else if (!/^(?=.*?[0-9])/.test(password)) {
        setErrpassword("At least one digit");
      } else if (!/^.{8,}/.test(password)) {
        setErrpassword("Minimum 8 characters long");
      }

      if (
        email &&
        password &&
        fullname &&
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) &&
        /^(?=.*?[a-z])/.test(password) &&
        /^(?=.*?[A-Z])/.test(password) &&
        /^(?=.*?[#?!@$%^&*-])/.test(password) &&
        /^(?=.*?[0-9])/.test(password) &&
        /^.{8,}/.test(password)
      ) {
        setLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
          .then((user) => {
            updateProfile(auth.currentUser, {
              displayName: fullname,
              photoURL: "images/profilei.jpg",
            })
              .then(() => {
                console.log(user);
                sendEmailVerification(auth.currentUser)
                  .then(() => {
                    setLoading(false);
                    setSuccess(
                      "Registration Successful. Please Verify Your Email"
                    );
                  })
                  .then(() => {
                    set(ref(db, "users/" + user.user.uid), {
                      name: user.user.displayName,
                      email: user.user.email,
                      photoURL: user.user.photoURL,
                    })
                      .then(() => {
                        setTimeout(() => {
                          navigate("/login");
                        }, 1000);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            const errorCode = error.code;
            if (errorCode.includes("auth/email-already-in-use"))
              setFerr("Email in Already Used");
            setLoading(false);
          });
      }
    }
  };

  let handlepassshow = () => {
    setShow(!show);
  };

  return (
    <div className="flex px-2.5 md:px-0 mt-5 sml:mt-0">
      <div className="md:w-1/2 flex flex-col items-end sml:mr-[69px] justify-center">
        <div className="xl">
          <h2 className="font-nunito font-bold  text-4xl sml:text-[22px] text-center sml:text-left">
            Get started with easily register
          </h2>
          <p className="font-nunito font-regular text-xl sml:text-sm mt-2.5 sml:mt-0 text-slate-400 text-center sml:text-left">
            Free register and you can enjoy it
          </p>
          <p className="font-nunito font-semibold font-sm text-green-500 p-1 mt-2">
            {success}
          </p>
          <div className="md:w-[370px]">
            <div className="relative">
              <input
                className="border border-solid border-black w-full rounded-lg px-6 py-6 sml:p-4 md:!px-6 md:!py-6 mt-9 sml:mt-4 md:!mt-9 outline-0"
                type="email"
                onChange={handleEmail}
              />
              <p className="font-nunito font-semibold font-sm absolute top-6 sml:top-1 md:!top-6 left-8 bg-white px-2.5 text-[#11175D]">
                Email Address
              </p>
              <p className="font-nunito font-semibold font-sm text-red-500 p-1 mt-2">
                {erremail}
              </p>
              <p className="font-nunito font-semibold font-sm text-red-500 mt-2">
                {ferr}
              </p>
            </div>
            <div className="relative">
              <input
                className="border border-solid border-black w-full rounded-lg px-6 py-6 sml:p-4 md:!px-6 md:!py-6 mt-9 sml:mt-4 md:!mt-9 outline-0"
                type="text"
                onChange={handleFullname}
              />
              <p className="font-nunito font-semibold font-sm absolute top-6 sml:top-1 md:!top-6 left-8 bg-white px-2.5 text-[#11175D]">
                Full name
              </p>
              <p className="font-nunito font-semibold font-sm text-red-500 p-1 mt-2">
                {errfullname}
              </p>
            </div>
            <div className="relative">
              <input
                className="border border-solid border-black w-full rounded-lg px-6 py-6 sml:p-4 md:!px-6 md:!py-6 mt-9 sml:mt-4 md:!mt-9 outline-0"
                type={show ? "text" : "password"}
                onChange={handlePassword}
              />
              <p className="font-nunito font-semibold font-sm absolute top-6 sml:top-1 md:!top-6 left-8 bg-white px-2.5 text-[#11175D]">
                Password
              </p>
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
                className="w-full text-center bg-primary rounded-[86px] py-5 font-nunito font-semibold font-xl text-white mt-12 sml:mt-4 md:!mt-12"
              >
                Sign up
              </button>
            )}
            {/* sign in */}
            <p className="font-nunito font-regular font-sm w-full text-center mt-9 sml:mt-4 md:!mt-9">
              Already have an account ?{" "}
              <Link className="font-bold text-[#EA6C00]" to="/login">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* picture registration */}
      <div className="w-1/2 hidden sml:block">
        <picture>
          <img
            className="sml:h-auto md:!h-screen w-full object-cover"
            src="images/registration.webp"
            loading="lazy"
          />
        </picture>
      </div>
    </div>
  );
};
export default Registration;
