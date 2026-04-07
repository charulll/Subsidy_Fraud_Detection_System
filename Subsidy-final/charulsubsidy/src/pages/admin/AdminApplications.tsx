import axios from "axios";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, MessageSquare, Filter, Download } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/api";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminApplications() {

  const [applications, setApplications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/applications`);
      const data = await res.json();
      setApplications(data || []);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      String(app.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.scheme.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  // ✅ STATUS UPDATE (WORKING)
  const updateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/api/admin/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`Application ${status}`);
        fetchApplications(); // reload
        setSelectedApp(null);
      } else {
        toast.error("Failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleAddRemark = async () => {
    if (!remark.trim() || !selectedApp) return;

    try {
      const res = await fetch(`${BASE_URL}/api/admin/add-remark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: selectedApp.id,
          remark
        }),
      });

      if (res.ok) {
        toast.success("Remark saved ✅");
        fetchApplications();
        setRemark("");
        setRemarkDialogOpen(false);
        setSelectedApp(null);
      } else {
        toast.error("Failed");
      }

    } catch {
      toast.error("Server error");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.text("Subsidy Applications Report", 14, 15);

    const tableData = applications.map(app => [
      app.id,
      app.scheme,
      app.amount,
      app.status,
      app.fraud,
      app.threat,
      app.accuracy
    ]);

    autoTable(doc, {
      head: [["ID", "Scheme", "Amount", "Status", "Fraud", "Threat", "Accuracy"]],
      body: tableData,
      startY: 20,
    });

    doc.save("applications_report.pdf");
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">

        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-muted-foreground">Live data from database</p>
          </div>

          <Button onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6 flex gap-4">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription>{filteredApplications.length} found</CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th>ID</th>
                    <th>Scheme</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Fraud</th>
                    <th>Threat</th>
                    <th>Accuracy</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map(app => (
                    <tr key={app.id} className="border-b">

                      <td>{app.id}</td>
                      <td>{app.scheme}</td>
                      <td>₹{app.amount}</td>

                      <td>
                        <StatusBadge status={app.status}>
                          {app.status}
                        </StatusBadge>
                      </td>

                      {/* ✅ FINAL FIX */}
                      <td
                        style={{
                          color:
                            app.status === "flagged" ||
                            app.fraud?.toLowerCase() === "fraud"
                              ? "red"
                              : "green"
                        }}
                      >
                        {app.status === "flagged" ||
                        app.fraud?.toLowerCase() === "fraud"
                          ? "🚨 Flagged"
                          : "✅ Safe"}
                      </td>

                      <td>{app.threat || "-"}</td>
                      <td>{app.accuracy || "-"}</td>

                      <td>
                        {app.reason || "No issues detected ✅"}
                      </td>

                      <td>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setSelectedApp(app)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* MODAL */}
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent>

            <DialogHeader>
              <DialogTitle>Application</DialogTitle>
              <DialogDescription>{selectedApp?.id}</DialogDescription>
            </DialogHeader>

            {selectedApp && (
              <div className="space-y-2">
                <p>Scheme: {selectedApp.scheme}</p>
                <p>Amount: ₹{selectedApp.amount}</p>
                <p>Status: {selectedApp.status}</p>
              </div>
            )}

            <DialogFooter>

              <Button variant="outline" onClick={() => setRemarkDialogOpen(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Remark
              </Button>

              <Button onClick={() => updateStatus(selectedApp.id, "approved")}>
                Approve
              </Button>

              <Button onClick={() => updateStatus(selectedApp.id, "rejected")}>
                Reject
              </Button>

            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* REMARK */}
        <Dialog open={remarkDialogOpen} onOpenChange={setRemarkDialogOpen}>
          <DialogContent>

            <DialogHeader>
              <DialogTitle>Add Remark</DialogTitle>
            </DialogHeader>

            <Textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setRemarkDialogOpen(false)}>
                Cancel
              </Button>

              <Button onClick={handleAddRemark}>
                Save
              </Button>
            </DialogFooter>

          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
}