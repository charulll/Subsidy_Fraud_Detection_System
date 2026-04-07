import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  Eye,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { BASE_URL } from "@/lib/api";
import { useNavigate } from "react-router-dom";



export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    flagged: 0,
    totalAmount: 0,
  });

  const [apps, setApps] = useState<any[]>([]);
   const navigate = useNavigate();
  useEffect(() => {
  const fetchStats = async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`);
    const data = await res.json();
    setStats(data);
  };

  const fetchApps = async () => {
    const res = await fetch(`${BASE_URL}/api/admin/applications`);
    const data = await res.json();
    setApps(Array.isArray(data) ? data : []);
  };

  fetchStats();
  fetchApps();
}, []);


  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Live data from database</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total Applications" value={stats.total} icon={FileText} />
          <StatCard title="Approved" value={stats.approved} icon={CheckCircle} variant="success" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} variant="warning" />
          <StatCard title="Flagged" value={stats.flagged} icon={AlertTriangle} variant="flagged" />
          <StatCard
            title="Total Amount"
            value={`₹${Number(stats?.totalAmount|| 0)}`}
            icon={IndianRupee}
          />
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-heading">Recent Applications</CardTitle>
              <CardDescription>Live applications from citizens</CardDescription>
            </div>
            <Link to="/admin/applications">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {apps.length === 0 ? (
              <p>No applications found.</p>
            ) : (
              <div className="space-y-3">
                {apps.slice(0, 5).map((app) => (
                  <div 
                    key={app.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium">{app.scheme}</p>
                      <p className="text-xs text-muted-foreground">
                        Aadhaar: XXXX-XXXX-{app.citizen_aadhaar?.slice(-4)} • ₹{app.amount}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={app.status}>{app.status}</StatusBadge>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/applications?id=${app.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                    </Button>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/applications">
            <Card className="cursor-pointer hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-4">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">All Applications</p>
                  <p className="text-xs text-muted-foreground">Review & manage</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/applications?filter=flagged">
            <Card className="cursor-pointer hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-4">
                <AlertTriangle className="h-5 w-5 text-flagged" />
                <div>
                  <p className="font-medium">Flagged Cases</p>
                  <p className="text-xs text-muted-foreground">Investigate fraud</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/reports">
            <Card className="cursor-pointer hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-4">
                <TrendingUp className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Reports</p>
                  <p className="text-xs text-muted-foreground">Generate & download</p>
                </div>
              </CardContent>
            </Card>
          </Link>

        
        </div>
      </div>
    </DashboardLayout>
  );

}