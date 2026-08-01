"use client";

import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";

export default function AddGuestForm({ token }: { token: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/api/families/guests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (res.ok) {
        setFirstName("");
        setLastName("");
        setIsOpen(false);
        window.location.reload(); // Quickest way to refresh server data
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-4 border-2 border-dashed border-primary/40 rounded-xl flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Add Family Member
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border border-border bg-muted/10 rounded-xl space-y-4">
      <h3 className="font-medium text-foreground">New Family Member</h3>
      <div className="grid grid-cols-2 gap-4">
        <input 
          type="text" 
          placeholder="First Name" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary"
          required 
        />
        <input 
          type="text" 
          placeholder="Last Name" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary"
          required 
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button 
          type="button" 
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading || !firstName || !lastName}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Member"}
        </button>
      </div>
    </form>
  );
}
