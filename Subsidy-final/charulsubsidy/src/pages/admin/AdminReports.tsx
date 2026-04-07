import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, PieChart, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPie, Pie, Cell
} from "recharts";

const COLORS = ['#22c55e', '#facc15', '#ef4444', '#f97316'];

export default function AdminReports() {
  const [stats, setStats] = useState<any>(null);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [districtData, setDistrictData] = useState<any[]>([]);

  useEffect(() => {
    fetchAllReports();

    
     const interval = setInterval(() => {
    fetchReports();
  }, 5000); // 5 sec

  return () => clearInterval(interval);
}, []);

  const fetchAllReports = async () => {
  try {
    const s = await fetch(`${BASE_URL}/api/admin/reports`).then(r => r.json());

    let m = [];
    let d = [];

    try {
      const monthly = await fetch(`${BASE_URL}/api/admin/report/monthly`).then(r => r.json());

      // ✅ FIX: string → number conversion
      m = monthly.map((item: any) => ({
        month: item.month,
        applications: Number(item.applications),
        approved: Number(item.approved),
        flagged: Number(item.flagged)
      }));

    } catch (err) {
      console.log("Monthly error:", err);
    }

    try {
      d = await fetch(`${BASE_URL}/api/admin/report/district`).then(r => r.json());
    } catch {}

    setStats(s);
    setMonthlyStats(m);   // ✅ fixed
    setDistrictData(d || []);

  } catch (err) {
    console.error(err);
  }
};
  if (!stats) {
    return (
      <DashboardLayout requiredRole="admin">
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  // ✅ SAFE CALCULATION (no crash)
  const approvalRate = stats.total ? ((stats.approved / stats.total) * 100).toFixed(1) : 0;
  const fraudRate = stats.total ? ((stats.flagged / stats.total) * 100).toFixed(1) : 0;

  const statusDistribution = [
    { name: "Approved", value: stats.approved || 0 },
    { name: "Pending", value: stats.pending || 0 },
    { name: "Rejected", value: stats.rejected || 0 },
    { name: "Flagged", value: stats.flagged || 0 },
  ];

  const handleDownload = (type: string) => {
    toast.success(`${type} downloaded`);
  };
 const handleExport = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/admin/reports");
    const data = await res.json();

    const doc = new jsPDF();

    // Title
    doc.text("Subsidy Fraud Report", 14, 15);

    // Convert object to table format
    const rows = Object.entries(data).map(([key, value]) => [
      key,
      String(value),
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["Field", "Value"]],
      body: rows,
    });

    doc.save("report.pdf");

  } catch (err) {
    console.log(err);
    alert("Export failed");
  }
};

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Live analytics from database</p>
          </div>
          <button
          className="btn"
          onClick={handleExport}
        >
          Export All
        </button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Summary title="Approval Rate" value={`${approvalRate}%`} icon={<TrendingUp />} />
          <Summary title="Fraud Rate" value={`${fraudRate}%`} icon={<BarChart3 />} />
          <Summary title="Total Disbursed" value={`₹${stats.totalAmount || 0}`} icon={<FileText />} />
          <Summary title="Fraud Amount" value={`₹${stats.fraudAmount || 0}`} icon={<PieChart />} />
        </div>

        {/* Monthly Trends */}
        {monthlyStats.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Applications over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="applications" stroke="#1d4ed8" />
                  <Line dataKey="approved" stroke="#22c55e" />
                  <Line dataKey="flagged" stroke="#f97316" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : (
  <p className="text-center text-muted-foreground">
    No data available
  </p>
)}

        {/* Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie data={statusDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                  {statusDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* District Fraud */}
        {districtData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>District Fraud Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="district" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cases" fill="#f97316" />
                  <Bar dataKey="amount" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        

      </div>
    </DashboardLayout>
  );
}

function Summary({ title, value, icon }: any) {
  return (
    <Card>
      <CardContent className="pt-6 flex justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="opacity-40">{icon}</div>
      </CardContent>
    </Card>
  );
}