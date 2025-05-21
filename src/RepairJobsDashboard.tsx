import React, { useState, FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

const statusOptions = ["Pending", "In Progress", "Completed", "Cancelled"] as const;
type Status = (typeof statusOptions)[number];


export function RepairJobsDashboard() {
  const repairJobs = useQuery(api.repairJobs.listRepairJobs) || [];
  const addRepairJob = useMutation(api.repairJobs.addRepairJob);
  const updateJobStatus = useMutation(api.repairJobs.updateJobStatus);

  const [customerName, setCustomerName] = useState("");
  const [deviceDescription, setDeviceDescription] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!customerName || !deviceDescription || !issueDescription) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await addRepairJob({
        customerName,
        deviceDescription,
        issueDescription,
      });
      setCustomerName("");
      setDeviceDescription("");
      setIssueDescription("");
    } catch (error) {
      console.error("Failed to add repair job:", error);
      alert("Failed to add repair job.");
    }
  };

  const handleStatusChange = async (jobId: Id<"repairJobs">, newStatus: Status) => {
    try {
      await updateJobStatus({ jobId, newStatus });
    } catch (error) {
      console.error("Failed to update job status:", error);
      alert("Failed to update job status.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Repair Jobs Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-secondary">Add New Repair Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="deviceDescription" className="block text-sm font-medium text-gray-700">
              Device Description (e.g., iPhone 12, Dell XPS 15)
            </label>
            <input
              type="text"
              id="deviceDescription"
              value={deviceDescription}
              onChange={(e) => setDeviceDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700">
              Issue Description
            </label>
            <textarea
              id="issueDescription"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover transition-colors shadow-sm hover:shadow disabled:opacity-50"
          >
            Add Job
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-secondary">Current Repair Jobs</h2>
        {repairJobs.length === 0 ? (
          <p className="text-gray-600">No repair jobs found.</p>
        ) : (
          <div className="space-y-4">
            {repairJobs.map((job) => (
              <div key={job._id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-primary-dark">{job.customerName} - {job.deviceDescription}</h3>
                <p className="text-sm text-gray-700 mt-1"><strong>Issue:</strong> {job.issueDescription}</p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Status:</strong>
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job._id, e.target.value as Status)}
                    className="ml-2 p-1 border border-gray-300 rounded-md text-sm"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </p>
                <p className="text-xs text-gray-500 mt-2">Job ID: {job._id}</p>
                <p className="text-xs text-gray-500">Created: {new Date(job._creationTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
