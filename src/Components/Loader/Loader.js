import React from "react";
import "./Loader.scss";
import { appConfig } from "../../Constants/config";

const Loader = () => {
  return (
    <section className="loader-container">
      <div className="wrapper">
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className="title">{appConfig.language.loader} <span>.</span><span>.</span><span>.</span></div>
    </section>
  );
};

export default Loader;
