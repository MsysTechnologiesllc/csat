import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "antd";
import { FaGoogle } from "react-icons/fa";
import "./sso-integration.scss";
import { PostService } from "../../services/post";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import i18n from "../../locales/i18next";

export const SSOIntegration = () => {
  const navigate = useNavigate();
  const responseGoogle = async (response) => {
    const payload = {
      access_token: response.access_token,
    };
    if (response) {
      new PostService().postSSOApi(payload, (result) => {
        if (result?.status === 200) {
          if (result?.data?.data) {
            Cookies.set("jwt", result?.data?.data?.token);
            navigate("/accounts");
          }
        }
      });
    }
  };
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
  });

  return (
    <div className="sso-login-wrapper">
      <h1 className="login-context">{i18n.t("common.login")}</h1>
      <Button
        icon={<FaGoogle />}
        onClick={googleLogin}
        type="text"
        className="login-button"
      >
        {i18n.t("common.googleLogin")}
      </Button>
    </div>
  );
};
