import { DigitalHumani } from "../index.js";
import "dotenv/config";

const apiKey = process.env.TEST_API_KEY;

test("Instance Initialization and Validation", () => {
  expect(() => new DigitalHumani()).toThrow();
  const dh = new DigitalHumani({
    apiKey: "abc",
    environment: "local",
    enterpriseId: "abcd1234",
  });
  expect(dh).toEqual({
    apiKey: "abc",
    baseUrl: "http://localhost:3000",
    environment: "local",
    enterpriseId: "abcd1234",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "DigitalHumani Node SDK",
      "X-API-KEY": "abc",
    },
  });
});

test("Enterprise request", async () => {
  const dh = new DigitalHumani({
    apiKey,
    environment: "local",
    enterpriseId: "043d27bb",
  });

  // test using default of dh instances enterpriseId
  const data1 = await dh.enterprise();
  expect(typeof data1).toBe("object");

  // test providing enterpriseId
  const data2 = await dh.enterprise("043d27bb");
  expect(typeof data2).toBe("object");
});

test("Projects request", async () => {
  const dh = new DigitalHumani({
    apiKey,
    environment: "local",
    enterpriseId: "043d27bb",
  });
  const data = await dh.projects();
  expect(typeof data).toBe("object");
});

test("Project request", async () => {
  const dh = new DigitalHumani({
    apiKey,
    environment: "local",
    enterpriseId: "043d27bb",
  });
  const data = await dh.project("14141414");
  expect(typeof data).toBe("object");
});

test("Plant a tree request", async () => {
  const dh = new DigitalHumani({
    apiKey,
    environment: "local",
    enterpriseId: "043d27bb",
  });
  const data = await dh.plantTree("14141414", "Nikolaso");
  expect(typeof data).toBe("object");
});

test("Get a tree request", async () => {
  const dh = new DigitalHumani({
    apiKey,
    environment: "local",
    enterpriseId: "043d27bb",
  });
  const data = await dh.tree("327dee3b-c7fe-4538-b050-2ecfb95436e7");
  expect(typeof data).toBe("object");
});
