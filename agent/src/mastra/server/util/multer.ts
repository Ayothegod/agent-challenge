import { multer } from "@hono/multer";

const upload = multer({ dest: "uploads/" });