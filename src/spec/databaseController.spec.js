const request = require("supertest");
const app = require("../../app");
const User = require("../models/User");
const { setupDB } = require("./setup");

jest.mock("../models/User");

setupDB();

describe("Database Controller", () => {
  const mockUserId = "user123";
  const mockDatabaseId = "db123";
  const mockDatabases = [
    { _id: mockDatabaseId, name: "Database 1", documents: [] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /:userid/databases", () => {
    it("should return all databases for a user", async () => {
      User.findById.mockResolvedValue({
        _id: mockUserId,
        databases: mockDatabases,
      });

      const response = await request(app).get(`/users/${mockUserId}/databases`);

      expect(response.statusCode).toBe(200);
      expect(response.body.databases).toEqual(mockDatabases);
    });

    it("should return 404 if user not found", async () => {
      User.findById.mockResolvedValue(null);

      const response = await request(app).get(`/users/${mockUserId}/databases`);

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("User Not Found");
    });

    it("should handle server error", async () => {
      User.findById.mockRejectedValue(new Error("Server error"));

      const response = await request(app).get(`/users/${mockUserId}/databases`);

      expect(response.statusCode).toBe(500);
    });
  });

  describe("POST /:userid/databases", () => {
    const newDatabaseData = {
      dbName: "New DB",
      fields: [
        { fieldName: "Field1", fieldType: "Type1", fieldValue: "Value1" },
      ],
    };

    it("should create a database", async () => {
      const mockCreateMethod = jest.fn().mockResolvedValue({
        _id: "newDbId",
        name: newDatabaseData.dbName,
        documents: [
          {
            fields: newDatabaseData.fields.map((field, index) => ({
              ...field,
              yCoordinate: index * 40,
            })),
          },
        ],
      });

      const mockUser = {
        _id: mockUserId,
        databases: [],
        save: jest.fn().mockResolvedValue({}),
      };

      mockUser.databases.create = mockCreateMethod;
      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .post(`/users/${mockUserId}/databases`)
        .send(newDatabaseData);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBeTruthy();
    });

    it("should return 404 if user not found", async () => {
      User.findById.mockResolvedValue(null);

      const response = await request(app)
        .post(`/users/${mockUserId}/databases`)
        .send(newDatabaseData);

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("User Not Found");
    });

    it("should handle server error", async () => {
      User.findById.mockRejectedValue(new Error("Server error"));

      const response = await request(app)
        .post(`/users/${mockUserId}/databases`)
        .send(newDatabaseData);

      expect(response.statusCode).toBe(500);
    });
  });

  describe("GET /:userid/databases/:databaseid", () => {
    it("should retrieve a specific database", async () => {
      User.findOne.mockResolvedValue({ databases: mockDatabases });

      const response = await request(app).get(
        `/users/${mockUserId}/databases/${mockDatabaseId}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.database).toBeDefined();
    });

    it("should return 404 if database not found", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).get(
        `/users/${mockUserId}/databases/${mockDatabaseId}`
      );

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("Database Not Found");
    });

    it("should handle server error", async () => {
      User.findOne.mockRejectedValue(new Error("Server error"));

      const response = await request(app).get(
        `/users/${mockUserId}/databases/${mockDatabaseId}`
      );

      expect(response.statusCode).toBe(500);
    });
  });

  describe("DELETE /:userid/databases/:databaseid", () => {
    it("should delete a specific database", async () => {
      const mockPullMethod = jest.fn();

      const mockUser = {
        databases: {
          pull: mockPullMethod,
        },
        save: jest.fn().mockResolvedValue({}),
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app).delete(
        `/users/${mockUserId}/databases/${mockDatabaseId}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBeDefined();
    });

    it("should return 404 if database not found", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).delete(
        `/users/${mockUserId}/databases/${mockDatabaseId}`
      );

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe("Database Not Found");
    });

    it("should handle server error", async () => {
      User.findOne.mockRejectedValue(new Error("Server error"));

      const response = await request(app).delete(
        `/users/${mockUserId}/databases/${mockDatabaseId}`
      );

      expect(response.statusCode).toBe(500);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
