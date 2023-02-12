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

const FriendRequset = () => {
  let db = getDatabase();
  let auth = getAuth();
  let [friendrequest, setFriendrequest] = useState([]);
  useEffect(() => {
    const usersRef = ref(db, "FriendRequest/");
    onValue(usersRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().reciverid == auth.currentUser.uid) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setFriendrequest(arr);
    });
  }, []);

  let handleAccept = (item) => {
    set(push(ref(db, "friends")), {
      id: item.id,
      sendername: item.sendername,
      senderid: item.senderid,
      reciverid: item.reciverid,

      recivername: item.recivername,
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
    }).then(() => {
      remove(ref(db, "FriendRequest/" + item.id));
    });
  };

  let handleCancel = (item) => {
    remove(ref(db, "FriendRequest/" + item.id));
  };
  return (
    <div className="shadow-sm shadow-black p-5 h-[427px] overflow-y-scroll rounded-xl mt-5">
      <h3 className="font-nunito font-semibold font-xl">Friend Request</h3>
      {friendrequest.length == 0 ? (
        <p className="bg-green-500 p-2.5 rounded text-center text-2xl text-white mt-5">
          No Friend Request Available
        </p>
      ) : (
        friendrequest.map((item) => (
          <div className="flex justify-between items-center border-b border-solid border-black pb-2.5 m-5">
            <img
              src="images/chatimg.png"
              className="w-[70px] h-[70px] rounded "
            />

            <div>
              <h3 className="font-nunito font-semibold text-lg">
                {item.sendername}
              </h3>
              <p className="font-nunito font-semibold text-sm text-[#4D4D4DBF]">
                {/* {item.email} */}
              </p>
            </div>
            <div>
              <button
                onClick={() => handleAccept(item)}
                className="font-nunito font-bold text-white text-lg bg-primary p-2 rounded w-[75px]"
              >
                Accept
              </button>
              <button
                onClick={() => handleCancel(item)}
                className="font-nunito font-bold text-white text-lg bg-red-500 p-2 rounded w-[75px] ml-[3px]"
              >
                Cancel
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendRequset;
