import { BaseService } from ".";

export class PostService extends BaseService {
  createSurvey(payload = null, callback) {
    return this.post(
      "http://172.30.44.77:8000/csat/rest/api/survey-clone",
      payload,
      callback,
    );
  }
  createClient(payload = null, callback) {
    return this.post(
      "http://172.30.44.77:8000/csat/rest/api/client",
      payload,
      callback,
    );
  }
}
