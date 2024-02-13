import moment from "moment/moment";

export const DaysAdded = (days) => {
  let currentDate = moment();

  let futureDate = currentDate.add(days, "days");

  let formattedDate = futureDate.format("D MMM, YYYY");
  return formattedDate;
};

export const NoOfDays = (givenDate) => {
  const currentDate = moment();

  const targetDate = moment(givenDate);

  const numberOfDays = targetDate.diff(currentDate, "days");

  return numberOfDays;
};
