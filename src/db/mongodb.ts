import Mongo, { Db, MongoClient } from "mongodb";
import { DATABASE_NAME, MONGODB_URL } from "../constants";

export default class MongoDb {
  client = new MongoClient(MONGODB_URL);
  db!: Db;
  file!: Mongo.Document;
  deleteFile!: Mongo.Document;

  async connect() {
    await this.client.connect();
    console.log("connected to MongoDB");

    const db = (this.db = this.client.db(DATABASE_NAME));
    this.file = db.collection("file");
    this.deleteFile = db.collection("deleteFile");
  }
}
