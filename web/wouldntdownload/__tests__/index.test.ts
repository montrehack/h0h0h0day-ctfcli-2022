import UserController from "../src/userController";
import * as fs from "fs";

fs.cpSync("__tests__/saveData.json", "data.json");

describe("getData", () => {
  it("should get data for a specific user if memoized, even if file deleted", async () => {
    const userData = UserController.getData("fred", "1.1.1.1");
    expect(userData).toEqual("Have a nice day!");

    fs.cpSync("data.json", "__tests__/bakdata.json");
    fs.cpSync("__tests__/badData.json", "data.json");
    const userData2 = UserController.getData("fred", "1.1.1.1");
    expect(userData2).toEqual("Have a nice day!");

    fs.cpSync("__tests__/bakdata.json", "data.json");
  });

  it("should not get data for a specific user if memoized, called with different ip", async () => {
    const userData = UserController.getData("fred", "1.1.1.1");
    expect(userData).toEqual("Have a nice day!");

    fs.cpSync("data.json", "__tests__/bakdata.json");
    fs.cpSync("__tests__/badData.json", "data.json");
    const userData2 = UserController.getData("fred", "1.1.1.2");
    expect(userData2).toEqual("Not found");
  });
});
