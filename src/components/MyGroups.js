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

const MyGroups = () => {
  let db = getDatabase();
  let auth = getAuth();
  let [mygroup, setMygroup] = useState([]);
  let [showinfo, setShowinfo] = useState(false);
  let [showlist, setShowlist] = useState(false);
  let [memberreq, setMemberreq] = useState([]);
  let [memberlist, setMemberlist] = useState([]);

  useEffect(() => {
    const usersref = ref(db, "Group");
    onValue(usersref, (Snapshot) => {
      let arr = [];
      Snapshot.forEach((item) => {
        if (item.val().adminid == auth.currentUser.uid) {
          arr.push({ ...item.val(), gid: item.key });
        }
      });
      setMygroup(arr);
    });
  }, []);

  let handleShow = (item) => {
    setShowinfo(!showinfo);
    const usersref = ref(db, "Groupjoinrequset");
    onValue(usersref, (Snapshot) => {
      let arr = [];
      Snapshot.forEach((gitem) => {
        if (
          item.adminid == auth.currentUser.uid &&
          item.gid == gitem.val().gid
        ) {
          arr.push({ ...gitem.val(), key: gitem.key });
        }
      });
      setMemberreq(arr);
    });
  };

  let handleMemberreq = (item) => {
    remove(ref(db, "Groupjoinrequset/" + item.key));
  };
  let handleMemberaccept = (item) => {
    set(push(ref(db, "groupmember")), {
      adminid: item.adminid,
      gid: item.gid,
      gname: item.gname,
      gtag: item.gtag,
      userid: item.userid,
      username: item.username,
      userprofile: item.userprofile,
      key: item.key,
    }).then(() => {
      remove(ref(db, "Groupjoinrequset/" + item.key));
    });
  };

  let handleMember = (id) => {
    setShowlist(!showlist);
    const gmemberRef = ref(db, "groupmember/");
    onValue(gmemberRef, (Snapshot) => {
      let arr = [];
      Snapshot.forEach((item) => {
        if (id.gid == item.val().gid) {
          arr.push({ ...item.val(), key: item.key });

          // arr.push(item.val());
        }
      });
      setMemberlist(arr);
    });
  };
  let handleMemberCancel = (item) => {
    remove(ref(db, "groupmember/" + item.key));
  };

  return (
    <div className="shadow-sm shadow-black p-5 h-[427px] overflow-y-scroll rounded-xl mt-5">
      <h3 className="font-nunito font-semibold font-xl">My Group</h3>

      {showinfo ? (
        <>
          <button
            onClick={() => setShowinfo(!showinfo)}
            className="font-nunito font-bold text-white text-lg bg-primary p-2 rounded w-[56px] "
          >
            Back
          </button>

          {memberreq.map((item) => (
            <div className="flex justify-between items-center border-b border-solid border-black pb-2.5 m-5">
              <img
                src={item.userprofile}
                className="w-[70px] h-[70px] rounded "
              />

              <div>
                <h3 className="font-nunito font-semibold text-lg">
                  {item.username}
                </h3>
                <p className="font-nunito font-semibold text-sm text-[#4D4D4DBF]">
                  {item.gtag}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleMemberaccept(item)}
                  className="font-nunito font-bold text-white text-lg bg-primary p-2 rounded w-[70px] "
                >
                  Accept
                </button>
                <button
                  onClick={() => handleMemberreq(item)}
                  className="font-nunito font-bold text-white text-lg bg-red-500 p-2 rounded w-[87px] ml-[10px] mr-[-15px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </>
      ) : showlist ? (
        <>
          <button
            onClick={() => setShowlist(!showlist)}
            className="font-nunito font-bold text-white text-lg bg-primary p-2 rounded w-[56px] "
          >
            Back
          </button>

          {memberlist.map((item) => (
            <div className="flex justify-between items-center border-b border-solid border-black pb-2.5 m-5">
              <img
                src={item.userprofile}
                className="w-[70px] h-[70px] rounded "
              />

              <div>
                <h3 className="font-nunito font-semibold text-lg">
                  {item.username}
                </h3>
                <p className="font-nunito font-semibold text-sm text-[#4D4D4DBF]">
                  {item.gtag}
                </p>
              </div>
              <div>
                {/* <button
                  onClick={() => handleMemberaccept(item)}
                  className="font-nunito font-bold text-white text-lg bg-primary p-2 rounded w-[70px] "
                >
                  Accept
                </button> */}
                <button
                  onClick={() => handleMemberCancel(item)}
                  className="font-nunito font-bold text-white text-lg bg-red-500 p-2 rounded w-[87px] ml-[10px] mr-[-15px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          {mygroup.length == 0 ? (
            <p className="bg-green-500 p-2.5 rounded text-center text-2xl text-white mt-5">
              Create Groups or Join Groups
            </p>
          ) : (
            mygroup.map((item) => (
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
                  <button
                    onClick={() => handleShow(item)}
                    className="font-nunito font-bold text-white text-lg bg-primary p-2 rounded w-[44px] "
                  >
                    Info
                  </button>
                  <button
                    onClick={() => handleMember(item)}
                    className="font-nunito font-bold text-white text-lg bg-primary p-2 rounded w-[87px] ml-[10px] mr-[-15px]"
                  >
                    Members
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default MyGroups;
