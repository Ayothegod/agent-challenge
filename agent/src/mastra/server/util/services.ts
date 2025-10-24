import { google } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";
import { MongoDBVector } from "@mastra/mongodb";

export const model = google("gemini-2.0-flash");

class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
  
  constructor(statusCode: number, data: any, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    // this.error = statusCode >= 400
  }
}

class ApiError extends Error {
  statusCode: number;
  data: null;
  success: boolean;
  errors: never[];

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const store = new MongoDBVector({
  uri: process.env.MONGODB_URI as string,
  dbName: process.env.MONGODB_DATABASE as string,
});

export { ApiResponse, ApiError, ai, store };
