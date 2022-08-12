const time2date = (time: string, [year, month, date] = [2022, 6, 27]): Date => {
  const [hour, minutes] = time.split(":");

  return new Date(Date.UTC(year, month, date, Number(hour), Number(minutes)));
};

export { time2date };
