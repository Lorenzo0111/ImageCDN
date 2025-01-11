import { Hono } from "hono";
import { imagesRoute } from "./routes/images";
import { prisma } from "./lib/prisma";

const app = new Hono()
  .get("/", async (ctx) => {
    const count = await prisma.file.count();

    return ctx.json({
      status: "online",
      version: "1.0.0",
      author: "Lorenzo0111",
      images: count,
    });
  })
  .route("/images", imagesRoute);

export default app;
