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
    <>
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-1 md:p-2 flex-row items-center m-2">
          <a className="arbitre flex title-font items-center text-gray-900 mb-0" href="/">
            <img src="/resource/logo.svg" alt="Logo arbitre" className="h-8 w-8 m-2 block md:hidden " />
            <span className="ml-3 text-xl hidden md:block">ARBITRE</span>
          </a>
          <nav className="mr-auto ml-0 md:ml-4 py-1 pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
            <a href="https://silicon-saver-c3d.notion.site/Prefix-and-Suffix-56d59b8e97b34046b0c646ca3d79f264" className="mr-5 hover:text-gray-900">
              Instructions
            </a>
          </nav>
          <div><LoginButton /></div>
        </div>
      </header>
      <div className="flex items-center justify-center my-8 md:my-12">
        <div className="bg-gray-200 rounded-3xl shadow-lg shadow-gray-400/50 p-8 w-4/5 flex flex-col items-center justify-center">
          <p className="text-gray-600 text-lg m-2 text-center">An open source code judge</p>
          <img src="/resource/logo.svg" alt="Logo arbitre" className="h-32 w-32 m-6" />
          <div className="flex items-center mt-4">
            <h1 className="text-3xl font-bold text-center">Welcome to Arbitre</h1>
          </div>
          <p className="text-gray-600 mt-4 text-center hidden md:block">Arbitre is a platform that automatically corrects code. Teachers can create exercises and specify unit tests for students' code to be assessed against.</p>
        </div>
      </div>
      <div className="mx-auto">
        <img src="/resource/cropped-logo2.png" alt="logo Télécom Sud Paris" className="w-1/4 mx-auto" />
      </div>
    </>
  );
}

export default Public;