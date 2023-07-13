import React, { useEffect } from "react";

import LoginButton from "./LoginButton";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Public = () => {

  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (user) {
      navigate('/course');
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto">
      <header className="text-gray-600 body-font">
        <div className="flex flex-wrap p-1 md:p-2 flex-row items-center m-2">
          <a className="arbitre flex title-font items-center text-gray-800 mb-0" href="/">
            <span className="ml-3 text-xl font-black">ARBITRE</span>
          </a>
          <nav className="mr-auto ml-4 py-1 pl-4 border-l border-gray-400	flex flex-wrap items-center text-base justify-center">
            <a href="https://silicon-saver-c3d.notion.site/ARBITRE-Docs-0eda4df036504c5f98b1b7b14083f706?pvs=4" className="mr-5 hover:text-gray-800">
              Docs
            </a>
          </nav>
          <LoginButton />
        </div>
      </header>

      <div className="flex items-center justify-center my-8 md:my-12">
        <div className=" bg-blue-900 rounded-2xl border border-gray-100 shadow-lg shadow-gray-50 p-8 flex flex-col items-center justify-center">
          <h1 className="text-5xl text-white font-black text-center mt-16 border-4 border-white bg-blue-950 px-3 rounded-full">ARBITRE</h1>
          <p className="text-gray-300 text-lg m-1 text-center mb-12">An open source code judge</p>
          {/* <img src="/resource/logo.svg" alt="Logo arbitre" className="h-32 w-32 m-6" /> */}
          <div className="flex items-center mt-4">
            <h1 className="text-3xl text-white font-bold text-center">Welcome to Arbitre</h1>
          </div>
          <p className="text-gray-100 mt-4 text-center">
            Arbitre is a platform that automatically corrects code. Teachers can create exercises and specify unit tests for students' code to be assessed against.
          </p>
        </div>
      </div>
      <div className="mx-auto">
        <img src="/resource/cropped-logo.png" alt="logo Télécom Sud Paris" className="w-1/4 mx-auto" />
      </div>
    </div>
  );
}

export default Public;