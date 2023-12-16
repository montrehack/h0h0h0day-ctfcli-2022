import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import * as http from "http";
import { v4 as uuidv4 } from "uuid";
import UserController from "./userController";

const app: Express = express();
const port = 80;

app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res
    .cookie("user", `guest.${uuidv4()}`)
    .status(200)
    .send(
      `Don't hack us, we have your ip address: ${UserController.getIP(req)}!`
    );
});

app.get("/data", (req: Request, res: Response) => {
  const txt = UserController.getData(
    req.cookies.user,
    UserController.getIP(req)
  );
  res.status(200).send(`Here is your data: ${JSON.stringify(txt)}`);
});

const server: http.Server = http.createServer(app);
server.listen(port, () => {
  console.log(`Running on port ${port}`);
});
