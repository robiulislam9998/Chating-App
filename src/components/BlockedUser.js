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

const BlockedUser = () => {
  let db = getDatabase();
  let auth = getAuth();
  let [friends, setFriends] = useState([]);
  useEffect(() => {
    const usersRef = ref(db, "Blockuser/");
    onValue(usersRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().blockbyid == auth.currentUser.uid) {
          arr.push({
            id: item.key,
            block: item.val().block,
            blockid: item.val().blockid,
          });
        } else {
          arr.push({
            id: item.key,
            block: item.val().blockby,
            blockbyid: item.val().blockbyid,
          });
        }
      });
      setFriends(arr);
    });
  }, []);

  let handleUnblock = (item) => {
    set(push(ref(db, "friends")), {
      sendername: item.block,
      senderid: item.blockid,
      reciverid: auth.currentUser.uid,
      recivername: auth.currentUser.displayName,
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
    }).then(() => {
      remove(ref(db, "Blockuser/" + item.id));
    });
  };

  return (
    <div className="shadow-sm shadow-black p-5 h-[427px] overflow-y-scroll rounded-xl mt-5">
      <h3 className="font-nunito font-semibold font-xl">Blocked User</h3>
      {friends.length == 0 ? (
        <p className="bg-green-500 p-2.5 rounded text-center text-2xl text-white mt-5">
          No Blocked User Available
        </p>
      ) : (
        friends.map((item) => (
          <div className="flex justify-between items-center border-b border-solid border-black pb-2.5 m-5">
            <img
              src="images/chatimg.png"
              className="w-[70px] h-[70px] rounded "
            />

            <div>
              <h3 className="font-nunito font-semibold text-lg">
                {item.block}
              </h3>
              <p className="font-nunito font-semibold text-sm text-[#4D4D4DBF]">
                {" "}
                Hello I'm Shuchona{" "}
              </p>
            </div>
            <div>
              {!item.blockbyid && (
                <button
                  onClick={() => handleUnblock(item)}
                  className="font-nunito font-bold text-white text-lg bg-primary p-2 rounded w-[87px]"
                >
                  Unblock
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BlockedUser;
