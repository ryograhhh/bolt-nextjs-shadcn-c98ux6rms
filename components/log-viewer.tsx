"use client";

import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { clearLogs } from "@/lib/api";

interface LogViewerProps {
  logs: string[];
  onClear: () => void;
}

export function LogViewer({ logs, onClear }: LogViewerProps) {
  const { toast } = useToast();

  const handleClearLogs = async () => {
    try {
      await clearLogs();
      onClear();
      toast({ title: "Success", description: "Logs cleared successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear logs",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Logs</h2>
        <Button variant="outline" onClick={handleClearLogs}>
          <X className="w-4 h-4 mr-2" />
          Clear Logs
        </Button>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {logs.map((log, index) => (
            <p key={index} className="text-sm">
              {log}
            </p>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}