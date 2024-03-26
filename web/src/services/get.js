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

export class GetService extends BaseService {
  getTeamList(prjId, callback) {
    return this.get(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/team-list?project_id=${prjId}`,
      callback,
      headers(),
    );
  }
  getSurveyDetails(surveyId, passcode, callback) {
    return this.get(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/survey-details?id=${surveyId}&passcode=${passcode}`,
      callback,
      headers(),
    );
  }
  getManagerSurveyDetails(surveyId, callback) {
    return this.get(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/manager/survey-details?id=${surveyId}`,
      callback,
      headers(),
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
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/surveys?tenant_id=${tenant_id}&page=${page}&limit=${limit}&accountName=${accountName}&status=${status}&user_id=${user_id}`,
      callback,
      headers(),
    );
  }
  getPreviewSurvey(project_id, callback) {
    return this.get(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/survey-format?project_id=${project_id}`,
      callback,
      headers(),
    );
  }
  getAccountsList(tenant_id, callback) {
    return this.get(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/account?tenant_id=${tenant_id}`,
      callback,
      headers(),
    );
  }
  getSurveyProjectsFilter(userid, callback) {
    return this.get(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/user-projects?user_id=${userid}`,
      callback,
      headers(),
    );
  }
  getSurveyFormatList(acc_id, callback) {
    return this.get(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/survey-format/list?account_id=${acc_id}`,
      callback,
      headers(),
    );
  }
  getForgotPassword(email, callback) {
    return this.get(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/auth/reset-password/link?email=${email}`,
      callback,
      headers(),
    );
  }
  getAccountOwners(search, callback) {
    return this.get(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/auth/search?search=${search}`,
      callback,
      headers(),
    );
  }
  getProjectDetails(projectId, callback) {
    return this.get(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/project-details?projectId=${projectId}`,
      callback,
      headers(),
    );
  }
  getSurveyListForProjectOverview(tenant_id, user_id, callback) {
    return this.get(
      process.env.REACT_APP_GO_SERVICE_URL +
        `/csat/rest/api/surveys?page=1&tenant_id=${tenant_id}&limit=10&user_id=${user_id}`,
      callback,
      headers(),
    );
  }
}
