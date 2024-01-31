import { BaseService } from ".";
import Cookies from "js-cookie";

const headers = () => {
  return {
    headers: {
      Authorization: `Bearer ${Cookies.get("jwt")}`,
      "Access-Control-Allow-Origin": "*",
    },
  };
};
export class PutService extends BaseService {
  updateFeedback(payload = null, callback) {
    return this.put(
      `http://172.30.44.77:8000/csat/rest/api/userFeedback`,
      payload,
      headers(),
      callback,
    );
  }
}
