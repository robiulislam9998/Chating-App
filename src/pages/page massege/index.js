import React from "react";
import JoinGroupList from "../../components/JoinGroupList";
import Sidebar from "../../components/Sidebar";
import Friends from "../../components/Friends";
import Chat from "../../components/Chat";
import FriendsChat from "../../components/FriendsChat";

const Massege = () => {
  return (
    <div className="md:flex md:ml-32">
      <div className="max-w-[186px]">
        <Sidebar active="massege" />
      </div>
      <div className="md:w-full w-[350px] md:flex gap-x-10 ml-1 md:ml-8">
        <JoinGroupList />
        <FriendsChat />
      </div>
    </div>
  );
};

export default Massege;
