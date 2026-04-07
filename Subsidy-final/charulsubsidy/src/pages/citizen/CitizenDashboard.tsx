import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  PlusCircle,
  Search,
  Upload,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { BASE_URL } from "@/lib/api";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.aadhaarLast4) return;

    const fetchApps = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/citizen/applications/${user.aadhaarLast4}`
        );
        const data = await res.json();
        setApps(data || []);
      } catch (err) {
        console.log("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [user]);

  const stats = {
    total: apps.length,
    approved: apps.filter(a => a.status === "approved").length,
    pending: apps.filter(a => a.status === "pending").length,
    flagged: apps.filter(a => a.status === "flagged").length,
  };

  return (
    <DashboardLayout requiredRole="citizen">
      <div className="space-y-6">

        {/* Welcome */}
        <div className="rounded-xl bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <h1 className="text-2xl md:text-3xl font-heading font-bold">
            Welcome, {user?.name}!
          </h1>
          <p className="mt-1 text-primary-foreground/80">
            Aadhaar: XXXX-XXXX-{user?.aadhaarLast4}
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Applications" value={stats.total} icon={FileText} />
          <StatCard title="Approved" value={stats.approved} icon={CheckCircle} variant="success" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} variant="warning" />
          <StatCard title="Flagged" value={stats.flagged} icon={AlertTriangle} variant="flagged" />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/citizen/apply">
            <Card className="h-full cursor-pointer hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-6">
                <PlusCircle className="h-6 w-6 text-success" />
                <div>
                  <h3 className="font-semibold">Apply for Subsidy</h3>
                  <p className="text-sm text-muted-foreground">Start new application</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/citizen/track">
            <Card className="h-full cursor-pointer hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-6">
                <Search className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Track Application</h3>
                  <p className="text-sm text-muted-foreground">Check status</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/citizen/upload-kyc">
            <Card className="h-full cursor-pointer hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-6">
                <Upload className="h-6 w-6 text-warning" />
                <div>
                  <h3 className="font-semibold">Upload e-KYC</h3>
                  <p className="text-sm text-muted-foreground">Offline Aadhaar XML/QR</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
            <CardDescription>Real-time data from database</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : apps.length === 0 ? (
              <p>No applications found.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th>ID</th>
                    <th>Scheme</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <tr key={app.id} className="border-b">
                      <td>{app.id}</td>
                      <td>{app.scheme}</td>
                      <td>₹{app.amount}</td>
                      <td>{app.date}</td>
                      <td>
                        <StatusBadge status={app.status}>
                          {app.status}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
