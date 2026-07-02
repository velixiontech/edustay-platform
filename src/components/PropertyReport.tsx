import { useMemo, useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, FileText, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { mockExpenses } from "@/lib/mockNotifications";
import { mockOwners, type Property } from "@/lib/mockData";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

interface PropertyReportProps {
  property: Property | null;
  ownerName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COMMISSION_RATE = 0.1;

const monthLabel = (() => {
  const d = new Date();
  return d.toLocaleString("en-ZA", { month: "long", year: "numeric" });
})();

const fmtZAR = (n: number) =>
  `R${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const loadLogoDataUrl = (src: string): Promise<string | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

const PropertyReport = ({ property, ownerName, open, onOpenChange }: PropertyReportProps) => {
  const { toast } = useToast();
  const [period] = useState(monthLabel);
  const [logoData, setLogoData] = useState<string | null>(null);

  useEffect(() => {
    loadLogoDataUrl(logo).then(setLogoData);
  }, []);

  const owner = useMemo(
    () => (property ? mockOwners.find((o) => o.id === property.ownerId) : undefined),
    [property]
  );

  const data = useMemo(() => {
    if (!property) return null;
    const incomeRows = property.units.flatMap((u) =>
      u.rooms.map((r) => ({
        unit: u.name,
        room: r.number,
        tenant: r.studentName || "Vacant",
        statusLabel: r.status === "occupied" ? "Occupied" : r.status === "reserved" ? "Reserved" : "Available",
        paid: r.status === "occupied" ? r.rentPaid : false,
        amount: r.status === "occupied" && r.rentPaid ? r.monthlyRent : 0,
      }))
    );
    const expenseRows = mockExpenses.filter((e) => e.propertyId === property.id);
    const totalIncome = incomeRows.reduce((s, r) => s + r.amount, 0);
    const totalExpenses = expenseRows.reduce((s, e) => s + e.amount, 0);
    const net = totalIncome - totalExpenses;
    const commission = Math.max(0, net) * COMMISSION_RATE;
    const grandTotal = net - commission;
    return { incomeRows, expenseRows, totalIncome, totalExpenses, net, commission, grandTotal };
  }, [property]);

  if (!property || !data) return null;

  const ownerDisplay = ownerName || owner?.name || property.ownerName;
  const ownerId = owner?.idNumber || "—";
  const fileBase = `${property.name.replace(/\s+/g, "_")}_Property_Report_${period.replace(/\s+/g, "_")}`;

  // ===== Build rows where Unit cell is shown only on the first room of each block (like the PDF) =====
  const groupedRows = (() => {
    let lastUnit = "";
    return data.incomeRows.map((r) => {
      const showUnit = r.unit !== lastUnit;
      lastUnit = r.unit;
      return { ...r, unitCell: showUnit ? r.unit : "" };
    });
  })();

  // ===== Excel export =====
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const rows: (string | number)[][] = [
      ["EduStay Accommodation (Pty) Ltd"],
      ["Registration Number: 2026/149431/07"],
      ["Website: www.edustaysa.co.za"],
      ["Director: Zané van der Merwe — 072 781 5922 — zane@edustaysa.co.za"],
      [],
      ["EDUSTAY ACCOMMODATION - PROPERTY REPORT"],
      [],
      ["Property Name:", property.name],
      ["Property Address:", property.address],
      ["Owner:", `${ownerDisplay} | ${ownerId}`],
      ["Period:", period],
      [],
      ["Unit", "Room", "Tenant", "Status", "Paid", "Amount"],
      ...groupedRows.map((r) => [r.unitCell, r.room, r.tenant, r.statusLabel, r.paid ? "Yes" : "No", r.amount]),
      ["", "", "", "TOTAL:", "", data.totalIncome],
      [],
      ["EXPENSES"],
      ["Date", "Category", "Description", "", "", "Amount (R)"],
      ...data.expenseRows.map((e) => [e.date, e.category, e.description, "", "", e.amount]),
      ["", "", "", "", "TOTAL EXPENSES", data.totalExpenses],
      [],
      ["NET (Income - Expenses):", "", "", "", "", data.net],
      ["EduStay Commission (10%):", "", "", "", "", data.commission],
      ["GRAND TOTAL INCOME:", "", "", "", "", data.grandTotal],
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 14 }, { wch: 12 }, { wch: 28 }, { wch: 18 }, { wch: 16 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, ws, "Property Report");
    XLSX.writeFile(wb, `${fileBase}.xlsx`);
    toast({ title: "Excel Exported", description: `${fileBase}.xlsx downloaded.` });
  };

  // ===== PDF export =====
  const exportPDF = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // Header block (logo + company info)
    if (logoData) {
      try { doc.addImage(logoData, "PNG", 14, 10, 22, 22); } catch { /* ignore */ }
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("EduStay Accommodation (Pty) Ltd", 40, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Registration Number: 2026/149431/07", 40, 22);
    doc.text("Website: www.edustaysa.co.za", 40, 27);
    doc.setFont("helvetica", "bold");
    doc.text("Director", pageW - 14, 16, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text("Zané van der Merwe", pageW - 14, 22, { align: "right" });
    doc.text("072 781 5922 | zane@edustaysa.co.za", pageW - 14, 27, { align: "right" });

    // Title
    doc.setDrawColor(62, 69, 210);
    doc.setLineWidth(0.5);
    doc.line(14, 36, pageW - 14, 36);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("EDUSTAY ACCOMMODATION - PROPERTY REPORT", pageW / 2, 44, { align: "center" });

    // Property info
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold"); doc.text("Property Name:", 14, 54);
    doc.setFont("helvetica", "normal"); doc.text(property.name, 50, 54);
    doc.setFont("helvetica", "bold"); doc.text("Property Address:", 14, 60);
    doc.setFont("helvetica", "normal"); doc.text(property.address, 50, 60);
    doc.setFont("helvetica", "bold"); doc.text("Owner:", 14, 66);
    doc.setFont("helvetica", "normal"); doc.text(`${ownerDisplay} | ${ownerId}`, 50, 66);
    doc.setFont("helvetica", "bold"); doc.text("Period:", 14, 72);
    doc.setFont("helvetica", "normal"); doc.text(period, 50, 72);

    // Income table
    autoTable(doc, {
      startY: 78,
      head: [["Unit", "Room", "Tenant", "Status", "Paid", "Amount"]],
      body: groupedRows.map((r) => [r.unitCell, r.room, r.tenant, r.statusLabel, r.paid ? "Yes" : "No", r.amount ? fmtZAR(r.amount) : "0"]),
      foot: [["", "", "", "TOTAL:", "", fmtZAR(data.totalIncome)]],
      headStyles: { fillColor: [62, 69, 210], textColor: 255 },
      footStyles: { fillColor: [240, 240, 240], textColor: 20, fontStyle: "bold" },
      styles: { fontSize: 9 },
    });

    // Expenses
    autoTable(doc, {
      head: [["Date", "Category", "Description", "Amount (R)"]],
      body: data.expenseRows.length
        ? data.expenseRows.map((e) => [e.date, e.category, e.description, fmtZAR(e.amount)])
        : [["—", "—", "No expenses recorded", fmtZAR(0)]],
      foot: [["", "", "TOTAL EXPENSES", fmtZAR(data.totalExpenses)]],
      headStyles: { fillColor: [236, 11, 66], textColor: 255 },
      footStyles: { fillColor: [240, 240, 240], textColor: 20, fontStyle: "bold" },
      styles: { fontSize: 9 },
    });

    // Totals block
    const finalY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold"); doc.text("NET (Income - Expenses):", 14, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(`${fmtZAR(data.totalIncome)} - ${fmtZAR(data.totalExpenses)}`, 80, finalY);
    doc.setFont("helvetica", "bold"); doc.text(fmtZAR(data.net), pageW - 14, finalY, { align: "right" });

    doc.setFont("helvetica", "bold"); doc.text("EduStay Commission (10%):", 14, finalY + 8);
    doc.setFont("helvetica", "bold"); doc.text(fmtZAR(data.commission), pageW - 14, finalY + 8, { align: "right" });

    doc.setDrawColor(0); doc.line(14, finalY + 12, pageW - 14, finalY + 12);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("GRAND TOTAL INCOME:", 14, finalY + 20);
    doc.text(fmtZAR(data.grandTotal), pageW - 14, finalY + 20, { align: "right" });

    doc.save(`${fileBase}.pdf`);
    toast({ title: "PDF Exported", description: `${fileBase}.pdf downloaded.` });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif">Property Report</SheetTitle>
          <SheetDescription>Monthly financial statement — export to Excel or PDF</SheetDescription>
        </SheetHeader>

        {/* Letterhead */}
        <div className="mt-6 border border-border rounded-lg p-5 bg-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <img src={logo} alt="EduStay" className="h-14 w-14 object-contain" />
              <div>
                <p className="font-serif text-base">EduStay Accommodation (Pty) Ltd</p>
                <p className="text-xs text-muted-foreground">Registration Number: 2026/149431/07</p>
                <p className="text-xs text-muted-foreground">www.edustaysa.co.za</p>
              </div>
            </div>
            <div className="text-right text-xs">
              <p className="font-semibold">Director</p>
              <p>Zané van der Merwe</p>
              <p className="text-muted-foreground">072 781 5922 | zane@edustaysa.co.za</p>
            </div>
          </div>

          <div className="border-t border-primary/40 my-4" />
          <h3 className="text-center font-serif text-lg tracking-wide">
            EDUSTAY ACCOMMODATION — PROPERTY REPORT
          </h3>

          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-4 text-sm">
            <p><span className="font-semibold">Property Name:</span> {property.name}</p>
            <p><span className="font-semibold">Owner:</span> {ownerDisplay} | {ownerId}</p>
            <p><span className="font-semibold">Property Address:</span> {property.address}</p>
            <p><span className="font-semibold">Period:</span> {period}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <Card><CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><TrendingUp className="h-3 w-3" /> Income</div>
            <p className="text-lg font-semibold mt-1">{fmtZAR(data.totalIncome)}</p>
          </CardContent></Card>
          <Card><CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><TrendingDown className="h-3 w-3" /> Expenses</div>
            <p className="text-lg font-semibold mt-1">{fmtZAR(data.totalExpenses)}</p>
          </CardContent></Card>
          <Card><CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Wallet className="h-3 w-3" /> Grand Total</div>
            <p className={`text-lg font-semibold mt-1 ${data.grandTotal >= 0 ? "text-emerald-600" : "text-destructive"}`}>{fmtZAR(data.grandTotal)}</p>
          </CardContent></Card>
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={exportExcel}><FileSpreadsheet className="h-4 w-4 mr-1" /> Export Excel</Button>
          <Button size="sm" variant="outline" onClick={exportPDF}><FileText className="h-4 w-4 mr-1" /> Export PDF</Button>
        </div>

        {/* Income table */}
        <div className="mt-6 border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="text-left p-2">Unit</th>
                <th className="text-left p-2">Room</th>
                <th className="text-left p-2">Tenant</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Paid</th>
                <th className="text-right p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {groupedRows.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-2 font-medium">{r.unitCell}</td>
                  <td className="p-2">{r.room}</td>
                  <td className="p-2">{r.tenant}</td>
                  <td className="p-2">{r.statusLabel}</td>
                  <td className="p-2">{r.paid ? "Yes" : "No"}</td>
                  <td className="p-2 text-right">{r.amount ? fmtZAR(r.amount) : "0"}</td>
                </tr>
              ))}
              <tr className="bg-muted/60 font-semibold border-t border-border">
                <td className="p-2" colSpan={3}></td>
                <td className="p-2">TOTAL:</td>
                <td className="p-2"></td>
                <td className="p-2 text-right">{fmtZAR(data.totalIncome)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expenses */}
        <div className="mt-6 border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#EC0B42] text-white">
              <tr>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Description</th>
                <th className="text-right p-2">Amount (R)</th>
              </tr>
            </thead>
            <tbody>
              {data.expenseRows.length === 0 ? (
                <tr><td colSpan={4} className="p-3 text-center text-muted-foreground">No expenses recorded for this property yet.</td></tr>
              ) : (
                data.expenseRows.map((e) => (
                  <tr key={e.id} className="border-t border-border">
                    <td className="p-2">{e.date}</td>
                    <td className="p-2">{e.category}</td>
                    <td className="p-2">{e.description}</td>
                    <td className="p-2 text-right">{fmtZAR(e.amount)}</td>
                  </tr>
                ))
              )}
              <tr className="bg-muted/60 font-semibold border-t border-border">
                <td className="p-2" colSpan={2}></td>
                <td className="p-2">TOTAL EXPENSES</td>
                <td className="p-2 text-right">{fmtZAR(data.totalExpenses)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold">NET (Income − Expenses):</span>
            <span>{fmtZAR(data.totalIncome)} − {fmtZAR(data.totalExpenses)} = <strong>{fmtZAR(data.net)}</strong></span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">EduStay Commission (10%):</span>
            <span><strong>{fmtZAR(data.commission)}</strong></span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border text-base">
            <span className="font-serif font-bold">GRAND TOTAL INCOME:</span>
            <span className={`font-bold ${data.grandTotal >= 0 ? "text-emerald-600" : "text-destructive"}`}>{fmtZAR(data.grandTotal)}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PropertyReport;
