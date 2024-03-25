import i18n from "../locales/i18next";

export const projectDetails = [
  {
    title: i18n.t("greetings.project"),
    desc: "Project 1",
  },
  {
    title: i18n.t("greetings.projectManager"),
    desc: "Vinod J",
  },
  {
    title: i18n.t("greetings.deliveryHead"),
    desc: "Ramesh",
  },
  {
    title: i18n.t("greetings.shareBefore"),
    desc: "23 Jan 2023",
  },
];
export const step1Options = {
  question: i18n.t("surveyQuestions.sprintOnTrack"),
  options: [
    {
      label: i18n.t("common.yes"),
      value: "yes",
      imgSrc: "./images/yes-image.svg",
    },
    {
      label: i18n.t("common.no"),
      value: "no",
      imgSrc: "./images/no-image.svg",
    },
  ],
};
export const step4Options = {
  question: i18n.t("surveyQuestions.teamMeetExpectations"),
  options: [
    {
      label: i18n.t("common.veryLow"),
      value: "very-low",
      imgSrc: "./images/very-low.svg",
      colorClassName: "very-low-color",
    },
    {
      label: i18n.t("common.low"),
      value: "low",
      imgSrc: "./images/low.svg",
      colorClassName: "low-color",
    },
    {
      label: i18n.t("common.avg"),
      value: "avg",
      imgSrc: "./images/avg.svg",
      colorClassName: "avg-color",
    },
    {
      label: i18n.t("common.high"),
      value: "high",
      imgSrc: "./images/high.svg",
      colorClassName: "high-color",
    },
    {
      label: i18n.t("common.veryHigh"),
      value: "very-high",
      imgSrc: "./images/very-high.svg",
      colorClassName: "very-high-color",
    },
  ],
};
export const step5Options = {
  question: i18n.t("surveyQuestions.overallProductivity"),
  options: [
    {
      label: i18n.t("common.veryLow"),
      value: "very-low-scale",
      className: "very-low-scale",
    },
    {
      label: i18n.t("common.low"),
      value: "low-scale",
      className: "low-scale",
    },
    {
      label: i18n.t("common.avg"),
      value: "avg-scale",
      className: "avg-scale",
    },
    {
      label: i18n.t("common.high"),
      value: "high-scale",
      className: "high-scale",
    },
    {
      label: i18n.t("common.veryHigh"),
      value: "very-high-scale",
      className: "very-high-scale",
    },
  ],
};
export const users = [
  {
    CreatedAt: "2024-01-08T16:16:46.015088+05:30",
    DeletedAt: null,
    ID: 2,
    UpdatedAt: "2024-01-08T16:16:46.015088+05:30",
    account_id: 2001,
    email: "Test1@yahoo.com",
    name: "Silambu",
    role: "user",
  },
  {
    CreatedAt: "2024-01-08T16:16:46.015088+05:30",
    DeletedAt: null,
    ID: 3,
    UpdatedAt: "2024-01-08T16:16:46.015088+05:30",
    account_id: 2001,
    email: "Test2@yahoo.com",
    name: "Raj",
    role: "manager",
  },
  {
    CreatedAt: "2024-01-29T15:54:55.21212+05:30",
    DeletedAt: null,
    ID: 213,
    UpdatedAt: "2024-01-29T15:54:55.21212+05:30",
    account_id: 0,
    email: "priya@msys.com",
    name: "Priya",
    role: "Project Manager",
  },
  {
    CreatedAt: "2024-01-29T15:54:55.390374+05:30",
    DeletedAt: null,
    ID: 214,
    UpdatedAt: "2024-01-29T15:54:55.390374+05:30",
    account_id: 0,
    email: "dominic@msys.com",
    name: "Dominic",
    role: "Delivery Head",
  },
  {
    CreatedAt: "2024-01-29T15:54:58.318258+05:30",
    DeletedAt: null,
    ID: 217,
    UpdatedAt: "2024-01-29T15:54:58.318258+05:30",
    account_id: 0,
    email: "naveen@test.com",
    name: "Naveen",
    role: "user",
  },
];
