import { v4 as uuidv4 } from "uuid";

export const encrypt = (id: string) => {
  const randomId = uuidv4();
  if (typeof id === "string") {
    return randomId + Buffer.from(id?.toString()).toString("base64");
  }
};

export const decrypt = (id: string) => {
  if (typeof id === "string" && id.length >= 36) {
    return Buffer.from(id.slice(36), "base64").toString("ascii");
  }
  // throw new Error("Invalid ID format for decryption");
};