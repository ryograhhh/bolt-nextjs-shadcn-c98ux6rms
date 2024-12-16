"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { startShare } from "@/lib/api";

export function ShareForm() {
  const [cookies, setCookies] = useState("");
  const [postLink, setPostLink] = useState("");
  const [shareCount, setShareCount] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cookies || !postLink || !shareCount) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    try {
      await startShare(cookies, postLink, parseInt(shareCount));
      toast({ title: "Success", description: "Share process started successfully" });
      setCookies("");
      setPostLink("");
      setShareCount("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Start Share Process</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cookies</label>
          <Input
            value={cookies}
            onChange={(e) => setCookies(e.target.value)}
            placeholder="Enter cookies"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Post Link</label>
          <Input
            value={postLink}
            onChange={(e) => setPostLink(e.target.value)}
            placeholder="Enter post link"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Share Count</label>
          <Input
            type="number"
            value={shareCount}
            onChange={(e) => setShareCount(e.target.value)}
            placeholder="Enter share count"
          />
        </div>
        <Button type="submit" className="w-full">
          <Play className="w-4 h-4 mr-2" />
          Start Share
        </Button>
      </form>
    </Card>
  );
}