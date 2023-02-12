import React, { useEffect, useState } from "react";

import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  DataSnapshot,
  Database,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { activeChat } from "../slices/activeChat";
import { Link } from "react-router-dom";
const JoinGroupList = () => {
  let db = getDatabase();
  let auth = getAuth();
  let dispatch = useDispatch();

  let [jgl, setJgl] = useState([]);
  let [gml, setGml] = useState([]);

  useEffect(() => {
    const usersref = ref(db, "Group");
    onValue(usersref, (Snapshot) => {
      let arr = [];
      Snapshot.forEach((item) => {
        if (item.val().adminid == auth.currentUser.uid) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setJgl(arr);
    });
  }, []);

  useEffect(() => {
    const usersref = ref(db, "groupmember");
    onValue(usersref, (Snapshot) => {
      let arr = [];
      Snapshot.forEach((item) => {
        if (auth.currentUser.uid == item.val().userid) {
          arr.push(item.val());
        }
      });
      setGml(arr);
    });
  }, []);

  let handleActiveChat = (item) => {
    console.log("gid", item);
    console.log("group info", item);
    let userinfo = {
      status: "Group",
      name: item.gname,
      // gid: item.key,
      gid: auth.currentUser.uid == item.adminid ? item.key : item.gid,
    };
    dispatch(activeChat(userinfo));
  };

  return (
    <div className="shadow-sm shadow-black p-5 h-screen md:w-[43%] overflow-y-scroll rounded-xl mt-5">
      <Link to="/chat">
        <h3 className="font-nunito font-semibold font-xl flex justify-between">
          Join Group
        </h3>
        {jgl.map((item) => (
          <div
            onClick={() => handleActiveChat(item)}
            className="flex gap-x-4 items-center border-b border-solid border-black pb-2.5 m-5"
          >
            <img
              src="images/chatimg.png"
              className="w-[70px] h-[70px] rounded "
            />

            <div>
              {/* <span>hdfhg</span> */}
              <h3 className="font-nunito font-semibold text-lg">
                {item.gname}
              </h3>
              <p className="font-nunito font-semibold text-sm text-[#4D4D4DBF]">
                {item.gtag}
              </p>
            </div>
          </div>
        ))}
        {gml.map((item) => (
          <div
            onClick={() => handleActiveChat(item)}
            className="flex gap-x-4 items-center border-b border-solid border-black pb-2.5 m-5"
          >
            <img
              src="images/chatimg.png"
              className="w-[70px] h-[70px] rounded "
            />

            <div>
              {/* <span>hdfhg</span> */}
              <h3 className="font-nunito font-semibold text-lg">
                {item.gname}
              </h3>
              <p className="font-nunito font-semibold text-sm text-[#4D4D4DBF]">
                {item.gtag}
              </p>
            </div>
          </div>
        ))}
      </Link>
    </div>
  );
};

export default JoinGroupList;
