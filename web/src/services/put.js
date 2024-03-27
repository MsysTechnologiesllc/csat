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
export class PutService extends BaseService {
  updateFeedback(payload = null, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL + `/csat/rest/api/userFeedback`,
      payload,
      callback,
      headers(),
    );
  }
  updateSurveyDetails(payload = null, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL + "/csat/rest/api/survey-answers",
      payload,
      callback,
      headers(),
    );
  }
  updatePassword(payload, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL + "/csat/rest/auth/reset-password",
      payload,
      callback,
      headers(),
    );
  }
  updateAccount(accountId, payload, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/account?accountId=${accountId}`,
      payload,
      callback,
      headers(),
    );
  }
  updateProject(projectId, accountId, payload, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/project?projectId=${projectId}&accountId=${accountId}`,
      payload,
      callback,
      headers(),
    );
  }
  addUpdateProject(projectId, accountId, payload, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/project?projectId=${projectId}&accountId=${accountId}`,
      payload,
      callback,
      headers(),
    );
  }
}
