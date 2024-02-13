import moment from "moment/moment";

export const DaysAdded = (days) => {
  let currentDate = moment();

  // Add 7 days to the current date
  let futureDate = currentDate.add(days, "days");

  // Format the future date as "D MMM, YYYY" (e.g., 3 Feb, 2024)
  let formattedDate = futureDate.format("D MMM, YYYY");
  return formattedDate;
};

export const NoOfDays = (givenDate) => {
  // Current date
  const currentDate = moment();

  // Target date
  const targetDate = moment(givenDate);

  // Calculate the difference in days
  const numberOfDays = targetDate.diff(currentDate, "days");

  return numberOfDays;
};
