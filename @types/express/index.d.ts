import MongoDb from "../../src/db/mongodb";
import DigitalOcean from "../../src/api/digitalOcean";

declare module "express" {
  export interface Locals {
    db: MongoDb;
    api: {
      digitalOcean: DigitalOcean;
    };
  }
}
