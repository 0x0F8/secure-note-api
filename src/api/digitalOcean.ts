import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3,
} from "@aws-sdk/client-s3";
import {
  SPACES_ACCESS_KEY,
  SPACES_HOST,
  SPACES_REGION,
  SPACES_SECRET_KEY,
} from "../constants";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type WithDefaults<T> = Omit<T, "Bucket">;

export default class DigitalOcean {
  s3client = new S3({
    forcePathStyle: false,
    endpoint: `https://${SPACES_HOST}`,
    region: SPACES_REGION,
    credentials: {
      accessKeyId: SPACES_ACCESS_KEY,
      secretAccessKey: SPACES_SECRET_KEY,
    },
  });
  readonly defaultBucket = "secrypt";

  protected defaultOptions() {
    return {
      Bucket: this.defaultBucket,
    };
  }

  uploadToBucket(options: WithDefaults<PutObjectCommandInput>) {
    return this.s3client.send(
      new PutObjectCommand({ ...this.defaultOptions(), ...options })
    );
  }

  getFromBucket(options: WithDefaults<GetObjectCommandInput>) {
    return this.s3client.send(
      new GetObjectCommand({ ...this.defaultOptions(), ...options })
    );
  }

  deleteMultipleFromBucket(options: WithDefaults<DeleteObjectsCommandInput>) {
    return this.s3client.send(
      new DeleteObjectsCommand({ ...this.defaultOptions(), ...options })
    );
  }

  generateBucketPresignedUrl(key: string) {
    const command = new GetObjectCommand({
      ...this.defaultOptions(),
      Key: key,
    });
    return getSignedUrl(this.s3client, command, { expiresIn: 60 });
  }
}
