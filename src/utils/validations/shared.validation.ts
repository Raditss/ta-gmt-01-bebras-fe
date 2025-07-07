import {z} from "zod";

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