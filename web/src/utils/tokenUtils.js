import sign from "jwt-encode";
import { SECRET_KEY } from "../common/constants";
// import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

export class TokenUtil {
  static generateJwtToken(email) {
    const jwt = sign({ email }, SECRET_KEY);
    return jwt;
  }
  static objectToParam = (obj) => {
    return Object.entries(obj)
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
  };
  static CheckTrialExpiration = (expdate) => {
    const currentDate = moment();
    let isTrialExpired = true;
    const expirationDate = moment(expdate).format("DD MMMM YYYY");
    if (currentDate.isBefore(expirationDate)) {
      isTrialExpired = false;
    }
    return isTrialExpired;
  };
  static getTokenDetails() {
    let jwt = Cookies.get("jwt");
    if (jwt) {
      var jwtdecoded = jwtDecode(jwt);
      if (jwtdecoded && jwtdecoded.Email) {
        return jwtdecoded;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  static getQueryParams() {
    return window.location.search
      .replace("?", "")

      .split("&")

      .map((pair) => {
        let [key, val] = pair.split("=");

        return [key, decodeURIComponent(val || "")];
      })

      .reduce((result, [key, val]) => {
        result[key] = val;
        return result;
      }, {});
  }
}
export default TokenUtil;

export const getCookie = (cname) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
