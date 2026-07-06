import { Link } from "react-router-dom";
import { GraduationCap, Home, Shield, DollarSign, Wrench, Building2, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const roles = [
  {
    title: "Administrator",
    description:
      "Manage properties, approve applications, allocate students and generate contracts.",
    icon: <Shield className="h-8 w-8 text-white" />,
    href: "/admin",
  },
  {
    title: "Student",
    description:
      "Request application access, complete your application and view your accommodation contract.",
    icon: <GraduationCap className="h-8 w-8 text-white" />,
    href: "/student",
  },
  {
    title: "Property Owner",
    description:
      "Track your properties, occupancy rates and accommodation portfolio.",
    icon: <Home className="h-8 w-8 text-white" />,
    href: "/owner",
  },
  {
    title: "Finance",
    description:
      "Track payments, manage expenses and send payment reminders.",
    icon: <DollarSign className="h-8 w-8 text-white" />,
    href: "/finance",
  },
  {
    title: "Maintenance",
    description:
      "Receive maintenance requests, upload invoices and track repairs.",
    icon: <Wrench className="h-8 w-8 text-white" />,
    href: "/maintenance-team",
  },
  {
    title: "Surety",
    description:
      "Review the student's application, sign the lease and monitor payments.",
    icon: <UserCheck className="h-8 w-8 text-white" />,
    href: "/surety",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img
              src={logo}
              alt="EduStay Portal"
              className="h-24 w-24 object-contain"
            />

            <h1 className="text-4xl md:text-5xl font-serif bg-gradient-to-r from-[#FE0031] via-[#6B0B81] to-[#0226C7] bg-clip-text text-transparent">
              EduStay Portal
            </h1>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sign in to your EduStay account. Your dashboard will open automatically based on your assigned role.
          </p>

          <div className="mt-8">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#FE0031] via-[#6B0B81] to-[#0226C7] text-white hover:opacity-90 transition-all duration-300"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Login to EduStay Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Platform Modules */}
      <main className="flex-1 max-w-5xl mx-auto px-6 -mt-8 relative z-20 w-full pb-16">
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {roles.map((role) => (
            <Link key={role.href} to={role.href} className="group">
              <Card className="h-full rounded-3xl border border-gray-200 bg-white shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div
                    className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#FE0031] via-[#6B0B81] to-[#0226C7] flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-all duration-300"
                  >
                    {role.icon}
                  </div>

                  <h2 className="text-xl font-serif mb-2 text-card-foreground">
                    {role.title}
                  </h2>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground">
        © 2026 EduStay Accommodation. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;