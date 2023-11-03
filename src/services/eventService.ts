import { readFile, writeFile } from "../utils/file/file";
import { Account } from "../utils/file/file.types";

export const eventService = {
  getFile: () => {
    const file = readFile();

    return file;
  },

  setFile: (file: Account[]) => {
    writeFile(file);
  },
};
