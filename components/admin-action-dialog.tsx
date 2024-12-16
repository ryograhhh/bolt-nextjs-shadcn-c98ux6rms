"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface AdminActionDialogProps {
  title: string;
  actionLabel: string;
  icon: LucideIcon;
  buttonVariant?: "default" | "destructive" | "outline";
  onConfirm: (password: string) => Promise<void>;
  disabled?: boolean;
}

export function AdminActionDialog({
  title,
  actionLabel,
  icon: Icon,
  buttonVariant = "default",
  onConfirm,
  disabled = false,
}: AdminActionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm(password);
      setIsOpen(false);
      setPassword("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} disabled={disabled}>
          <Icon className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={handleConfirm}
            className="w-full"
            disabled={!password || isLoading}
          >
            {isLoading ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}