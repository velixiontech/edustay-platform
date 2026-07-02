import DashboardLayout from "@/components/DashboardLayout";
import { mockStudents } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClipboardList } from "lucide-react";

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium text-foreground">{value || "—"}</p>
  </div>
);

const SuretyApplication = () => {
  const student = mockStudents.find((s) => s.id === "s1");
  const app = student?.applicationData;

  if (!app) {
    return (
      <DashboardLayout role="surety">
        <div className="max-w-2xl mx-auto text-center py-16">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-serif mt-4">No application available</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="surety">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-serif">Application Form</h1>
          <p className="text-muted-foreground mt-1">Submitted by {app.fullName} (read only)</p>
        </div>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-serif text-lg">Student Details</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={app.fullName} />
            <Field label="ID Number" value={app.idNumber} />
            <Field label="Student Number" value={app.studentNumber} />
            <Field label="Email" value={app.email} />
            <Field label="WhatsApp" value={app.whatsappNumber} />
            <Field label="Place of Study" value={app.placeOfStudy} />
            <Field label="Field of Study" value={app.fieldOfStudy} />
            <Field label="Year of Study" value={app.yearOfStudy} />
            <Field label="Gender" value={app.gender} />
            <Field label="Payment Method" value={app.paymentMethod} />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-serif text-lg">Surety Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Mother / Guardian</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" value={app.motherFullName} />
                <Field label="ID Number" value={app.motherIdNumber} />
                <Field label="Email" value={app.motherEmail} />
                <Field label="WhatsApp" value={app.motherWhatsapp} />
                <Field label="Occupation" value={app.motherOccupation} />
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-semibold mb-2">Father / Guardian</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" value={app.fatherFullName} />
                <Field label="ID Number" value={app.fatherIdNumber} />
                <Field label="Email" value={app.fatherEmail} />
                <Field label="WhatsApp" value={app.fatherWhatsapp} />
                <Field label="Occupation" value={app.fatherOccupation} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SuretyApplication;
