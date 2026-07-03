"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type JobState = {
  status: "PENDING" | "PROCESSING" | "COMPLETE" | "FAILED";
  failureReason?: string;
  songId?: string;
};

export default function JobStatusPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobState | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval>;

    async function poll() {
      try {
        const res = await fetch(`/api/jobs/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Job not found");
          } else {
            setError("Failed to check status");
          }
          clearInterval(interval);
          return;
        }

        const data = await res.json();

        if (!cancelled) {
          setJob(data);

          if (data.status === "COMPLETE") {
            clearInterval(interval);
            setTimeout(() => {
              if (!cancelled) {
                router.push(`/songs/${data.songId}`);
              }
            }, 1000);
          } else if (data.status === "FAILED") {
            clearInterval(interval);
          }
        }
      } catch {
        if (!cancelled) {
          setError("Network error");
        }
      }
    }

    poll();
    interval = setInterval(poll, 2000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [params.id, router]);

  function statusDisplay() {
    if (error) {
      return { icon: "⚠", text: error, color: "text-red-400" };
    }

    if (!job) {
      return { icon: "○", text: "Starting...", color: "text-zinc-400" };
    }

    switch (job.status) {
      case "PENDING":
        return { icon: "○", text: "Queued...", color: "text-yellow-400" };
      case "PROCESSING":
        return { icon: "◌", text: "Generating your song...", color: "text-blue-400" };
      case "COMPLETE":
        return { icon: "✓", text: "Complete! Redirecting...", color: "text-green-400" };
      case "FAILED":
        return { icon: "✕", text: job.failureReason || "Generation failed", color: "text-red-400" };
    }
  }

  const status = statusDisplay();

  return (
    <div className="mx-auto mt-16 max-w-sm text-center">
      <div className={`mb-4 text-4xl ${status.color}`}>{status.icon}</div>
      <p className={`mb-8 text-lg ${status.color}`}>{status.text}</p>

      {job?.status === "FAILED" && (
        <Link
          href="/generate"
          className="rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-green-500"
        >
          Try again
        </Link>
      )}
    </div>
  );
}
