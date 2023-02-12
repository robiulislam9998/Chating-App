import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  DataSnapshot,
} from "firebase/database";
import { getAuth } from "firebase/auth";
const Group = () => {
  let db = getDatabase();
  let auth = getAuth();
  let [cgroup, setCgroup] = useState(false);
  let [gname, setGname] = useState("");
  let [gtag, setGtag] = useState("");
  let [grouplist, setGrouplist] = useState([]);
  let [friends, setFriends] = useState([]);
  let [friendg, setFriendg] = useState([]);

  let handleCgroup = () => {
    set(push(ref(db, "Group")), {
      gname: gname,
      gtag: gtag,
      adminname: auth.currentUser.displayName,
      adminid: auth.currentUser.uid,
    }).then(() => {
      setCgroup(false);
    });
  };

  useEffect(() => {
    const usersRef = ref(db, "Group/");
    onValue(usersRef, (Snapshot) => {
      let arr = [];
      Snapshot.forEach((item) => {
        if (item.val().adminid != auth.currentUser.uid) {
          arr.push({ ...item.val(), gid: item.key });
        }
      });
      setGrouplist(arr);
    });
  }, []);

  let handlegroupreq = (item) => {
    set(push(ref(db, "Groupjoinrequset")), {
      adminid: item.adminid,
      gid: item.gid,
      gname: item.gname,
      gtag: item.gtag,
      username: auth.currentUser.displayName,
      userid: auth.currentUser.uid,
      userprofile: auth.currentUser.photoURL,
    });
  };

  useEffect(() => {
    const friendRef = ref(db, "Groupjoinrequset/");
    onValue(friendRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().userid + item.val().gid);
      });
      setFriends(arr);
    });
  }, []);

  useEffect(() => {
    const friendRef = ref(db, "groupmember/");
    onValue(friendRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().userid + item.val().gid);
      });
      setFriendg(arr);
    });
  }, []);

  return (
    <div className="shadow-sm shadow-black p-5 h-[427px] overflow-y-scroll rounded-xl mt-5">
      <h3 className="font-nunito font-semibold font-xl flex justify-between">
        Groups List
        <button
          onClick={() => setCgroup(!cgroup)}
          className="font-nunito font-normal text-white text-lg bg-primary p-1.5 w-[130px] rounded"
        >
          {cgroup ? "Go Back" : "Create Group"}
        </button>
      </h3>
      {cgroup ? (
        <>
          <input
            onChange={(e) => setGname(e.target.value)}
            className="border border-solid border-black w-full rounded-lg  sml:p-4  mt-9 sml:mt-4 md:!mt-9 outline-0"
            type="email"
            placeholder="Group Name"
          />
          <input
            onChange={(e) => setGtag(e.target.value)}
            className="border border-solid border-black w-full rounded-lg  sml:p-4  mt-4 sml:mt-4 md:!mt-4 outline-0"
            type="email"
            placeholder="Tag"
          />
          <button
            onClick={handleCgroup}
            className="w-full text-center bg-primary rounded-[11px] py-2.5 font-nunito font-semibold font-xl text-white mt-2 sml:mt-4 md:!mt-4"
          >
            Sign up
          </button>
        </>
      ) : (
        <>
          {grouplist.length == 0 ? (
            <p className="bg-green-500 p-2.5 rounded text-center text-2xl text-white mt-5">
              Please Create Group
            </p>
          ) : (
            grouplist.map((item) => (
              <div className="flex justify-between items-center border-b border-solid border-black pb-2.5 m-5">
                <img
                  src="images/chatimg.png"
                  className="w-[70px] h-[70px] rounded "
                />

                <div>
                  <h3 className="font-nunito font-semibold text-lg">
                    {item.gname}
                  </h3>
                  <p className="font-nunito font-semibold text-sm text-[#4D4D4DBF]">
                    {item.gtag}
                  </p>
                </div>
                <div>
                  {friends.includes(item.gid + auth.currentUser.uid) ||
                  friends.includes(auth.currentUser.uid + item.gid) ? (
                    <button className="font-nunito font-bold text-white text-lg bg-primary p-1.5 w-[107px] rounded">
                      Panding
                    </button>
                  ) : friendg.includes(item.gid + auth.currentUser.uid) ||
                    friendg.includes(auth.currentUser.uid + item.gid) ? (
                    <button className="font-nunito font-bold text-white text-lg bg-primary p-1.5 w-[107px] rounded">
                      Massege
                    </button>
                  ) : (
                    <button
                      onClick={() => handlegroupreq(item)}
                      className="font-nunito font-bold text-white text-lg bg-primary p-2 rounded w-[87px]"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Group;
