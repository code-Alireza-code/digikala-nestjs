import { Transform } from "class-transformer";

export const ToBoolean = () =>
  Transform(({ value }) => {
    if (typeof value === "boolean") return value;

    if (typeof value === "string") {
      switch (value.trim().toLowerCase()) {
        case "true":
        case "1":
          return true;
        case "false":
        case "0":
          return false;
      }
    }

    return value;
  });
