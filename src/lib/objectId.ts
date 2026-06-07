import { ObjectId } from "mongodb";

export function toObjectId(id: string) {
  return new ObjectId(id);
}
