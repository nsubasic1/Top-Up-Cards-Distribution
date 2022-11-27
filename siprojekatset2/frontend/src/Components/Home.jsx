import React from "react";
import { Figure } from "react-bootstrap";
import topUpImg from "../Img/topupimg.png";
import DistMreza from "./DistMreza";

export default function Home() {
  return (
    <div className="d-inline-flex w-100">
      <div className="w-50 d-flex aligns-items-center justify-content-center">
        <div className="w-75 align-self-center">
          <h1 className="text-center text-primary">
            Top-Up Distribution System
          </h1>
          <p className="fs-4  m-5">
          Top-Up Distribution System rješava problem distribucije
          Top-Up kartica od glavne lokacije prema distributivnim centrima i prodajnim mjestima.
          </p>
        </div>
      </div>
      <div className="w-50">
        <Figure>
          <Figure.Image src={topUpImg} />
        </Figure>
      </div>
    </div>
  );
}
