import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  Loader2,
  FileText,
  CreditCard,
  User
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { schemes } from "@/data/mockData";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/api";



export default function ApplySubsidy() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    fatherName: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    scheme: "",
    bankAccount: "",
    ifscCode: "",
    income: 0,
    kycFile: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "text/xml" || file.name.endsWith('.xml')) {
        setFormData(prev => ({ ...prev, kycFile: file }));
      } else {
        toast.error("Please upload a valid Aadhaar XML file");
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.fatherName) newErrors.fatherName = "Father's name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode || formData.pincode.length !== 6) newErrors.pincode = "Valid 6-digit pincode is required";
      if (!/^\d{9,18}$/.test(formData.bankAccount)) {
        newErrors.bankAccount = "Account number must be 9 to 18 digits";
      }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
  newErrors.ifscCode = "Invalid IFSC format (e.g. SBIN0001234)";
}

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); 
 if (!validateForm()) return;       
  if (!user) return;

  setIsSubmitting(true);

  const res = await fetch(`${BASE_URL}/api/citizen/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      aadhaar: user.aadhaarLast4,   
      scheme: formData.scheme,
      amount,
      income: formData.income,
      fullName: formData.fullName,
      fatherName: formData.fatherName,
      address: formData.address,
      district: formData.district,
      state: formData.state,
      pincode: formData.pincode,
      bankAccount: formData.bankAccount,
      ifscCode: formData.ifscCode,
    }),
  });

  const data = await res.json();

  setIsSubmitting(false);

  if (res.ok) {
    toast.success("Application submitted!");
    navigate("/citizen/dashboard");
  } else {
    toast.error(data.message || "Failed");
  }
};


  const selectedScheme = schemes.find(s => s.id === formData.scheme);

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
            <h1 className="text-2xl font-heading font-bold">Apply for Subsidy</h1>
            <p className="text-muted-foreground">Fill in the details to submit your application</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="font-heading">Personal Details</CardTitle>
              </div>
              <CardDescription>Your personal information from Aadhaar</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={errors.fullName ? "border-danger" : ""}
                />
                {errors.fullName && <p className="text-xs text-danger">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange("fatherName", e.target.value)}
                  className={errors.fatherName ? "border-danger" : ""}
                />
                {errors.fatherName && <p className="text-xs text-danger">{errors.fatherName}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={errors.address ? "border-danger" : ""}
                />
                {errors.address && <p className="text-xs text-danger">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange("district", e.target.value)}
                  className={errors.district ? "border-danger" : ""}
                />
                {errors.district && <p className="text-xs text-danger">{errors.district}</p>}
              </div>
              
              <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="income">Annual Income</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="Enter your annual income"
                  value={formData.income}
                  onChange={(e) => handleInputChange("income", Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className={errors.state ? "border-danger" : ""}
                />
                {errors.state && <p className="text-xs text-danger">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className={errors.pincode ? "border-danger" : ""}
                />
                {errors.pincode && <p className="text-xs text-danger">{errors.pincode}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Scheme Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="font-heading">Scheme Selection</CardTitle>
              </div>
              <CardDescription>Choose the subsidy scheme you want to apply for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Scheme *</Label>
                <Select
                  value={formData.scheme}
                  onValueChange={(value) => handleInputChange("scheme", value)}
                >
                  <SelectTrigger className={errors.scheme ? "border-danger" : ""}>
                    <SelectValue placeholder="Choose a scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {schemes.map((scheme) => (
                      <SelectItem key={scheme.id} value={scheme.id}>
                        {scheme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.scheme && <p className="text-xs text-danger">{errors.scheme}</p>}
              </div>

              {selectedScheme && (
                <Alert className="bg-success/10 border-success/20">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    <strong>{selectedScheme.name}</strong>
                    <br />
                    Benefit Amount: ₹{selectedScheme.amount.toLocaleString()}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle className="font-heading">Bank Details</CardTitle>
              </div>
              <CardDescription>Your bank account for direct benefit transfer</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account Number *</Label>
               <Input
                      id="bankAccount"
                      type="password"
                      value={formData.bankAccount}
                      onChange={(e) =>
                        handleInputChange("bankAccount", e.target.value.replace(/\D/g, "").slice(0, 18))
                      }
                      placeholder="Enter account number"
                      className={errors.bankAccount ? "border-danger" : ""}
                      maxLength={18}
                    />
                {formData.bankAccount && (
                  <p className="text-xs text-muted-foreground">
                    Display: XXXX-XXXX-{formData.bankAccount.slice(-4)}
                  </p>
                )}
                {errors.bankAccount && <p className="text-xs text-danger">{errors.bankAccount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code *</Label>
                <Input
                  id="ifscCode"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase().slice(0, 11))}
                  placeholder="e.g., SBIN0001234"
                  maxLength={11}
                  className={errors.ifscCode ? "border-danger" : ""}
                />
                {errors.ifscCode && <p className="text-xs text-danger">{errors.ifscCode}</p>}
              </div>
            </CardContent>
          </Card>

          {/* e-KYC Upload */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                <CardTitle className="font-heading">Aadhaar e-KYC (Optional)</CardTitle>
              </div>
              <CardDescription>Upload offline Aadhaar XML file for faster verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border-2 border-dashed p-6 text-center">
                <input
                  type="file"
                  accept=".xml"
                  onChange={handleFileChange}
                  className="hidden"
                  id="kyc-upload"
                />
                <label htmlFor="kyc-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formData.kycFile ? formData.kycFile.name : "Click to upload Aadhaar XML file"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Download from mAadhaar app or UIDAI website
                  </p>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link to="/citizen/dashboard" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}