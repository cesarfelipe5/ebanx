import { readFile } from "../utils/file/file";

export const balanceService = {
  getFile: () => {
    const file = readFile();

    return file;
  },
};
