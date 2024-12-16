"use client";

import { useState, useEffect } from "react";
import { Share2, Activity } from "lucide-react";
import { ShareForm } from "@/components/share-form";
import { ProcessList } from "@/components/process-list";
import { LogViewer } from "@/components/log-viewer";
import { fetchData } from "@/lib/api";

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeProcesses, setActiveProcesses] = useState<any>({});

  useEffect(() => {
    const updateData = async () => {
      try {
        const { logs: newLogs, processes } = await fetchData();
        setLogs(prev => [...prev, ...newLogs]);
        setActiveProcesses(processes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(updateData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Share2 className="h-6 w-6" />
              <h1 className="text-2xl font-bold">RyoBoosting</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <ShareForm />
          <ProcessList processes={activeProcesses} />
          <div className="lg:col-span-2">
            <LogViewer logs={logs} onClear={() => setLogs([])} />
          </div>
        </div>
      </main>

      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <p>Powered By Ryo Evisu</p>
          </div>
        </div>
      </footer>
    </div>
  );
}