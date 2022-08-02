const time2date = (time: string): Date => {
  const [hour, minutes] = time.split(":");

  return new Date(Date.UTC(2022, 6, 27, Number(hour), Number(minutes)));
};

export { time2date };
