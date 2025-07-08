import {z} from "zod";
import dayjs from "dayjs";

export const jsonStringSchema = z.string().refine((str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (_e) {
    return false;
  }
}, {
  message: 'Invalid JSON string',
});

export const dayJsSchema = z.union([
  z.string().refine((val) => {
    return !isNaN(Date.parse(val));
  }, {
    message: 'Invalid date string',
  }),
  z.date(),
]).transform((val) => dayjs(val));