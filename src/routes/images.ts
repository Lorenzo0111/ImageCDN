import { Hono } from "hono";
import { compressImage } from "../lib/images";
import { prisma } from "../lib/prisma";
import { stream } from "hono/streaming";

export const imagesRoute = new Hono()
  .post("/upload", async (ctx) => {
    const body = await ctx.req.formData();
    const file = body.get("file");

    if (!file || !(file instanceof File))
      return ctx.json({ error: "No file found" }, 400);

    const buffer = await file.arrayBuffer();

    if (!file.type.startsWith("image/"))
      return ctx.json({ error: "Invalid file type" }, 400);

    if (buffer.byteLength > 5 * 1024 * 1024)
      return ctx.json({ error: "File is too large" }, 400);

    const optimized = await compressImage(buffer);
    const unit8Array = new Uint8Array(optimized);

    const record = await prisma.file.create({
      data: {
        name: file.name,
        data: unit8Array,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        deleteKey: true,
      },
    });

    return ctx.json(record);
  })
  .get("/:id", async (ctx) => {
    const id = ctx.req.param("id");

    const record = await prisma.file.findUnique({
      where: { id: id },
      select: {
        data: true,
        name: true,
      },
    });

    if (!record) return ctx.json({ error: "File not found" }, 404);

    ctx.header("Content-Type", "image/webp");
    ctx.header("Content-Length", record.data.length.toString());
    ctx.header("Content-Disposition", `inline; filename="${record.name}.webp"`);
    ctx.header("Cache-Control", "public, max-age=604800, immutable");

    return stream(ctx, async (s) => {
      const buffer = record.data;
      await s.write(buffer);
    });
  })
  .get("/:id/metadata", async (ctx) => {
    const id = ctx.req.param("id");

    const record = await prisma.file.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    if (!record) return ctx.json({ error: "File not found" }, 404);

    return ctx.json(record);
  })
  .get("/random", async (ctx) => {
    const count = await prisma.file.count();
    const random = Math.floor(Math.random() * count);

    const record = await prisma.file.findFirst({
      skip: random,
      select: { id: true },
    });

    if (!record) return ctx.json({ error: "No files found" }, 404);

    return ctx.redirect(`/${record.id}`);
  })
  .delete("/:id", async (ctx) => {
    const id = ctx.req.param("id");
    const body = await ctx.req.json();

    if (!body.deleteKey || typeof body.deleteKey !== "string")
      return ctx.json({ error: "Invalid delete key" }, 400);

    const record = await prisma.file.delete({
      where: { id: id, deleteKey: body.deleteKey },
      select: { id: true, name: true, createdAt: true },
    });

    if (!record)
      return ctx.json({ error: "File not found or invalid delete key" }, 404);

    return ctx.json(record);
  });
