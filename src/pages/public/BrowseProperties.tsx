import { useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { mockProperties } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, ArrowLeft, Wifi, Droplets, Zap, GraduationCap, Home, DoorOpen, BedDouble, ChefHat, Sofa, Shirt, CalendarPlus } from "lucide-react";
import logo from "@/assets/logo.png";

const heroImages = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
];

const roomPhotos = [
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80",
  "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=900&q=80",
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
];

const walkthroughVideo = "https://cdn.coverr.co/videos/coverr-tour-of-a-modern-apartment-9249/1080p.mp4";

const utilities = [
  { icon: <GraduationCap className="h-4 w-4" />, label: "NSFAS Accredited" },
  { icon: <Droplets className="h-4 w-4" />, label: "Water Included" },
  { icon: <Zap className="h-4 w-4" />, label: "Electricity Included" },
  { icon: <Wifi className="h-4 w-4" />, label: "Wi-Fi Included" },
];

const PublicShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="EduStay" className="h-9 w-9 object-contain" />
          <span className="font-serif text-lg bg-gradient-to-r from-[#3E45D2] via-[#8B289B] to-[#EC0B42] bg-clip-text text-transparent">
            EduStay Accommodation
          </span>
        </Link>
        <Link to="/student"><Button variant="outline" size="sm">Student Portal</Button></Link>
      </div>
    </header>
    <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
  </div>
);

export const BrowseProperties = () => (
  <PublicShell>
    <div className="mb-6">
      <h1 className="text-3xl font-serif">Browse Properties</h1>
      <p className="text-muted-foreground">Find your perfect student accommodation in Bloemfontein</p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {mockProperties.map((p, idx) => {
        const rooms = p.units.flatMap((u) => u.rooms);
        const available = rooms.filter((r) => r.status === "available").length;
        return (
          <Link key={p.id} to={`/properties/${p.id}`}>
            <Card className="overflow-hidden hover:shadow-elevated transition-all hover:-translate-y-1">
              <div className="h-44 bg-muted overflow-hidden">
                <img src={heroImages[idx % heroImages.length]} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="font-serif flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> {p.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {p.address}
                </p>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm">
                <Badge variant="secondary">{p.gender || "Mixed"}</Badge>
                <span className="text-muted-foreground">{available} room(s) available</span>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  </PublicShell>
);

export const PropertyUnits = () => {
  const { propertyId } = useParams();
  const property = mockProperties.find((p) => p.id === propertyId);
  if (!property) return <PublicShell><p>Property not found.</p></PublicShell>;
  return (
    <PublicShell>
      <Link to="/properties" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="h-3 w-3" /> Back to properties
      </Link>
      <div className="mb-6">
        <h1 className="text-3xl font-serif">{property.name}</h1>
        <p className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {property.address}</p>
      </div>
      <h2 className="text-lg font-serif mb-3">Units</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {property.units.map((u) => {
          const available = u.rooms.filter((r) => r.status === "available").length;
          return (
            <Link key={u.id} to={`/properties/${property.id}/units/${u.id}`}>
              <Card className="hover:shadow-elevated transition-all hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" /> {u.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm flex justify-between">
                  <span className="text-muted-foreground">{u.rooms.length} rooms</span>
                  <Badge variant={available > 0 ? "default" : "secondary"}>{available} available</Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </PublicShell>
  );
};

export const UnitRooms = () => {
  const { propertyId, unitId } = useParams();
  const navigate = useNavigate();
  const property = mockProperties.find((p) => p.id === propertyId);
  const unit = property?.units.find((u) => u.id === unitId);
  const rooms = useMemo(() => unit?.rooms || [], [unit]);
  if (!property || !unit) return <PublicShell><p>Unit not found.</p></PublicShell>;

  return (
    <PublicShell>
      <Link to={`/properties/${property.id}`} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="h-3 w-3" /> Back to {property.name}
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-serif">{unit.name}</h1>
        <p className="text-muted-foreground">{property.name} — {property.address}</p>
      </div>

      {/* Live walkthrough */}
      <Card className="overflow-hidden mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-serif">Live Walkthrough</CardTitle>
          <p className="text-xs text-muted-foreground">Bedroom · Kitchen · Living Room · Laundry Room</p>
        </CardHeader>
        <CardContent>
          <video
            controls
            playsInline
            poster={heroImages[0]}
            className="w-full rounded-lg bg-black aspect-video"
          >
            <source src={walkthroughVideo} type="video/mp4" />
          </video>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" /> Bedroom</span>
            <span className="flex items-center gap-1"><ChefHat className="h-3 w-3" /> Kitchen</span>
            <span className="flex items-center gap-1"><Sofa className="h-3 w-3" /> Living Room</span>
            <span className="flex items-center gap-1"><Shirt className="h-3 w-3" /> Laundry Room</span>
          </div>
        </CardContent>
      </Card>

      {/* Bedroom close-ups */}
      <h2 className="text-lg font-serif mb-3">Bedroom Close-ups</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {roomPhotos.map((src, i) => (
          <img key={i} src={src} alt={`Bedroom ${i + 1}`} className="rounded-lg h-32 w-full object-cover" />
        ))}
      </div>

      {/* Utilities */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-lg">Utilities Included</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {utilities.map((u) => (
            <Badge key={u.label} variant="secondary" className="gap-1 py-1.5 px-3">
              {u.icon} {u.label}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {/* Rooms list */}
      <h2 className="text-lg font-serif mb-3">Available Rooms</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {rooms.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium flex items-center gap-2"><DoorOpen className="h-4 w-4 text-primary" /> Room {r.number}</p>
                <p className="text-xs text-muted-foreground capitalize">{r.type} · R{r.monthlyRent.toLocaleString()}/mo</p>
                <Badge variant={r.status === "available" ? "default" : "secondary"} className="mt-1 capitalize">{r.status}</Badge>
              </div>
              <Button
                disabled={r.status !== "available"}
                onClick={() =>
                  navigate(`/book-viewing?propertyId=${property.id}&unitId=${unit.id}&roomId=${r.id}`)
                }
              >
                <CalendarPlus className="h-4 w-4 mr-1" /> Book Viewing
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PublicShell>
  );
};

export default BrowseProperties;
