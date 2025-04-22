import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number").notNull(),
  isIdActivated: boolean("is_id_activated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activationCodes = pgTable("activation_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  isUsed: boolean("is_used").default(false),
  usedById: integer("used_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  match: text("match").notNull(),
  league: text("league").notNull(),
  prediction: text("prediction").notNull(),
  multiplier: text("multiplier").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull(), // "Live", "Upcoming", "Completed", etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
  phoneNumber: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const activationCodeSchema = z.object({
  code: z.string().min(1, "Activation code is required"),
});

export const insertActivationCodeSchema = createInsertSchema(activationCodes).pick({
  code: true,
});

export const insertPredictionSchema = createInsertSchema(predictions);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export type ActivationCode = z.infer<typeof activationCodeSchema>;
export type InsertActivationCode = z.infer<typeof insertActivationCodeSchema>;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type User = typeof users.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;
export type ActivationCodeType = typeof activationCodes.$inferSelect;

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  activationCodes: many(activationCodes)
}));

export const activationCodesRelations = relations(activationCodes, ({ one }) => ({
  user: one(users, {
    fields: [activationCodes.usedById],
    references: [users.id]
  })
}));
