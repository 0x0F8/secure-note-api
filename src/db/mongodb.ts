import Mongo, { MongoClient } from "mongodb";
import { MONGODB_URL } from "../constants";

type NoteDocument = {
  content: string;
};

export default class MongoDb {
  client = new MongoClient(MONGODB_URL);
  note!: Mongo.Document;

  async connect() {
    await this.client.connect();
    console.log("connected to MongoDB");

    const db = this.client.db("secure-note");
    this.note = db.collection<NoteDocument>("note");
  }
}
