import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import NotificationBar from "@/components/NotificationBar";
import { mockStudents } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, FileText, UserCheck, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const SuretyDashboard = () => {
  // Surety sur1 is linked to student s1 (Thabo Nkosi)
  const student = mockStudents.find((s) => s.id === "s1");
  const studentName = student?.applicationData?.fullName || "your student";
  const suretyName = student?.applicationData?.motherFullName || "Surety";

  return (
    <DashboardLayout role="surety">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Welcome, {suretyName}</h1>
          <p className="text-muted-foreground mt-1">
            You are the surety for <span className="font-medium text-foreground">{studentName}</span>
          </p>
        </div>

        <NotificationBar userId="sur1" />

        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard title="Linked Student" value={studentName} icon={<UserCheck className="h-5 w-5" />} />
          <StatCard title="Application" value="Submitted" icon={<ClipboardList className="h-5 w-5" />} />
          <StatCard title="Contract" value="Awaiting Signature" icon={<FileText className="h-5 w-5 text-warning" />} />
        </div>

        <Card className="shadow-card border-warning/40 bg-warning/5">
          <CardHeader>
            <CardTitle className="text-base font-serif flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" /> Surety Responsibility
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            As surety you are jointly liable for the student's rent and any damages under the lease agreement.
            Please review the application and sign the lease as surety.
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" /> Application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review the application submitted by {studentName} including parent/surety contact details.
              </p>
              <Link to="/surety/application">
                <Button><ClipboardList className="h-4 w-4 mr-2" /> View Application</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Contract</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review and sign the lease agreement as surety.
              </p>
              <Link to="/surety/contract">
                <Button variant="outline"><FileText className="h-4 w-4 mr-2" /> View & Sign Contract</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuretyDashboard;
