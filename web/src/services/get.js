import { BaseService } from ".";

export class GetService extends BaseService {
  getTeamList(prjId, callback) {
    return this.get(
      `http://172.30.44.77:8000/csat/rest/api/team-list?project_id=${prjId}`,
      callback,
    );
  }
}
