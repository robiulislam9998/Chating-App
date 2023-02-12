import { React, useState, useEffect } from "react";
import { getDatabase, ref, onValue, push, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

const UserList = () => {
  const db = getDatabase();
  let auth = getAuth();
  let [userslist, setUserslist] = useState([]);
  let [friend, setFriendlist] = useState([]);
  let [friends, setFriends] = useState([]);
  let [block, setBlock] = useState([]);

  useEffect(() => {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.key !== auth.currentUser.uid) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setUserslist(arr);
    });
  }, []);

  let handleSendRequest = (item) => {
    set(push(ref(db, "FriendRequest")), {
      sendername: auth.currentUser.displayName,
      senderid: auth.currentUser.uid,
      recivername: item.name,
      reciverid: item.id,
    });
  };

  useEffect(() => {
    const friendRef = ref(db, "FriendRequest/");
    onValue(friendRef, (snapshot) => {
      let friendArr = [];
      snapshot.forEach((item) => {
        friendArr.push(item.val().reciverid + item.val().senderid);
      });
      setFriendlist(friendArr);
    });
  }, []);

  useEffect(() => {
    const friendRef = ref(db, "friends/");
    onValue(friendRef, (snapshot) => {
      let friendArr = [];
      snapshot.forEach((item) => {
        friendArr.push(item.val().reciverid + item.val().senderid);
      });
      setFriends(friendArr);
    });
  }, []);

  useEffect(() => {
    const friendssRef = ref(db, "Blockuser/");
    onValue(friendssRef, (snapshot) => {
      let friendsArr = [];
      snapshot.forEach((item) => {
        friendsArr.push(item.val().blockbyid + item.val().blockid);
      });
      setBlock(friendsArr);
    });
  }, []);

  return (
    <div className="shadow-sm shadow-black p-5 h-[427px] overflow-y-scroll rounded-xl mt-5">
      <h3 className="font-nunito font-semibold font-xl">User List</h3>
      {userslist.map((item) => (
        <div className="flex justify-between items-center border-b border-solid border-black pb-2.5 m-5">
          <img
            src="images/chatimg.png"
            className="w-[70px] h-[70px] rounded-full "
          />

          <div>
            <h3 className="font-nunito font-semibold text-lg">{item.name}</h3>
            <p className="font-nunito font-semibold text-sm text-[#4D4D4DBF]">
              hi am Robiul Islam
              {/* {item.email} */}
            </p>
          </div>
          <div>
            {friends.includes(item.id + auth.currentUser.uid) ||
            friends.includes(auth.currentUser.uid + item.id) ? (
              <Link to="/massege">
                <button className="font-nunito font-bold text-white text-lg bg-primary p-1.5 w-[107px] rounded">
                  Message
                </button>
              </Link>
            ) : friend.includes(item.id + auth.currentUser.uid) ||
              friend.includes(auth.currentUser.uid + item.id) ? (
              <button className="font-nunito font-bold text-white text-lg bg-primary p-1.5 w-[107px] rounded">
                Pending
              </button>
            ) : block.includes(item.id + auth.currentUser.uid) ||
              block.includes(auth.currentUser.uid + item.id) ? (
              <h3 className="font-nunito font-bold text-lg text-red-500">
                Block
              </h3>
            ) : (
              <button
                onClick={() => handleSendRequest(item)}
                className="font-nunito font-bold text-white text-lg bg-primary p-1.5 w-[107px] rounded"
              >
                Add Friend
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
