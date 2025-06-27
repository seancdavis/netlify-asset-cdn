import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  content: text().notNull().default(""),
});

export const uploads = pgTable("uploads", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  filename: varchar({ length: 255 }).notNull(),
  blob_key: varchar({ length: 255 }).notNull(),
  uploaded_at: timestamp().notNull().defaultNow(),
  metadata: text().default(""),
});
