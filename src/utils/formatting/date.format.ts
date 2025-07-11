import dayjs, { Dayjs } from 'dayjs';

export const toLocalDate = (date: Dayjs | string) => {
  return dayjs(date).format('dddd, MMMM D, YYYY, HH:mm:ss');
};
