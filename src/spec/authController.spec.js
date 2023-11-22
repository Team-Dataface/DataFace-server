const request = require("supertest");
const app = require("../../app");
const jwt = require("../service/jwtUtils");
const User = require("../models/User");
const { setupDB } = require("./setup");

jest.mock("../service/jwtUtils");
jest.mock("../models/User");
jest.mock("../middlewares/verifyToken");

const { verifyToken } = require("../middlewares/verifyToken");

setupDB();

describe.only("Auth Controller", () => {
  describe("POST /login", () => {
    it("should create a new user and return token", async () => {
      const mockUser = {
        _id: "1",
        username: "testuser",
        email: "test@example.com",
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);
      User.findByIdAndUpdate.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("fake_access_token");
      jwt.refresh.mockReturnValue("fake_refresh_token");

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", username: "testuser" });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBeTruthy();
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    describe("POST /login - Error Cases", () => {
      it("should handle server error", async () => {
        User.findOne.mockRejectedValue(new Error("Server error")); // Simulate server error

        const response = await request(app)
          .post("/auth/login")
          .send({ email: "test@example.com", username: "testuser" });

        expect(response.statusCode).toBe(500);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });
    });
  });

  describe("POST /logout", () => {
    it("should clear the access token", async () => {
      const response = await request(app).post("/auth/logout");
      const cookie = response.headers["set-cookie"][0];

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(cookie).toMatch(/Expires=Thu, 01 Jan 1970 00:00:00 GMT/);
    });
  });

  describe("POST /logout - Error Cases", () => {
    it("should handle server error", async () => {
      const mockClearCookie = jest.fn().mockImplementationOnce(() => {
        throw new Error("Server error");
      });
      app.response.clearCookie = mockClearCookie;

      const response = await request(app).post("/auth/logout");

      expect(response.statusCode).toBe(500);
    });
  });

  describe("GET /check", () => {
    it("should return user info if verified", async () => {
      verifyToken.mockImplementation((req, res, next) => {
        next();
      });

      const mockUser = { _id: "1", username: "testuser" };

      User.findById.mockResolvedValue(mockUser);

      const response = await request(app).get("/auth/check");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBeTruthy();
    });
  });
});
