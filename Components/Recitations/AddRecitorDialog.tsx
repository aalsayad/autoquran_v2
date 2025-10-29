"use client";

import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/Components/ui/dialog";

type AddRecitorDialogProps = {
  trigger: React.ReactNode;
  onAdd: (name: string, id: string) => void;
};

export function AddRecitorDialog({ trigger, onAdd }: AddRecitorDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Recitor name is required.");
      return;
    }
    // Generate a simple ID (replace with proper DB insertion later)
    const id = `recitor-${Date.now()}`;
    onAdd(trimmed, id);
    setName("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Recitor</DialogTitle>
        </DialogHeader>

        <form className="grid gap-4 mt-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Recitor Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Abdul Rahman Al-Sudais"
              className="w-full border rounded-lg px-3 py-2 bg-background"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAdd}>Add Recitor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
