import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  repairJobs: defineTable({
    customerName: v.string(),
    deviceDescription: v.string(),
    issueDescription: v.string(),
    status: v.union(
      v.literal("Pending"),
      v.literal("In Progress"),
      v.literal("Completed"),
      v.literal("Cancelled")
    ),
    userId: v.id("users"), // To associate jobs with the user who created them
  })
  .index("by_userId", ["userId"])
  .index("by_status", ["status"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
