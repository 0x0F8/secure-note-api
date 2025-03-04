import { customAlphabet } from "nanoid";
import MongoDb from "../db/Mongodb";
import { add, formatISO } from "date-fns";

export default class ShortLinkController {
  db: MongoDb;

  constructor(db: MongoDb) {
    this.db = db;
  }

  async createShortLink(path: string) {
    let url = null;
    try {
      url = new URL(`http://test.com${path}`);
    } catch {}
    if (!url?.pathname) {
      return false;
    }

    const nanoid = customAlphabet(
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-",
      10
    );
    let shortId = nanoid();
    let success = false;
    while (!success) {
      try {
        success = await this.db.shortLink.insertOne({
          _id: shortId,
          path: `${url.pathname}${url.search}`,
          createdAt: add(formatISO(new Date()), { days: 7 }),
        });
      } catch {
        console.error("nanoid collision!");
        shortId = nanoid();
      }
    }

    return shortId;
  }

  async getShortLink(id: string) {
    const link = await this.db.shortLink.findOne({ _id: id });
    if (!link) {
      return false;
    }
    return link.path;
  }
}
