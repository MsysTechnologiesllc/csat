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
}
