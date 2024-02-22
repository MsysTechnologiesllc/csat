import sign from "jwt-encode";
import { SECRET_KEY } from "../common/constants";
// import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

export class TokenUtil {
  static generateJwtToken(email) {
    // let time = new Date().getTime() + TOKEN_EXPIRE_TIME;
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

// export const millisToMinutesAndSeconds = (millis) => {
//   let minutes = Math.floor(millis / 60000);
//   minutes = minutes.toString().length === 1 ? `0${minutes}` : `${minutes}`;
//   const seconds = ((millis % 60000) / 1000).toFixed(0);
//   let time = "";
//   if (minutes > 60) {
//     const times = `${minutes / 60}`; /// remove times and  add time
//     let hour = times.split(".")[0];
//     hour = hour.length === 1 ? `${0 + hour}` : `${hour}`;
//     let min = times.split(".")[1]
//       ? Math.round((times.split(".")[1].substring(0, 2) / 100) * 60)
//       : "00";
//     min = min.toString().length === 1 ? `0${min}` : `${min}`;
//     time = `${`${hour}:${min}:${seconds}`}`;
//   } else {
//     time = `00:${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; /// Min and sec
//   }

//   return time;
// };

// export const convertToBase64 = (data) => {
//   const imageData = JSON.parse(data);
//   const base64Data = window.btoa(
//     new Uint8Array(imageData.data).reduce(function (data, byte) {
//       return data + String.fromCharCode(byte);
//     }, "")
//   );
//   const linkSource = `data:${"image/jpeg"};base64,${base64Data}`;
//   return linkSource;
// };
// export const downloadBase64File = (data, fileName) => {
//   const linkSource = convertToBase64(data);
//   const downloadLink = document.createElement("a");
//   downloadLink.href = linkSource;
//   downloadLink.download = `${fileName}_${new Date().toLocaleDateString()}.jpeg`;
//   downloadLink.click();
// };

// const getInitials = (name) => {
//   let initials;
//   const nameSplit = name.split(" ");
//   const nameLength = nameSplit.length;
//   if (nameLength > 1) {
//     initials =
//       nameSplit[0].substring(0, 1) + nameSplit[nameLength - 1].substring(0, 1);
//   } else if (nameLength === 1) {
//     initials = nameSplit[0].substring(0, 1);
//   } else return;

//   return initials.toUpperCase();
// };

// export const createImageFromInitials = (size, name, color) => {
//   if (name == null) return;
//   const names = getInitials(name);
//   if (typeof window === "object") {
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     canvas.width = size;
//     canvas.height = size;

//     context.fillStyle = "#ffffff";
//     context.fillRect(0, 0, size, size);

//     context.fillStyle = `${color}`;
//     context.fillRect(0, 0, size, size);

//     context.fillStyle = "white";
//     context.textBaseline = "middle";
//     context.textAlign = "center";
//     context.font = `${size / 2}px Roboto`;
//     context.fillText(names, size / 2, size / 2);

//     return canvas.toDataURL();
//   }
// };

// export const ratingsFormatter = (num) => {
//   return Math.abs(num) > 999
//     ? (Math.abs(num) / 1000).toFixed(1) + "k"
//     : Math.abs(num);
// };
