import { User } from "@/types/user";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db.json");

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }));
}

export const db = {
  getUsers: (): User[] => JSON.parse(fs.readFileSync(DB_PATH, "utf-8")).users,
  getUser: (userId: string): User | null => {
    const user: User | null = JSON.parse(
      fs.readFileSync(DB_PATH, "utf-8"),
    ).users.find((u: User) => u.id === userId);

    return user ?? null;
  },
  saveUser: (user: User) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    data.users.push(user);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  },
  updateUser: (userId: string, input: Partial<User>) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));

    const userIndex = data.users.findIndex((u: User) => u.id === userId);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    data.users[userIndex] = {
      ...data.users[userIndex],
      ...input,
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

    return data.users[userIndex];
  },
};
