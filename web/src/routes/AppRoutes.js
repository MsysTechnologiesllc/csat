import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import GreetingsPage from "../components/greetings/greeting";
import { FeedBackSurvey } from "../components/feedback-survey/feedback-survey";
import { TeamMembersFeedBack } from "../components/team-members-feedback/team-members-feedback";
import { Successfull } from "../components/successfull/successfull";
import { MainLayout } from "../layout/main-layout";
import { Dashboard } from "../modules/dashboard/dashboard";
import { CustomerSurveyLayout } from "../layout/customer-survey-layout/customer-survey-layout";
import { Accounts } from "../modules/accounts/accounts";
import { Notifications } from "../modules/notifications/notifications";
import SurveyHome from "../components/surveys/survey-home/Survey-home";
import { SurveyDetails } from "../components/survey-details/survey-details";

const AppRoutes = () => {
  const routes = [
    { path: "/survey/submitted" },
    { path: "/teamFeedback/submitted" },
  ];

  return (
    <Router>
      <Routes>
        <Route element={<CustomerSurveyLayout />} exact>
          <Route
            path="/"
            element={<Navigate to={`/customer-survey/:survey_id`} replace />}
          />
          <Route
            path={`/customer-survey/:survey_id`}
            element={<GreetingsPage />}
            exact
          />
          <Route path="/survey/:surveyId" element={<FeedBackSurvey />} exact />
          <Route path="/teamFeedBack" element={<TeamMembersFeedBack />} exact />
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<Successfull />}
              exact
            />
          ))}
        </Route>
        <Route element={<MainLayout />} exact>
          <Route
            key="/dashboard"
            path="/dashboard"
            element={<Dashboard />}
            exact
          />
          <Route
            key="/accounts"
            path="/accounts"
            element={<Accounts />}
            exact
          />
          <Route
            key="/surveys"
            path="/surveys"
            element={<SurveyHome />}
            exact
          />
          <Route
            key="/surveys"
            path="/surveys/surveyDetails"
            element={<SurveyDetails />}
            exact
          />
          <Route
            key="notifications"
            path="notifications"
            element={<Notifications />}
            exact
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
