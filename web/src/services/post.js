import { BaseService } from ".";
import Cookies from "js-cookie";

const headers = () => {
  return {
    headers: {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Content-Type": "application/json",
    },
  };
};
export class PostService extends BaseService {
  createSurvey(payload = null, callback) {
    return this.post(
      process.env.REACT_APP_GO_SERVICE_URL + "/csat/rest/api/survey-clone",
      payload,
      callback,
      headers(),
    );
  }
  createClient(payload = null, callback) {
    return this.post(
      process.env.REACT_APP_GO_SERVICE_URL + "/csat/rest/api/client",
      payload,
      callback,
      headers(),
    );
  }
  postCredentials(payload = null, callback) {
    return this.post(
      process.env.REACT_APP_GO_SERVICE_URL + "/csat/rest/auth/customer-login",
      payload,
      callback,
      headers(),
    );
  }
  postSSOApi(response, callback) {
    return this.post(
      process.env.REACT_APP_GO_SERVICE_URL + `/csat/rest/auth/google/update`,
      response,
      callback,
      headers(),
    );
  }
  postLoginDetails(payload, callback) {
    return this.post(
      process.env.REACT_APP_GO_SERVICE_URL + "/csat/rest/api/user/login",
      payload,
      callback,
      headers(),
    );
  }
  createAccount(payload, callback) {
    return this.post(
      process.env.REACT_APP_GO_SERVICE_URL + "/csat/rest/api/account",
      payload,
      callback,
      headers(),
    );
  }
  updateAccount(accountID, payload, callback) {
    return this.post(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/account?accountId=${accountID}`,
      payload,
      callback,
      headers(),
    );
  }
}
