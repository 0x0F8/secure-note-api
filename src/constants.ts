export const PORT = Number(process.env.PORT) || 80
export const NODE_ENV = process.env.NODE_ENV
export const IS_DEV = NODE_ENV !== 'production'
export const IS_PROD = !IS_DEV
export const MONGODB_URL = process.env.MONGODB_URL!