const hasExplicitTime = (value?: string | null) =>
  Boolean(value && value.includes("T"));

const parseDateParts = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
};

export const parseQuizDate = (
  value?: string | null,
  endOfDay = false
) => {
  if (!value) return null;
  if (hasExplicitTime(value)) {
    return new Date(value);
  }

  const { year, month, day } = parseDateParts(value);
  if (endOfDay) {
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

export const formatQuizDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = hasExplicitTime(value)
    ? new Date(value)
    : parseQuizDate(value);
  if (!date) return "-";

  return hasExplicitTime(value)
    ? date.toLocaleString()
    : date.toLocaleDateString();
};

export const formatDateTimeLocalValue = (value?: string | null) => {
  if (!value) return "";
  if (hasExplicitTime(value)) {
    return value.slice(0, 16);
  }
  return `${value}T00:00`;
};

export const getQuizAvailabilityStatus = (quiz: {
  availableDate?: string;
  untilDate?: string;
}) => {
  const now = new Date();
  const availableDate = parseQuizDate(quiz.availableDate);
  const untilDate = parseQuizDate(quiz.untilDate, true);

  if (untilDate && now > untilDate) {
    return "Closed";
  }
  if (availableDate && now < availableDate) {
    return `Not available until ${formatQuizDateTime(quiz.availableDate)}`;
  }
  return "Available";
};

export const isQuizAvailableNow = (quiz: {
  availableDate?: string;
  untilDate?: string;
}) => {
  const now = new Date();
  const availableDate = parseQuizDate(quiz.availableDate);
  const untilDate = parseQuizDate(quiz.untilDate, true);

  if (availableDate && now < availableDate) return false;
  if (untilDate && now > untilDate) return false;
  return true;
};
