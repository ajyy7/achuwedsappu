"use client";

import { useState } from "react";
import { CheckCircle2, Edit2, Trash2, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  isAttending: boolean | null;
}

export default function GuestList({ initialGuests, token }: { initialGuests: Guest[], token: string }) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = (guest: Guest) => {
    setEditingId(guest.id);
    setEditFirstName(guest.firstName);
    setEditLastName(guest.lastName);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFirstName("");
    setEditLastName("");
  };

  const handleSave = async (id: string) => {
    if (!editFirstName.trim() || !editLastName.trim()) return;
    
    setLoadingId(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/api/families/guests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ firstName: editFirstName.trim(), lastName: editLastName.trim() })
      });
      
      if (res.ok) {
        const { guest } = await res.json();
        setGuests(guests.map(g => g.id === id ? guest : g));
        setEditingId(null);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this family member?")) return;
    
    setLoadingId(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/api/families/guests/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        setGuests(guests.filter(g => g.id !== id));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingId(null);
  };

  if (guests.length === 0) {
    return <p className="text-muted-foreground text-sm italic">You haven't added any family members yet.</p>;
  }

  return (
    <div className="space-y-4">
      {guests.map((guest) => (
        <div key={guest.id} className="flex items-center justify-between p-4 rounded-xl border border-border/30 bg-muted/20 group transition-colors hover:bg-muted/30">
          {editingId === guest.id ? (
            <div className="flex-1 flex flex-col sm:flex-row gap-2 mr-2">
              <input
                type="text"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="First Name"
              />
              <input
                type="text"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Last Name"
              />
            </div>
          ) : (
            <div>
              <p className="font-medium">{guest.firstName} {guest.lastName}</p>
              <p className="text-sm text-muted-foreground flex items-center">
                {guest.isAttending === null ? "No RSVP yet" : guest.isAttending ? <><CheckCircle2 className="w-3 h-3 mr-1 text-primary" /> Attending</> : "Not Attending"}
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            {editingId === guest.id ? (
              <>
                <button 
                  onClick={() => handleSave(guest.id)} 
                  disabled={loadingId === guest.id}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleCancelEdit} 
                  disabled={loadingId === guest.id}
                  className="p-2 text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleEdit(guest)} 
                  disabled={loadingId === guest.id}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(guest.id)} 
                  disabled={loadingId === guest.id}
                  className="p-2 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
