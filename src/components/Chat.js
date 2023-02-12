import React, { useState, useEffect, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import { useSelector } from "react-redux";
import { TfiGallery } from "react-icons/tfi";
import { GoFileMedia } from "react-icons/go";
import { BsEmojiSmile, BsArrowLeft, BsFileArrowUp } from "react-icons/bs";

import {
  MdOutlineFlipCameraIos,
  MdOutlineKeyboardVoice,
  GiLoveHowl,
} from "react-icons/gi";
import {
  getDatabase,
  push,
  ref,
  set,
  onValue,
  remove,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import moment from "moment/moment";
import {
  getStorage,
  ref as sref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import EmojiPicker from "emoji-picker-react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { Link } from "react-router-dom";

const Chat = () => {
  const db = getDatabase();
  const auth = getAuth();
  const storage = getStorage();

  const storageRef = sref(storage, "some-child");
  let [audio, setAudio] = useState("");
  let [audiodata, setAudioData] = useState("");
  const recorderControls = useAudioRecorder();
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioData(blob);
    setAudio(url);
  };

  let [msg, setMsg] = useState("");
  let [singlemsg, setSinglemsg] = useState([]);
  let [groupmsg, setGroupmsg] = useState([]);
  let [show, setShow] = useState(false);
  let [iconshow, setIconshow] = useState(false);

  let [file, setFile] = useState("");
  let [pro, setPro] = useState("");
  let [emojishow, setEmojishow] = useState(false);

  let data = useSelector((state) => state.activeChat.value);

  let handleMsgtype = (e) => {
    setMsg(e.target.value);
    setIconshow(true);
  };

  let handleAudiosend = () => {
    uploadBytes(storageRef, audiodata).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        console.log("File available at", downloadURL);

        if (data.status == "Group") {
          set(push(ref(db, "groupmsg/")), {
            whosendid: auth.currentUser.uid,
            whosendname: auth.currentUser.displayName,
            whorecevid: data.gid,
            whorecevname: data.name,
            audios: downloadURL,
            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          });
        } else
          set(push(ref(db, "singlemsg")), {
            whosendid: auth.currentUser.uid,
            whosendname: auth.currentUser.displayName,
            whorecevid: data.id,
            whorecevname: data.name,
            audios: downloadURL,
            date: `${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          }).then(() => {
            setAudio("");
          });
      });
    });
  };

  let handleSend = () => {
    if (data.status == "Group") {
      set(push(ref(db, "groupmsg/")), {
        whosendid: auth.currentUser.uid,
        whosendname: auth.currentUser.displayName,
        whorecevid: data.gid,
        whorecevname: data.name,
        msg: msg,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
      }).then(() => {
        setMsg("");
        setIconshow(false);
      });
    } else {
      set(push(ref(db, "singlemsg/")), {
        whosendid: auth.currentUser.uid,
        whosendname: auth.currentUser.displayName,
        whorecevid: data.id,
        whorecevname: data.name,
        msg: msg,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
      }).then(() => {
        setMsg("");
        setIconshow(false);
      });
    }
    if (emojishow) {
      setEmojishow(false);
    }
  };

  useEffect(() => {
    const singlemsgtRef = ref(db, "singlemsg/");
    onValue(singlemsgtRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().whosendid == auth.currentUser.uid &&
            item.val().whorecevid == data.id) ||
          (item.val().whosendid == data.id &&
            item.val().whorecevid == auth.currentUser.uid)
        ) {
          arr.push(item.val());
        }
      });
      setSinglemsg(arr);
    });
  }, [data.id]);
  useEffect(() => {
    const groupmsgRef = ref(db, "groupmsg/");
    onValue(groupmsgRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val());
      });
      setGroupmsg(arr);
    });
  }, [data.gid]);
  let handlesingleimgupload = (e) => {
    setFile(e.target.files[0]);
  };
  let handleimgupload = () => {
    const singleImgRef = sref(storage, "singleimages/" + file.name);
    const groupImgRef = sref(storage, "groupimages/" + file.name);

    const uploadTask = uploadBytesResumable(singleImgRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setPro(progress);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);

          if (file != "") {
            if (data.status == "Group") {
              // set(push(ref(db, "groupmsg")), {
              //   whosendid: auth.currentUser.uid,
              //   whosendname: auth.currentUser.displayName,
              //   whorecevid: data.gid,
              //   whorecevname: data.name,
              //   img: downloadURL,
              //   date: `${new Date().getFullYear()}-${
              //     new Date().getMonth() + 1
              //   }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
              // });
            } else {
              set(push(ref(db, "singlemsg")), {
                whosendid: auth.currentUser.uid,
                whosendname: auth.currentUser.displayName,
                whorecevid: data.id,
                whorecevname: data.name,
                img: downloadURL,
                date: `${new Date().getFullYear()}-${
                  new Date().getMonth() + 1
                }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
              }).then(() => {
                setShow(false);
              });
            }
          }
        });
      }
    );
  };

  return (
    <div className="bg-white md:w-[100vh] w-[59vh] h-[99vh]  md:ml-[450px] mt-[5px] border-l border-solid border-black p-2.5 shadow-md">
      <Link to="/massege">
        <p className="  text-3xl bg-[#474343] text-white w-10 text-center rounded-lg ">
          <BsArrowLeft />
        </p>
      </Link>
      <div className="flex gap-x-4 items-center border-b border-solid border-white shadow-md pb-2.5 m-5">
        <img
          src="images/chatimg.png"
          className="w-[70px] h-[70px] rounded-full "
        />

        <div>
          <p className="font-nunito font-bold text-lg">
            {data ? data.name : "Selact Name"}
          </p>
          <p className="font-nunito font-semibold text-sm text-[#4D4D4DBF]">
            Online
          </p>
        </div>
      </div>
      {/* send message */}
      <div className="md:h-[70vh] h-[62vh] bg-[#1f1e1e] overflow-y-scroll">
        {data.status == "Group"
          ? groupmsg.map((item) =>
              item.whosendid == auth.currentUser.uid
                ? item.whorecevid == data.gid && (
                    <div className=" flex justify-end mt-4">
                      <div className="mr-4 max-w-[70%]">
                        <p className="font-nunito font-medium bg-primary text-white inline-block p-2.5 rounded-xl text-lg">
                          {item.msg}
                        </p>
                        <p className="font-nunito font-medium text-[#bebebe] mt-1 text-sm">
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </div>
                    </div>
                  )
                : item.whorecevid == data.gid && (
                    <div className="mt-4 ml-2 max-w-[70%]">
                      <p className="font-nunito font-medium bg-[#F1F1F1] inline-block p-2.5 rounded-xl text-lg">
                        {item.msg}
                      </p>
                      <p className="font-nunito font-medium text-[#bebebe] mt-1 text-sm">
                        {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                      </p>
                    </div>
                  )
            )
          : singlemsg.map(
              (item) =>
                item.whosendid == auth.currentUser.uid ? (
                  item.msg ? (
                    // item.img ? (
                    <div className=" flex justify-end mt-4">
                      <div className="mt-4 ml-2 mr-2 max-w-[70%]">
                        <p className="font-nunito font-medium bg-primary text-white inline-block p-2.5 rounded-xl text-lg">
                          {item.msg}
                        </p>
                        <p className="font-nunito font-medium text-[#bebebe] mt-1 text-sm">
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </div>
                    </div>
                  ) : item.img ? (
                    <div className=" flex justify-end mt-4">
                      <div className="md:max-w-[70%] ml-40 mr-2">
                        <p className="font-nunito font-medium  text-white inline-block p-2.5 rounded-xl text-lg">
                          <img src={item.img} />
                        </p>
                        <p className="font-nunito font-medium text-[#bebebe] text-sm">
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className=" flex justify-end mt-4">
                      <div className="mt-4 ml-2 mr-2 md:max-w-[70%]">
                        <p className="font-nunito font-medium bg-primary text-white inline-block p-2.5 rounded-xl text-lg">
                          <audio controls src={item.audios}></audio>
                        </p>
                        <p className="font-nunito font-medium text-[#bebebe] mt-1 text-sm">
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </div>
                    </div>
                  )
                ) : item.msg ? (
                  //  item.img? (
                  <div className="mt-4 ml-2 max-w-[70%]">
                    <p className="font-nunito font-medium bg-[#F1F1F1] inline-block p-2.5 rounded-xl text-lg">
                      {item.msg}
                    </p>
                    <p className="font-nunito font-medium text-[#bebebe] mt-1 text-sm">
                      {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                    </p>
                  </div>
                ) : item.img ? (
                  <div className="mt-4 max-w-[70%]">
                    <p className="font-nunito font-medium  text-white inline-block p-2.5 rounded-xl text-lg">
                      <img src={item.img} />
                    </p>

                    <p className="font-nunito font-medium text-[#bebebe] text-sm">
                      {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 ml-2 max-w-[70%]">
                    <p className="font-nunito font-medium bg-[green] inline-block p-2.5 rounded-xl text-lg">
                      <audio controls src={item.audios}></audio>
                    </p>
                    <p className="font-nunito font-medium text-[#bebebe] mt-1 text-sm">
                      {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                    </p>
                  </div>
                )
              // )

              // : (
              //   <div className="mt-4 ml-2 max-w-[70%]">
              //     <p className="font-nunito font-medium bg-[#F1F1F1] inline-block p-2.5 rounded-xl text-lg">
              //       <audio controls src={item.audios}></audio>
              //     </p>
              //     <p className="font-nunito font-medium text-[#bebebe] mt-1 text-sm">
              //       {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
              //     </p>
              //   </div>
              // )
            )}
      </div>

      {audio && (
        <>
          <audio
            controls
            src={audio}
            className="absolute flex ml-[-10px]"
          ></audio>

          <div className="absolute flex mt-[10px]">
            <button
              onClick={() => setAudio("")}
              className="font-nunito font-bold text-white text-lg bg-[red]  ml-[300px] rounded w-[70px]"
            >
              remove
            </button>
            <button
              onClick={handleAudiosend}
              className="font-nunito font-bold text-white text-lg bg-primary ml-2 rounded w-[70px]"
            >
              send
            </button>
          </div>
        </>
      )}
      <div className="mt-2">
        {audio ? (
          <h3></h3>
        ) : (
          <input
            onChange={handleMsgtype}
            className="border border-solid border-primary bg-[#F1F1F1] outline-0 md:w-[70%] py-2 px-4 rounded-2xl"
            placeholder="Type Message..."
            value={msg}
          />
        )}
        {/* <MdOutlineKeyboardVoice className="text-3xl ml-[300px] mt-[-35px]" />
       <MdOutlineFlipCameraIos className="text-3xl ml-[250px] mt-[-30px]" />
        <TfiGallery className="text-3xl ml-[200px] mt-[-30px]" />
        <GoFileMedia className="text-3xl ml-[150px] mt-[-30px]" /> */}
        <div className="absolute top-[150px] right-0">
          {emojishow && (
            <EmojiPicker onEmojiClick={(a) => setMsg(msg + a.emoji)} />
          )}
        </div>
        <button>
          <BsEmojiSmile
            onClick={() => setEmojishow(!emojishow)}
            className="text-[#F5C33A] text-2xl ml-1 md:text-4xl md:ml-[500px] mt-[32px] md:mt-[-55px]"
          />
        </button>

        <IoIosSend
          onClick={handleSend}
          className="md:text-4xl text-3xl ml-[260px] md:ml-[545px] md:mt-[-60px] mt-[-40px] text-primary"
          cursor="pointer"
        />

        <BsFileArrowUp
          cursor="pointer"
          onClick={() => setShow(true)}
          className="md:text-3xl text-2xl ml-[300px] md:ml-[605px] md:mt-[-40px] mt-[-30px] text-primary"
        />
        <div className="md:text-3xl text-2xl ml-[335px] md:ml-[580px] mt-[-25px] w-[10%]">
          <AudioRecorder
            onRecordingComplete={(blob) => addAudioElement(blob)}
            recorderControls={recorderControls}
          />
        </div>
      </div>
      {show && (
        <div className="h-screen bg-[rgb(0,0,0,.6)] w-full  absolute top-0 left-0 z-30 flex justify-center items-center ">
          <div className=" bg-white rounded p-4">
            <h3 className="font-nunito text-xl mb-2"> Select Upload Image</h3>
            <input type="file" onChange={handlesingleimgupload} />
            <h3>{pro}%</h3>
            <button
              onClick={handleimgupload}
              className="font-nunito font-bold text-white text-lg bg-primary p-2 rounded w-[87px]"
            >
              Upload
            </button>
            <button
              onClick={() => setShow(false)}
              className="font-nunito font-bold text-white text-lg bg-[red] p-2 rounded w-[87px] ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
