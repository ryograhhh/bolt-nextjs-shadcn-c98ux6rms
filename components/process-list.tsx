"use client";

import { useState } from "react";
import { Search, Square, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { stopShare, deleteShare } from "@/lib/api";
import { AdminActionDialog } from "./admin-action-dialog";
import type { ShareProcess, ProcessGroup } from "@/lib/types";

interface ProcessListProps {
  processes: Record<string, ShareProcess>;
}

export function ProcessList({ processes }: ProcessListProps) {
  const [searchPostLink, setSearchPostLink] = useState("");
  const { toast } = useToast();

  const filteredProcesses = Object.entries(processes).filter(([_, process]) =>
    process.post_link.toLowerCase().includes(searchPostLink.toLowerCase())
  );

  const handleStop = async (processId: string, password: string) => {
    try {
      await stopShare(processId, null, password);
      toast({ title: "Success", description: "Share process stopped successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleDelete = async (processId: string, password: string) => {
    try {
      await deleteShare(processId, null, password);
      toast({ title: "Success", description: "Process deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleStopByPostLink = async (postLink: string, password: string) => {
    try {
      await stopShare(null, postLink, password);
      toast({ title: "Success", description: "All processes for this post link stopped successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleDeleteByPostLink = async (postLink: string, password: string) => {
    try {
      await deleteShare(null, postLink, password);
      toast({ title: "Success", description: "All processes for this post link deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const processesByPostLink = filteredProcesses.reduce<Record<string, ProcessGroup>>((acc, [id, process]) => {
    const link = process.post_link;
    if (!acc[link]) {
      acc[link] = { processes: [], totalShares: 0, completedShares: 0 };
    }
    acc[link].processes.push({ id, ...process });
    acc[link].totalShares += process.share_count;
    acc[link].completedShares += process.current_count;
    return acc;
  }, {});

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Active Processes</h2>
        <div className="flex w-full sm:w-auto space-x-2">
          <Input
            value={searchPostLink}
            onChange={(e) => setSearchPostLink(e.target.value)}
            placeholder="Search by post link"
            className="w-full sm:w-48"
          />
          <Search className="w-6 h-6" />
        </div>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="space-y-6">
          {Object.entries(processesByPostLink).map(([postLink, group]) => (
            <Card key={postLink} className="p-4">
              <div className="mb-4">
                <h3 className="font-medium">Post Link: {postLink}</h3>
                <p className="text-sm text-muted-foreground">
                  Total Progress: {group.completedShares}/{group.totalShares} shares
                </p>
                <div className="flex gap-2 mt-2">
                  <AdminActionDialog
                    title="Stop All Processes"
                    actionLabel="Stop All"
                    icon={Square}
                    buttonVariant="destructive"
                    onConfirm={(password) => handleStopByPostLink(postLink, password)}
                  />
                  <AdminActionDialog
                    title="Delete All Processes"
                    actionLabel="Delete All"
                    icon={Trash2}
                    buttonVariant="outline"
                    onConfirm={(password) => handleDeleteByPostLink(postLink, password)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                {group.processes.map((process) => (
                  <div key={process.id} className="border-t pt-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <p className="font-medium">Process ID: {process.id}</p>
                        <p>Status: {process.status}</p>
                        <p>Progress: {process.progress}%</p>
                        <p>Count: {process.current_count}/{process.share_count}</p>
                      </div>
                      <div className="flex gap-2">
                        <AdminActionDialog
                          title="Stop Process"
                          actionLabel="Stop"
                          icon={Square}
                          buttonVariant="destructive"
                          onConfirm={(password) => handleStop(process.id, password)}
                          disabled={process.status !== "running"}
                        />
                        <AdminActionDialog
                          title="Delete Process"
                          actionLabel="Delete"
                          icon={Trash2}
                          buttonVariant="outline"
                          onConfirm={(password) => handleDelete(process.id, password)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}