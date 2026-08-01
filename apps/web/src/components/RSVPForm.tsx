"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, User, Utensils, Bed } from "lucide-react";
import Link from "next/link";

export default function RSVPForm({ guests, token }: { guests: any[]; token: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Local state to keep track of form inputs for all guests
  const [responses, setResponses] = useState(
    guests.reduce((acc, guest) => ({
      ...acc,
      [guest.id]: {
        isAttending: guest.isAttending ?? true,
        dietaryRestrictions: guest.dietaryRestrictions || "",
        accommodationNeeded: guest.accommodationNeeded || false,
      }
    }), {})
  );

  const handleUpdate = (guestId: string, field: string, value: any) => {
    setResponses((prev: any) => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Submit all guests sequentially (or via Promise.all)
      for (const guest of guests) {
        const responseData = responses[guest.id];
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/api/families/rsvp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            guestId: guest.id,
            ...responseData
          })
        });

        if (!res.ok) {
          throw new Error("Failed to submit RSVP for " + guest.firstName);
        }
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 rounded-3xl p-10 text-center shadow-sm"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-primary" />
        </div>
        <h2 className="text-3xl font-serif mb-4">Thank You!</h2>
        <p className="text-muted-foreground text-lg font-light mb-8">
          Your response has been saved successfully. We can't wait to celebrate with you!
        </p>
        <Link href="/dashboard">
          <button className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 font-medium text-primary-foreground hover:bg-primary/90 transition-all">
            Return to Dashboard
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-center">
          {error}
        </div>
      )}

      {guests.map((guest) => (
        <motion.div 
          key={guest.id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center border-b border-border/30 pb-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
              <User className="w-5 h-5 text-secondary-foreground" />
            </div>
            <h2 className="text-2xl font-serif">{guest.firstName} {guest.lastName}</h2>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">Will you be attending?</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleUpdate(guest.id, 'isAttending', true)}
                className={`flex-1 py-3 rounded-xl border transition-all ${
                  responses[guest.id].isAttending 
                    ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                    : 'bg-background text-muted-foreground border-border hover:bg-muted/50'
                }`}
              >
                Joyfully Accepts
              </button>
              <button
                type="button"
                onClick={() => handleUpdate(guest.id, 'isAttending', false)}
                className={`flex-1 py-3 rounded-xl border transition-all ${
                  responses[guest.id].isAttending === false
                    ? 'bg-secondary text-secondary-foreground border-secondary shadow-md' 
                    : 'bg-background text-muted-foreground border-border hover:bg-muted/50'
                }`}
              >
                Regretfully Declines
              </button>
            </div>
          </div>

          {responses[guest.id].isAttending && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-6 pt-4"
            >
              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-foreground">
                  <Utensils className="w-4 h-4 mr-2 text-muted-foreground" />
                  Dietary Restrictions
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Vegetarian, Gluten-free, Nut allergy"
                  value={responses[guest.id].dietaryRestrictions}
                  onChange={(e) => handleUpdate(guest.id, 'dietaryRestrictions', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-foreground">
                  <Bed className="w-4 h-4 mr-2 text-muted-foreground" />
                  Accommodation Required?
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`accomm-${guest.id}`}
                    checked={responses[guest.id].accommodationNeeded}
                    onChange={(e) => handleUpdate(guest.id, 'accommodationNeeded', e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 accent-primary"
                  />
                  <label htmlFor={`accomm-${guest.id}`} className="text-muted-foreground text-sm">
                    Yes, I need accommodation arranged for me.
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}

      <div className="pt-6 flex justify-center">
        <button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto min-w-[200px] flex items-center justify-center h-14 rounded-xl bg-foreground text-background font-medium text-lg transition-all hover:bg-foreground/90 hover:scale-[1.02] disabled:opacity-70 disabled:pointer-events-none"
        >
          {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit RSVP"}
        </button>
      </div>
    </form>
  );
}
