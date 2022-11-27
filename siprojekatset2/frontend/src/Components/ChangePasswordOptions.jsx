import React from "react";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import "./style/ChangePasswordOptions.css";

const ChangePasswordOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="option-container">
      <Button
        className="btn-1"
        letiant="outline-success"
        onClick={(e) => navigate("/resetPasswordEmail")}
      >
        Change password using email
      </Button>
      <Button
        className="btn-2"
        letiant="primary"
        onClick={(e) => navigate("/resetPasswordQuestions")}
      >
        Change password with security questions
      </Button>
    </div>
  );
};

export default ChangePasswordOptions;
