"use client";

import { useState } from "react";
import { Download, Search, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function AdminPanel({ guests, families }: { guests: any[]; families: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuests = guests.filter((g) =>
    `${g.firstName} ${g.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const attendingCount = guests.filter((g) => g.isAttending === true).length;
  const declinedCount = guests.filter((g) => g.isAttending === false).length;
  const pendingCount = guests.filter((g) => g.isAttending === null).length;

  const getFamilyName = (familyId: string) => {
    return families.find(f => f.id === familyId)?.name || "Unknown Family";
  };

  const handleExportCSV = () => {
    const headers = ["First Name", "Last Name", "Family Group", "Attending", "Dietary Restrictions", "Needs Accommodation", "Last Updated"];
    const csvContent = [
      headers.join(","),
      ...guests.map(g => [
        `"${g.firstName}"`,
        `"${g.lastName}"`,
        `"${getFamilyName(g.familyId)}"`,
        g.isAttending === null ? "Pending" : g.isAttending ? "Yes" : "No",
        `"${g.dietaryRestrictions || ""}"`,
        g.accommodationNeeded ? "Yes" : "No",
        g.updatedAt ? new Date(g.updatedAt).toLocaleDateString() : "Never"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "wedding_rsvps.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Guests Added</p>
          <p className="text-3xl font-serif">{guests.length}</p>
        </div>
        <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl shadow-sm text-center">
          <p className="text-sm font-medium text-primary mb-2 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 mr-1" /> Attending
          </p>
          <p className="text-3xl font-serif text-primary">{attendingCount}</p>
        </div>
        <div className="p-6 bg-secondary/10 border border-secondary/20 rounded-2xl shadow-sm text-center">
          <p className="text-sm font-medium text-secondary-foreground mb-2 flex items-center justify-center">
            <XCircle className="w-4 h-4 mr-1" /> Declined
          </p>
          <p className="text-3xl font-serif text-secondary-foreground">{declinedCount}</p>
        </div>
        <div className="p-6 bg-muted border border-border rounded-2xl shadow-sm text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-center">
            <Clock className="w-4 h-4 mr-1" /> Pending RSVP
          </p>
          <p className="text-3xl font-serif text-muted-foreground">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-border/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search guests..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button 
            onClick={handleExportCSV}
            className="w-full md:w-auto flex items-center justify-center px-6 py-2 bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export to CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Guest Name</th>
                <th className="px-6 py-4 font-medium">Family Group</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Dietary Needs</th>
                <th className="px-6 py-4 font-medium">Accommodations</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No guests found.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      {guest.firstName} {guest.lastName}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {getFamilyName(guest.familyId)}
                    </td>
                    <td className="px-6 py-4">
                      {guest.isAttending === null ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          Pending
                        </span>
                      ) : guest.isAttending ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          Attending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary-foreground">
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-[200px] truncate">
                      {guest.dietaryRestrictions || "-"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {guest.accommodationNeeded ? "Yes" : "No"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
