import { Request } from "express";
import { userData, WholeData } from "./models";
import * as fs from "fs";
import { Memoize } from "typescript-memoize";

export class UserController {
  getIP(req: Request): string {
    console.log(req.socket.remoteAddress);
    return (
      req.get("X-Forwarded-For") || req.socket.remoteAddress.replace(/^.*:/, "")
    );
  }

  // Allows to memoize on multiple parameters
  @Memoize((username: string, ip: string) => {
    return username + ";" + ip;
  })
  getData(username: string, ip: string): string {
    console.log(`Request coming from user: ${username} with ip: ${ip}`);
    const wholeData: WholeData = JSON.parse(
      fs.readFileSync("data.json", "utf8")
    );
    const users: userData[] = wholeData.users;
    let data = "Not found";
    users.forEach(function (user) {
      if (user.name === username) {
        data = user.data;
      }
    });
    return data;
  }
}

export default new UserController();
