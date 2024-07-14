/* eslint-disable @typescript-eslint/no-explicit-any */
export const removeEmptyString = (obj: any) => {
  const result: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== '') {
      result[key] = obj[key];
    }
  }

  return result;
};
