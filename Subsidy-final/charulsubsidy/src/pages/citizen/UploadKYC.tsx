import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Upload, 
  FileText,
  CheckCircle,
  QrCode,
  Loader2,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function UploadKYC() {
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "text/xml" || file.name.endsWith('.xml')) {
        setXmlFile(file);
        setUploadSuccess(false);
      } else {
        toast.error("Please upload a valid Aadhaar XML file");
      }
    }
  };

  const handleUpload = async () => {
    if (!xmlFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    setUploadSuccess(true);
    toast.success("e-KYC uploaded successfully!");
  };

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
            <h1 className="text-2xl font-heading font-bold">Upload Offline Aadhaar e-KYC</h1>
            <p className="text-muted-foreground">Upload your Aadhaar XML file for verification</p>
          </div>
        </div>

        {/* Info Card */}
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground">
            <strong>What is Offline Aadhaar e-KYC?</strong>
            <p className="mt-1 text-sm text-muted-foreground">
              Offline Aadhaar is a digitally signed XML file that contains your demographic data and photo. 
              You can download it from the UIDAI website or mAadhaar app. This helps in faster verification 
              of your identity without online Aadhaar authentication.
            </p>
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          {/* XML Upload */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="font-heading">Upload XML File</CardTitle>
              </div>
              <CardDescription>
                Download from mAadhaar app or resident.uidai.gov.in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border-2 border-dashed p-8 text-center">
                <input
                  type="file"
                  accept=".xml"
                  onChange={handleFileChange}
                  className="hidden"
                  id="xml-upload"
                />
                <label htmlFor="xml-upload" className="cursor-pointer">
                  {uploadSuccess ? (
                    <CheckCircle className="mx-auto h-12 w-12 text-success" />
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  )}
                  <p className="mt-3 text-sm font-medium">
                    {xmlFile ? xmlFile.name : "Click to upload XML file"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports: .xml format only
                  </p>
                </label>
              </div>

              {xmlFile && !uploadSuccess && (
                <Button 
                  onClick={handleUpload} 
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload e-KYC
                    </>
                  )}
                </Button>
              )}

              {uploadSuccess && (
                <Alert className="bg-success/10 border-success/20">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    e-KYC uploaded and verified successfully!
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* QR Code Option */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                <CardTitle className="font-heading">Scan QR Code</CardTitle>
              </div>
              <CardDescription>
                Scan the QR code from your Aadhaar letter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border-2 border-dashed p-8 text-center bg-muted/30">
                <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  QR Scanner Coming Soon
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This feature will allow you to scan the QR code directly
                </p>
              </div>

              <Button variant="outline" className="w-full" disabled>
                <QrCode className="mr-2 h-4 w-4" />
                Open QR Scanner
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">How to Download Offline Aadhaar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Visit UIDAI Website</p>
                  <p className="text-sm text-muted-foreground">
                    Go to resident.uidai.gov.in and click on "Download Aadhaar"
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Enter Aadhaar Number</p>
                  <p className="text-sm text-muted-foreground">
                    Enter your 12-digit Aadhaar number and verify with OTP
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Download XML</p>
                  <p className="text-sm text-muted-foreground">
                    Select "XML" format and download the file with a share code
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  4
                </div>
                <div>
                  <p className="font-medium">Upload Here</p>
                  <p className="text-sm text-muted-foreground">
                    Upload the downloaded XML file on this page
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
