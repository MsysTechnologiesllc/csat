import { BaseService } from ".";

export class GetService extends BaseService {
  getTeamList(prjId, callback) {
    return this.get(
      `http://172.30.44.77:8000/csat/rest/api/team-list?project_id=${prjId}`,
      callback,
    );
  }
  getSurveyDetails(surveyId, callback) {
    return this.get(
      `http://172.30.44.77:8000/csat/rest/api/survey-details?id=${surveyId}`,
      callback,
    );
  }
  getSurveyList(
    tenant_id,
    page,
    limit,
    accountName,
    status,
    user_id,
    callback,
  ) {
    return this.get(
      `http://172.30.44.77:8000/csat/rest/api/surveys?tenant_id=${tenant_id}&page=${page}&limit=${limit}&accountName=${accountName}&status=${status}&user_id=${user_id}`,
      callback,
    );
  }
  getPreviewSurvey(project_id, callback) {
    return this.get(
      `http://172.30.44.77:8000/csat/rest/api/survey-format?project_id=${project_id}`,
      callback,
    );
  }
  getAccountsList(tenant_id, callback) {
    return this.get(
      `http://172.30.44.77:8000/csat/rest/api/account?tenant_id=${tenant_id}`,
      callback,
    );
  }
}
