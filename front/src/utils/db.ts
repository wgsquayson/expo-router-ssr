import { User } from "@/types/user";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db.json");

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }));
}

export const db = {
  getUsers: (): User[] => JSON.parse(fs.readFileSync(DB_PATH, "utf-8")).users,
  saveUser: (user: User) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    data.users.push(user);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  },
};
