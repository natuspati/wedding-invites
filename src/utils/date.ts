const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const getDefaultDates = () => {
  const now = new Date();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(now.getDate() - 90);

  return {
    start: formatDate(ninetyDaysAgo),
    end: formatDate(now),
  };
};
