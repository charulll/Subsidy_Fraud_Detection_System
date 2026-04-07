import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import Chatbot from "./components/ui/Chatbot";
import ApplySubsidy from "./pages/citizen/ApplySubsidy";
import  AdminDashboard from "./pages/admin/AdminDashboard";
import UploadKYC from "./pages/citizen/UploadKYC";
import TrackApplication from "./pages/citizen/TrackApplication";
import AdminReports from "./pages/admin/AdminReports";
import AdminApplications from "./pages/admin/AdminApplications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen/apply" element={<ApplySubsidy />} />
        <Route path="/citizen/track" element={<TrackApplication />} />
        <Route path="/citizen/upload-kyc" element={<UploadKYC />} />
         <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}
