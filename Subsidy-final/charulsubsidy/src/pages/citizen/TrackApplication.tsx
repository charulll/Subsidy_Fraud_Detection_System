import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_URL } from "@/lib/api";

export default function TrackApplication() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  useEffect(() => {
    if (!user?.aadhaarLast4) return;

    const fetchApps = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/citizen/applications/${user.aadhaarLast4}`
        );
        const data = await res.json();
        setApplications(data || []);
      } catch (err) {
        console.log("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [user]);

  const filteredApplications = applications.filter((app) =>
    String(app.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(app.scheme).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout requiredRole="citizen">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/citizen/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Track Applications</h1>
            <p className="text-muted-foreground">View and track all your subsidy applications</p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Application ID or Scheme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription>
              Showing {filteredApplications.length} application(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Scheme</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="border-b hover:bg-muted/30">
                        <td className="p-3">{app.id}</td>
                        <td className="p-3">{app.scheme}</td>
                        <td className="p-3">₹{app.amount}</td>
                        <td className="p-3">{app.appliedDate || "-"}</td>
                        <td className="p-3">
                          <StatusBadge status={app.status}>
                            {app.status}
                          </StatusBadge>
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedApp(app)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredApplications.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    No applications found
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog */}
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>{selectedApp?.id}</DialogDescription>
            </DialogHeader>

            {selectedApp && (
              <div className="space-y-2">
                <p><b>Scheme:</b> {selectedApp.scheme}</p>
                <p><b>Amount:</b> ₹{selectedApp.amount}</p>
                <p><b>Date:</b> {selectedApp.appliedDate || "-"}</p>
                <p><b>District:</b> {selectedApp.district || "-"}</p>
                <StatusBadge status={selectedApp.status}>
                  {selectedApp.status}
                </StatusBadge>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
