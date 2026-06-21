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

  MONGODB_URI: str({ desc: "MongoDB connection string" }),
  FRONTEND_URL: url({ desc: "Frontend URL" }),
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
