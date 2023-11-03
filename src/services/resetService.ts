import { deleteFileIfExists } from "../utils/file/file";

export const resetService = {
  index: () => {
    const deleted = deleteFileIfExists();

    return deleted;
  },
};
