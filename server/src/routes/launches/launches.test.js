const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("should respond with 200 success", async () => {
    //NOTE This is supertest way of assertions
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);

    //NOTE The below expect is jest way but supertest has a better way as shown above
    expect(response.statusCode).toBe(200);
  });
});

describe("Test POST /launches", () => {
  const completeLaunchData = {
    mission: "USS Enterprise",
    rocket: "NCC 1111-D",
    target: "Kepler-2686 f",
    launchDate: "Januray 4,2028"
  };

  const launchDataWithoutDate = {
    mission: "USS Enterprise",
    rocket: "NCC 1111-D",
    target: "Kepler-2686 f"
  };

  const launchDataWithInvalidDate = {
    mission: "USS Enterprise",
    rocket: "NCC 1111-D",
    target: "Kepler-2686 f",
    launchDate: "chaman"
  };

  test("should respond with 201 success", async () => {
    //NOTE This is supertest way of assertions
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("content-type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    //NOTE This is jest way to check our assertions
    expect(responseDate).toBe(requestDate);
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test("should catch missing required properties", async () => {
    //NOTE This is supertest way of assertions
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("content-type", /json/)
      .expect(400);

    //NOTE This is jest way to check our assertions
    expect(response.body).toStrictEqual({
      error: "Missing required launch property"
    });
  });

  test("should catch invalid dates", async () => {
    //NOTE This is supertest way of assertions
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithInvalidDate)
      .expect("content-type", /json/)
      .expect(400);

    //NOTE This is jest way to check our assertions
    expect(response.body).toStrictEqual({ error: "Invalid Launch Date" });
  });
});