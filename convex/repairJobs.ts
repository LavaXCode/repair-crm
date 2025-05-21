import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const addRepairJob = mutation({
  args: {
    customerName: v.string(),
    deviceDescription: v.string(),
    issueDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const jobId = await ctx.db.insert("repairJobs", {
      customerName: args.customerName,
      deviceDescription: args.deviceDescription,
      issueDescription: args.issueDescription,
      status: "Pending",
      userId: userId,
    });
    return jobId;
  },
});

export const listRepairJobs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      // Return empty array or throw error if user must be logged in to see any jobs
      return [];
    }
    // Fetch jobs created by the logged-in user, ordered by creation time
    const jobs = await ctx.db
      .query("repairJobs")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return jobs;
  },
});

export const updateJobStatus = mutation({
  args: {
    jobId: v.id("repairJobs"),
    newStatus: v.union(
      v.literal("Pending"),
      v.literal("In Progress"),
      v.literal("Completed"),
      v.literal("Cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const job = await ctx.db.get(args.jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    // Optional: Check if the job belongs to the current user before updating
    if (job.userId !== userId) {
      throw new Error("User not authorized to update this job");
    }

    await ctx.db.patch(args.jobId, { status: args.newStatus });
    return true;
  },
});

export const getJobById = query({
  args: { jobId: v.id("repairJobs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const job = await ctx.db.get(args.jobId);
    if (job && job.userId === userId) {
      return job;
    }
    return null;
  }
})
