import React from "react";
import BlockedUser from "../../components/BlockedUser";
import FriendRequset from "../../components/FriendRequset";
import Friends from "../../components/Friends";
import Group from "../../components/Group";
import MyGroups from "../../components/MyGroups";
import Search from "../../components/Search";
import Sidebar from "../../components/Sidebar";
import UserList from "../../components/UserList";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
const Home = () => {
  let auth = getAuth();
  let navigate = useNavigate();
  let [everify, setEverify] = useState("");
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    } else {
      console.log(auth.currentUser.emailVerified);
      if (auth.currentUser.emailVerified) {
        setEverify(true);
      }
    }
  }, []);

  return (
    <>
      {everify ? (
        <div className="xl:flex justify-between p-2 xl:p-0">
          <div className="xl:w-[186px]">
            <Sidebar active="home" />
          </div>
          <div className="xl:w-[427px]">
            <Search />
            <Group />
            <FriendRequset />
          </div>
          <div className="xl:w-[427px]">
            <Friends block="true" />
            <MyGroups />
          </div>
          <div className="xl:w-[427px]">
            <UserList />
            <BlockedUser />
          </div>
        </div>
      ) : (
        <div className="text-center mt-[50px]">
          <span className=" font-nunito font-bold p-2.5 rounded text-5xl bg-primary text-white inline-block">
            Please varify Your Email !Chack your email inbox
          </span>
        </div>
      )}
    </>
  );
};

export default Home;
