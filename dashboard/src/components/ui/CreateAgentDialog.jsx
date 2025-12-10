import { useState } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { createAgent } from "@/lib/utils";
import { toast } from "sonner";

export function CreateAgentDialog({ open, onOpenChange, onCreated, initialAgentName = "" }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await createAgent(data.full_name, data.certificate_no, data.qualification);
      
      if (result && result.success) {
        // Call the callback with the new agent
        if (onCreated) {
          onCreated({
            name: result.message.name,
            value: result.message.name,
            label: result.message.full_name,
          });
        }
        
        reset();
        onOpenChange(false);
      } else {
        toast.error("Failed to Create Agent", {
          description: result?.message || "Please try again",
          duration: 5000,
        });
      }
    } catch (err) {
      toast.error("Server Error", {
        description: "Unable to create agent. Please try again later.",
        duration: 5000,
      });
      console.error("Agent creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open && initialAgentName) {
      setValue("full_name", initialAgentName);
    }
  }, [open, initialAgentName, setValue]);

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Enter agent details to create a new agent.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">
                Agent Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                {...register("full_name", {
                  required: "Full name is required",
                })}
                placeholder="Enter agent full name"
                className={errors.full_name ? "border-red-500" : ""}
              />
              {errors.full && (
                <p className="text-sm text-red-500">{errors.full.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="certificate_no">Certificate Number</Label>
              <Input
                id="certificate_no"
                {...register("certificate_no")}
                placeholder="Enter certificate number (optional)"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                {...register("qualification")}
                placeholder="Enter qualification (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Agent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

