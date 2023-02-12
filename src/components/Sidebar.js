import { React, useState, useRef, storageRef } from "react";
import { TfiHome } from "react-icons/tfi";
import { TbMessageCircle } from "react-icons/tb";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { BsUpload } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

import { CirclesWithBar } from "react-loader-spinner";

const Sidebar = ({ active }) => {
  const auth = getAuth();
  const storage = getStorage();

  let navigate = useNavigate();
  let [show, setShow] = useState(false);
  let [loader, setLoader] = useState(false);

  let [img, setImg] = useState("");
  let [imgname, setImgname] = useState("");

  let [pimg, setPimg] = useState("");
  const [cropper, setCropper] = useState();

  const cropperRef = useRef(null);
  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    setPimg(cropper.getCroppedCanvas().toDataURL());
  };

  let handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };
  let handleImgUpload = () => {
    setShow(!show);
    setImg("");
    setPimg("");
  };

  let handleSelectImage = (e) => {
    setImgname(e.target.files[0].name);

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImg(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    setLoader(true);
    const storageRef = ref(storage, imgname);
    if (typeof cropper !== "undefined") {
      cropper.getCroppedCanvas().toDataURL();
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          })
            .then(() => {
              console.log("update");
              setLoader(false);
              setShow(false);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    }
  };

  return (
    <div className="w-full bg-primary p-2.5 xl:py-9 xl:px-11 xl:rounded-3xl overflow-x-hidden gap-x-5 sm:gap-x-0 flex xl:flex-col fixed bottom-0 xl:static">
      <div className="relative group ">
        <img
          src={auth.currentUser.photoURL}
          className="w-[50px] sm:max-w-[100px] h-[50px] xl:w-[100px] xl:h-[100px] rounded-full"
        />
        <div className="w-[50px] h-[50px] xl:w-[100px] xl:h-[100px] rounded-full absolute top-0 left-0 flex justify-center items-center hidden group-hover:flex">
          <BsUpload
            className="text-black text-2xl bg-green-500 "
            onClick={handleImgUpload}
            type="file"
          />
        </div>
      </div>
      <h4 className="text-white font-bold font-nunito text-xl mt-1 text-center">
        {auth.currentUser.displayName}
      </h4>
      <div className="flex xl:flex-col items-center text-white gap-x-5 xl:gap-y-16 xl:mt-12">
        <div
          className={`${
            active == "home" &&
            "relative z-10  after:absolute after:top-0 after:left-0 after:bg-white xl:after:w-[242%] after:h-full after:content-[''] text-center flex flex-col items-center after:z-[-1] xl:p-10 after:rounded-2xl before:absolute before:top-0 before:right-[-32px] before:rounded xl:before:bg-primary xl:before:w-[15px] before:h-full before:content-[''] before:shadow-lg shadow-cyan-500/50"
          }`}
        >
          <Link to="/">
            <TfiHome
              className={`${
                active == "home"
                  ? "text-3xl xl:text-5xl xl:text-primary"
                  : "text-3xl xl:text-5xl text-white"
              }`}
            />
          </Link>
        </div>

        <div
          className={`${
            active == "massege" &&
            "relative z-10  after:absolute after:top-0 after:left-0 after:bg-white xl:after:w-[242%] after:h-full after:content-[''] text-center flex flex-col items-center after:z-[-1] xl:p-10 after:rounded-2xl before:absolute before:top-0 before:right-[-32px] before:rounded xl:before:bg-primary xl:before:w-[15px] before:h-full before:content-[''] before:shadow-lg shadow-cyan-500/50"
          }`}
        >
          {" "}
          <Link to="/massege">
            <TbMessageCircle
              className={`${
                active == "massege"
                  ? "text-3xl xl:text-5xl xl:text-primary"
                  : "text-3xl xl:text-5xl text-white"
              }`}
            />
          </Link>
        </div>
        <Link>
          <IoNotificationsOutline className="text-3xl xl:text-4xl" />
        </Link>

        <IoSettingsOutline className="text-3xl xl:text-4xl" />
        <MdLogout
          onClick={handleSignOut}
          className="text-3xl xl:text-4xl xl:mt-[4.5rem] xl:mr-2"
        />
      </div>
      {/* image upload modal */}
      {show && (
        <div className="w-full h-screen bg-primary flex justify-center items-center fixed top-[0] left-[0] z-[999]">
          <div className="p-8 bg-white rounded">
            <h1 className="text-4xl text-primary font-blod font-nunito">
              Image Upload
            </h1>

            <div className="relative">
              {pimg ? (
                <img
                  src={pimg}
                  className="w-[50px] h-[50px] xl:w-[100px] xl:h-[100px] rounded-full"
                />
              ) : (
                <img
                  src={auth.currentUser.photoURL}
                  className="w-[50px] h-[50px] xl:w-[100px] xl:h-[100px] rounded-full"
                />
              )}
              <input
                className="border border-solid border-black w-full rounded-lg px-6 py-6 sml:p-4 md:!px-6 md:!py-6 mt-9 sml:mt-4 md:!mt-9 outline-0"
                type="file"
                onChange={handleSelectImage}
              />

              <p className="font-nunito font-semibold font-sm  text-red-500 p-1 mt-2.5"></p>
            </div>

            <Cropper
              src={img}
              // Cropper.js options
              style={{ height: 100, maxWidth: 100 }}
              initialAspectRatio={16 / 9}
              guides={false}
              crop={onCrop}
              ref={cropperRef}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
            />
            {loader ? (
              <CirclesWithBar
                height="100"
                width="100"
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                outerCircleColor=""
                innerCircleColor=""
                barColor=""
                ariaLabel="circles-with-bar-loading"
              />
            ) : (
              <>
                <button
                  className="text-center bg-red-500  rounded-[10px] p-5 font-nunito font-semibold font-xl text-white mt-6 sml:mt-4 md:!mt-6"
                  onClick={handleImgUpload}
                >
                  Cancel
                </button>

                <button
                  className="text-center bg-primary ml-4 rounded-[10px] p-5 font-nunito font-semibold font-xl text-white mt-6 sml:mt-4 md:!mt-6"
                  onClick={getCropData}
                >
                  Upload
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
