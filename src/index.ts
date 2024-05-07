import { Hono } from "hono";
import { app as contents } from "./controllers/contents";

const app = new Hono();

app.route("/", contents);

export default app;
