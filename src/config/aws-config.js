export const AWS_CONFIG = {
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  },
  bucketName: process.env.REACT_APP_S3_BUCKET_NAME
};