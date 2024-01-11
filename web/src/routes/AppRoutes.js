import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GreetingsPage from "../components/greetings/greeting";
import { FeedBackSurvey } from "../components/feedback-survey/feedback-survey";
import { TeamMembersFeedBack } from "../components/team-members-feedback/team-members-feedback";
import { Successfull } from "../components/successfull/successfull";

const AppRoutes = () => {
  const routes = [
    { path: "/survey/submitted" },
    { path: "/teamFeedback/submitted" },
    // Add more route paths as needed
  ];
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GreetingsPage />} exact />
        <Route path="/survey" element={<FeedBackSurvey />} exact />
        <Route path="/teamFeedBack" element={<TeamMembersFeedBack />} exact />
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<Successfull />}
            exact
          />
        ))}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
