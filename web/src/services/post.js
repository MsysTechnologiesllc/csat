import { BaseService } from ".";

export class PostService extends BaseService {
  createSurvey(payload = null, callback) {
    return this.post(
      process.env.GO_SERVICE_URL + "/csat/rest/api/survey-clone",
      payload,
      callback,
    );
  }
  createClient(payload = null, callback) {
    return this.post(
      process.env.GO_SERVICE_URL + "/csat/rest/api/client",
      payload,
      callback,
    );
  }
  postCredentials(payload = null, callback) {
    return this.post(
      process.env.GO_SERVICE_URL + "/csat/rest/auth/customer-login",
      payload,
      callback,
    );
  }
  postSSOApi(response, callback) {
    return this.post(
      process.env.GO_SERVICE_URL + `/csat/rest/auth/google/update`,
      response,
      callback,
    );
  }
  postLoginDetails(payload, callback) {
    return this.post(
      process.env.GO_SERVICE_URL + "/csat/rest/api/user/login",
      payload,
      callback,
    );
  }
  createAccount(payload, callback) {
    return this.post(
      process.env.GO_SERVICE_URL + "/csat/rest/api/account",
      payload,
      callback,
    );
  }
  updateAccount(accountID, payload, callback) {
    return this.post(
      process.env.GO_SERVICE_URL +
        `/csat/rest/api/account?accountId=${accountID}`,
      payload,
      callback,
    );
  }
}
