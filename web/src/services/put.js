import { BaseService } from ".";

export class PutService extends BaseService {
  updateFeedback(payload = null, callback) {
    return this.put(
      `http://172.30.44.77:8000/csat/rest/api/userFeedback`,
      payload,
      callback,
    );
  }
  updateSurveyDetails(payload = null, callback) {
    return this.put(
      "http://172.30.44.77:8000/csat/rest/api/survey-answers",
      payload,
      callback,
    );
  }
}
