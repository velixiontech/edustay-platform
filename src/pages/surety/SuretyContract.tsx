import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockStudents } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, FileText, PenLine } from "lucide-react";
import ContractHeader from "@/components/ContractHeader";

const SuretyContract = () => {
  const { toast } = useToast();
  const student = mockStudents.find((s) => s.id === "s1");
  const [signed, setSigned] = useState(false);
  const [signature, setSignature] = useState("");

  if (!student?.applicationData || !student.allocation) {
    return (
      <DashboardLayout role="surety">
        <div className="max-w-2xl mx-auto text-center py-16">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-serif mt-4">No contract available</h1>
          <p className="text-muted-foreground mt-2">The contract will appear here once the student has been allocated.</p>
        </div>
      </DashboardLayout>
    );
  }

  const { applicationData: app, allocation: alloc } = student;
  const suretyName = app.motherFullName || app.fatherFullName;

  const handleSign = () => {
    if (signature.trim().length < 3) {
      toast({ title: "Signature required", description: "Please type your full name to sign.", variant: "destructive" });
      return;
    }
    setSigned(true);
    toast({ title: "Contract signed", description: "Thank you. The signed lease has been sent to EduStay." });
  };

  return (
    <DashboardLayout role="surety">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-serif">Lease Agreement — Surety Copy</h1>
          <p className="text-muted-foreground mt-1">Please review and sign as surety for {app.fullName}</p>
        </div>

        <Card className="shadow-elevated">
          <CardContent className="p-8 space-y-6 text-sm leading-relaxed">
            <ContractHeader />
            <Separator />

            <div className="space-y-2">
              <h3 className="font-serif font-semibold text-foreground">Parties</h3>
              <p><strong>Landlord:</strong> {alloc.ownerName}</p>
              <p><strong>Tenant:</strong> {app.fullName} ({app.idNumber})</p>
              <p><strong>Surety:</strong> {suretyName}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-serif font-semibold text-foreground">Property</h3>
              <p>{alloc.propertyName}, {alloc.propertyAddress}</p>
              <p>{alloc.unitName} — Room {alloc.roomNumber}</p>
              <p>Lease: {alloc.leaseStart} to {alloc.leaseEnd}</p>
              <p>Monthly Rent: R{alloc.monthlyRent.toLocaleString()}.00</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-serif font-semibold text-foreground">Surety Undertaking</h3>
              <p className="text-muted-foreground">
                I, <strong className="text-foreground">{suretyName}</strong>, bind myself as surety and co-principal
                debtor in solidum with the Tenant for the due and punctual payment of all rent, deposits and any other
                amounts owing under this lease, including damages and legal costs. This suretyship continues for the
                full lease period and any renewal thereof.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-serif font-semibold text-foreground">Surety Signature</h3>
              {signed ? (
                <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-medium text-success">Signed by {signature}</p>
                    <p className="text-xs text-muted-foreground">Signed on {new Date().toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="sig">Type your full name to sign</Label>
                    <Input id="sig" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder={suretyName} />
                  </div>
                  <Button onClick={handleSign}>
                    <PenLine className="h-4 w-4 mr-2" /> Sign as Surety
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SuretyContract;
