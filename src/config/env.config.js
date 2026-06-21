import dotenv from "dotenv";
import { cleanEnv, str, port, url } from "envalid";

dotenv.config();

const validators = {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
    desc: "Environment type",
  }),

  PORT: port({ devDefault: 5000 }),

  FRONTEND_URL: url({
    default: "http://localhost:3000",
    desc: "Frontend URL",
  }),
};

export const env = cleanEnv(process.env, validators, {
  reporter: ({ errors }) => {
    const invalidVars = Object.keys(errors);

    if (invalidVars.length) {
      throw new Error(
        `Invalid environment variables: ${invalidVars.join(", ")}`,
      );
    }
  },
});
