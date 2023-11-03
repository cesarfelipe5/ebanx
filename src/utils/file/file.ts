import * as fs from "fs";
import { Account } from "./file.types";

const fileName = "dados.txt";

export const readFile = (): Account[] | null => {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, "[]", "utf8");
  }

  try {
    const data = fs.readFileSync(fileName, "utf8");

    return JSON.parse(data) as Account[];
  } catch (err) {
    console.error("Erro ao ler o arquivo:", err);
    return null;
  }
};

export const writeFile = (dados: Account[]): void => {
  try {
    const jsonData = JSON.stringify(dados, null, 2);

    fs.writeFileSync(fileName, jsonData, "utf8");

    console.log("Dados gravados no arquivo.");
  } catch (err) {
    console.error("Erro ao gravar no arquivo:", err);
  }
};

export const deleteFileIfExists = (): boolean => {
  try {
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);

      return true;
    } else {
      return true;
    }
  } catch (err) {
    return false;
  }
};
