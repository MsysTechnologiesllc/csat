import { BaseService } from ".";

export class PutService extends BaseService {
  updateFeedback(payload = null, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL + `/csat/rest/api/userFeedback`,
      payload,
      callback,
    );
  }
  updateSurveyDetails(payload = null, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL + "/csat/rest/api/survey-answers",
      payload,
      callback,
    );
  }
  updatePassword(payload, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL + "/csat/rest/auth/reset-password",
      payload,
      callback,
    );
  }
  updateAccount(accountId, payload, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/account?accountId=${accountId}`,
      payload,
      callback,
    );
  }
  updateProject(projectId, accountId, payload, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/project?projectId=${projectId}&accountId=${accountId}`,
      payload,
      callback,
    );
  }
  addUpdateProject(projectId, accountId, payload, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/project?projectId=${projectId}&accountId=${accountId}`,
      payload,
      callback,
    );
  }
  deleteClient(projectId, userId, payload = null, callback) {
    return this.put(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/user/remove?projectID=${projectId}&userID=${userId}`,
      payload,
      callback,
    );
  }
}
