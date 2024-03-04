import { BaseService } from ".";

export class PutService extends BaseService {
  updateFeedback(payload = null, callback) {
    return this.put(
      process.env.GO_SERVICE_URL + `/csat/rest/api/userFeedback`,
      payload,
      callback,
    );
  }
  updateSurveyDetails(payload = null, callback) {
    return this.put(
      process.env.GO_SERVICE_URL + "/csat/rest/api/survey-answers",
      payload,
      callback,
    );
  }
  updatePassword(payload, callback) {
    return this.put(
      process.env.GO_SERVICE_URL + "/csat/rest/auth/reset-password",
      payload,
      callback,
    );
  }
}
