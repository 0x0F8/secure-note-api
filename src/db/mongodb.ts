import Mongo, { MongoClient } from "mongodb";
import { MONGODB_URL } from "../constants";

type NoteDocument = {
    content: string
}

export default class MongoDb {
    client = new MongoClient(MONGODB_URL)
    note!: Mongo.Document

    async connect() {
        await this.client.connect()
        console.log('Connected to MongoDB')

        const db = this.client.db()
        this.note = db.collection<NoteDocument>('note')
    }
}
