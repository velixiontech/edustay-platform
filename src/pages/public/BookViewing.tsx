import { useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { mockProperties } from "@/lib/mockData";
import { mockAppointments } from "@/lib/mockNotifications";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

const SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

const BookViewing = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const propertyId = params.get("propertyId") || "";
  const unitId = params.get("unitId") || "";
  const roomId = params.get("roomId") || "";

  const property = mockProperties.find((p) => p.id === propertyId);
  const unit = property?.units.find((u) => u.id === unitId);
  const room = unit?.rooms.find((r) => r.id === roomId);

  const [step, setStep] = useState<"auth" | "calendar" | "done">("auth");
  const [account, setAccount] = useState({ fullName: "", email: "", phone: "" });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");

  const bookedSlotsForDay = useMemo(() => {
    if (!date) return new Set<string>();
    const key = format(date, "yyyy-MM-dd");
    return new Set(mockAppointments.filter((a) => a.date === key && a.status !== "cancelled").map((a) => a.time));
  }, [date]);

  const submitAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account.fullName || !account.email) {
      toast({ title: "Missing details", description: "Please fill in your name and email", variant: "destructive" });
      return;
    }
    toast({ title: "Account created", description: "Now choose a viewing time." });
    setStep("calendar");
  };

  const confirmBooking = () => {
    if (!date || !time) {
      toast({ title: "Select a date and time", variant: "destructive" });
      return;
    }
    mockAppointments.push({
      id: `apt-${Date.now()}`,
      studentId: `new-${Date.now()}`,
      studentName: account.fullName,
      date: format(date, "yyyy-MM-dd"),
      time,
      propertyId: property?.id,
      propertyName: property?.name,
      status: "pending",
      notes: `Viewing for room ${room?.number || ""}`,
    });
    setStep("done");
    toast({ title: "Viewing requested", description: "An EduStay agent will confirm shortly." });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="EduStay" className="h-9 w-9 object-contain" />
            <span className="font-serif text-lg bg-gradient-to-r from-[#3E45D2] via-[#8B289B] to-[#EC0B42] bg-clip-text text-transparent">
              EduStay Accommodation
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Link to={property ? `/properties/${property.id}/units/${unit?.id}` : "/properties"} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="font-serif">Book a Viewing</CardTitle>
            {property && room && (
              <p className="text-sm text-muted-foreground">
                {property.name} — {unit?.name} — Room {room.number} (R{room.monthlyRent.toLocaleString()}/mo)
              </p>
            )}
          </CardHeader>
        </Card>

        {step === "auth" && (
          <Card>
            <CardHeader><CardTitle className="text-lg font-serif">Create your student account</CardTitle></CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={submitAccount}>
                <div><Label>Full Name</Label><Input value={account.fullName} onChange={(e) => setAccount({ ...account, fullName: e.target.value })} required /></div>
                <div><Label>Email</Label><Input type="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} required /></div>
                <div><Label>Phone</Label><Input value={account.phone} onChange={(e) => setAccount({ ...account, phone: e.target.value })} /></div>
                <Button type="submit" className="w-full">Continue</Button>
                <p className="text-xs text-muted-foreground text-center">Already have an account? <Link to="/student" className="underline">Sign in</Link></p>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "calendar" && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-lg font-serif">Agent Availability</CardTitle></CardHeader>
              <CardContent className="flex justify-center">
                <Calendar mode="single" selected={date} onSelect={setDate} className="pointer-events-auto" disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">{date ? format(date, "EEE, MMM d") : "Select a date"}</CardTitle>
                <p className="text-xs text-muted-foreground">Choose an available time slot</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {SLOTS.map((s) => {
                    const taken = bookedSlotsForDay.has(s);
                    return (
                      <Button key={s} variant={time === s ? "default" : "outline"} disabled={taken} size="sm" onClick={() => setTime(s)}>
                        <Clock className="h-3 w-3 mr-1" /> {s}
                      </Button>
                    );
                  })}
                </div>
                {time && <Badge>Selected: {time}</Badge>}
                <Button className="w-full" onClick={confirmBooking}>Confirm Booking</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "done" && (
          <Card>
            <CardContent className="p-8 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
              <h2 className="font-serif text-xl">Viewing Requested!</h2>
              <p className="text-sm text-muted-foreground">
                Your viewing on <strong>{date && format(date, "EEE, MMM d")}</strong> at <strong>{time}</strong> for {property?.name} has been sent to the EduStay agent for confirmation.
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <Button onClick={() => navigate("/student")}>Go to Student Portal</Button>
                <Button variant="outline" onClick={() => navigate("/properties")}>Browse more</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default BookViewing;
