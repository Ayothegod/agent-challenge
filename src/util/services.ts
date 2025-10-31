import { google } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";
import { PineconeVector } from "@mastra/pinecone";
import crypto from "crypto";

export const model = google("gemini-2.0-flash");

export class ApiResponse {
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

export class ApiError extends Error {
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

export const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const store = new PineconeVector({
  apiKey: process.env.PINECONE_API_KEY as string,
});

export type ErrorProps = {
  error: unknown;
  reset?: () => void;
  showStack?: boolean;
};

export const hashSummary = (summary: string) => {
  return crypto.createHash("sha256").update(summary).digest("hex");
};
