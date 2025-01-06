

const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "DATABASE_URL",
] as const;

const optionalEnvVars = [
] as const;

console.info("READING ENVIRONMENT VARIABLES");

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`===> The environment variable ${key} is not defined`);
  }
});

function getRequiredEnvVar(key: typeof requiredEnvVars[number]): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`La variable de entorno ${key} no está definida`);
  }
  return value;
}

function getOptionalEnvVar(key: typeof optionalEnvVars[number]): string | undefined {
  return process.env[key] || undefined;
}

export const {
PORT,
NODE_ENV,
DATABASE_URL
} = {
PORT: getRequiredEnvVar('PORT'),
NODE_ENV: getRequiredEnvVar('NODE_ENV'),
DATABASE_URL: getRequiredEnvVar('DATABASE_URL')
} as const;

export const isDebug = (): boolean => {
  const isDebugMode = NODE_ENV === "development";
  isDebugMode && console.warn("ATTENTION: NODE_ENV is set to development");
  return isDebugMode;
};


