import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { BiMessage } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { activeChat } from "../slices/activeChat";
import { Link } from "react-router-dom";
const FriendsChat = (props) => {
  let db = getDatabase();
  let auth = getAuth();
  let dispatch = useDispatch();
  let [friends, setFriends] = useState([]);
  useEffect(() => {
    const usersRef = ref(db, "friends/");
    onValue(usersRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          auth.currentUser.uid == item.val().reciverid ||
          auth.currentUser.uid == item.val().senderid
        ) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
      setFriends(arr);
    });
  }, []);

  let handleBlock = (item) => {
    auth.currentUser.uid == item.senderid
      ? set(push(ref(db, "Blockuser")), {
          block: item.recivername,
          blockid: item.reciverid,
          blockby: item.sendername,
          blockbyid: item.senderid,
        }).then(() => {
          remove(ref(db, "friends/" + item.key));
        })
      : set(push(ref(db, "Blockuser")), {
          block: item.sendername,
          blockid: item.senderid,
          blockby: item.recivername,
          blockbyid: item.reciverid,
        }).then(() => {
          remove(ref(db, "friends/" + item.key));
        });
  };

  let handleActiveChat = (item) => {
    let userinfo = {};
    if (item.reciverid == auth.currentUser.uid) {
      userinfo.status = "single";
      userinfo.id = item.senderid;
      userinfo.name = item.sendername;
    } else {
      userinfo.status = "single";
      userinfo.id = item.reciverid;
      userinfo.name = item.recivername;
    }
    dispatch(activeChat(userinfo));
  };
  return (
    <div className="shadow-sm shadow-black p-5 h-screen md:w-[43%] overflow-y-scroll rounded-xl mt-5">
      <Link to="/chat">
        <h3 className="font-nunito font-semibold font-xl">Friends</h3>
        {friends.length == 0 ? (
          <p className="bg-green-500 p-2.5 rounded text-center text-2xl text-white mt-5">
            No Blocked User Available
          </p>
        ) : (
          friends.map((item) => (
            <div
              onClick={() => handleActiveChat(item)}
              className="flex justify-between items-center border-b border-solid border-black pb-2.5 m-5"
            >
              <img
                src="images/chatimg.png"
                className="w-[70px] h-[70px] rounded "
              />

              <div>
                <h3 className="font-nunito font-semibold text-lg">
                  {auth.currentUser.uid == item.senderid ? (
                    <h1>{item.recivername} </h1>
                  ) : (
                    <h1>{item.sendername} </h1>
                  )}
                </h3>
                <p className="font-nunito font-semibold text-sm text-[#4D4D4DBF]">
                  {" "}
                  Hello I'm Shuchona{" "}
                </p>
              </div>
              <div>
                {props.block ? (
                  <button
                    onClick={() => handleBlock(item)}
                    className="font-nunito font-bold text-white text-lg bg-primary p-2 rounded w-[87px]"
                  >
                    Block
                  </button>
                ) : (
                  <button className="text-primary font-bold text-3xl p-2  w-[30px]">
                    <BiMessage />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </Link>
    </div>
  );
};

export default FriendsChat;
