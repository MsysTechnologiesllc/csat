import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GreetingsPage from "../components/greetings/greeting";
import { FeedBackSurvey } from "../components/feedback-survey/feedback-survey";
import { TeamMembersFeedBack } from "../components/team-members-feedback/team-members-feedback";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GreetingsPage />} exact />
        <Route path="/survey" element={<FeedBackSurvey />} exact />
        <Route path="/teamFeedBack" element={<TeamMembersFeedBack />} exact />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
