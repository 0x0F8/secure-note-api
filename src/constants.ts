export const DATABASE_NAME = "secrypt";

export const PORT = !Number.isNaN(process.env.PORT)
  ? Number(process.env.PORT)
  : 80;
export const NODE_ENV = process.env.NODE_ENV;
export const IS_DEV = NODE_ENV !== "production";
export const IS_PROD = !IS_DEV;
export const MONGODB_URL = process.env.MONGODB_URL!;
export const CORS = (process.env.CORS || "").split(",");

export const SPACES_ACCESS_KEY = process.env.SPACES_ACCESS_KEY!;
export const SPACES_SECRET_KEY = process.env.SPACES_SECRET_KEY!;
export const SPACES_HOST = process.env.SPACES_HOST!;
export const SPACES_REGION = process.env.SPACES_REGION!;

export const FILE_CREATE_MULTIPART_THRESHOLD_MB = !Number.isNaN(
  process.env.FILE_CREATE_MULTIPART_THRESHOLD_MB
)
  ? Number(process.env.FILE_CREATE_MULTIPART_THRESHOLD_MB)
  : 100;
