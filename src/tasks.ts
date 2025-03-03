import { Agenda } from "@hokify/agenda";
import { DATABASE_NAME, MONGODB_URL } from "./constants";
import MongoDb from "./db/mongodb";
import DigitalOcean from "./api/digitalOcean";
import { formatISO } from "date-fns";

export default class Tasks {
  agenda = new Agenda({
    db: { address: `${MONGODB_URL}/${DATABASE_NAME}` },
  }).processEvery("1 minute");
  db: MongoDb;

  constructor(db: MongoDb) {
    this.db = db;
  }

  async initialize() {
    const { agenda } = this;
    agenda.define(
      "delete used one-time files",
      this.deleteUsedOneTimeFilesTask.bind(this)
    );

    await agenda.start();
    await agenda.every("1 hour", "delete used one-time files");
  }

  async deleteUsedOneTimeFilesTask() {
    console.log("task: delete used one-time files");
    const digitalOcean = new DigitalOcean();

    let bucketKeys: { Key: string }[] = [];
    let mongoIds: string[] = [];

    const deleteFromDb = async (ids: string[]) => {
      await this.db.deleteFile.deleteMany({
        _id: { $in: ids },
      });
      await this.db.file.deleteMany({
        _id: { $in: ids },
      });
    };

    const cursor = await this.db.deleteFile.find({
      deleteAfter: { $lte: formatISO(new Date()) },
    });

    for await (const document of cursor) {
      if (document) {
        bucketKeys.push({ Key: document._id });
        mongoIds.push(document._id);
      }

      if (mongoIds.length >= 50) {
        await deleteFromDb(mongoIds);
        mongoIds = [];
      }
    }

    if (mongoIds.length > 0) {
      await deleteFromDb(mongoIds);
    }

    if (bucketKeys.length === 0) {
      return;
    }

    await digitalOcean.deleteMultipleFromBucket({
      Delete: {
        Objects: bucketKeys,
      },
    });
  }
}
