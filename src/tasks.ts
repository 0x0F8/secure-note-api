import { Agenda } from "@hokify/agenda";
import { DATABASE_NAME, MONGODB_URL } from "./constants";
import MongoDb from "./db/Mongodb";
import DigitalOcean from "./api/DigitalOcean";
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
    agenda.define(
      "delete expired short links",
      this.deleteExpiredLinksTask.bind(this)
    );

    await agenda.start();
    await agenda.every("5 minute", "delete used one-time files");
    await agenda.every("6 hour", "delete expired short links");
  }

  async deleteExpiredLinksTask() {
    console.log("task: delete expired short links");
    await this.db.shortLink.deleteMany({
      createdAt: { $lte: formatISO(new Date()) },
    });
  }

  async deleteUsedOneTimeFilesTask() {
    console.log("task: delete used one-time files");
    const digitalOcean = new DigitalOcean();

    let deletedCount = 0;
    let bucketKeys: { Key: string }[] = [];
    let mongoIds: string[] = [];

    const deleteFromDb = async (ids: string[]) => {
      deletedCount += ids.length;
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
    console.log(`task: delete ${deletedCount} files`);
  }
}
