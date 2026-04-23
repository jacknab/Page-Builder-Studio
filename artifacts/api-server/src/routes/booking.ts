import { Router } from "express";

const router = Router();

const STORE: Record<string, { id: number; name: string; address: string; phone: string; timezone: string }> = {
  "luxe-nail-studio": {
    id: 1,
    name: "Luxe Nail Studio",
    address: "245 Palm Ave, Suite 3, Miami Beach, FL 33139",
    phone: "(305) 555-0182",
    timezone: "America/New_York",
  },
};

const SERVICES: Record<string, object[]> = {
  "luxe-nail-studio": [
    { id: 1, name: "Classic Manicure", description: "Shape, cuticle care & polish", duration: 30, price: "28", category: "Manicure" },
    { id: 2, name: "Gel Manicure", description: "Long-lasting gel colour", duration: 45, price: "42", category: "Manicure" },
    { id: 3, name: "Acrylic Full Set", description: "Full set of acrylic extensions", duration: 75, price: "65", category: "Acrylic" },
    { id: 4, name: "Acrylic Fill", description: "2–3 week fill-in", duration: 60, price: "45", category: "Acrylic" },
    { id: 5, name: "Classic Pedicure", description: "Soak, scrub & polish", duration: 45, price: "38", category: "Pedicure" },
    { id: 6, name: "Gel Pedicure", description: "Gel polish pedicure", duration: 60, price: "52", category: "Pedicure" },
    { id: 7, name: "Spa Pedicure", description: "Deluxe soak, massage & masque", duration: 75, price: "65", category: "Pedicure" },
    { id: 8, name: "Nail Art (per nail)", description: "Custom hand-painted designs", duration: 5, price: "5", category: "Add-ons" },
    { id: 9, name: "French Tips", description: "Classic French or ombré", duration: 20, price: "15", category: "Add-ons" },
    { id: 10, name: "Nail Repair", description: "Single nail repair", duration: 15, price: "10", category: "Add-ons" },
  ],
};

const STAFF = [
  { id: 1, name: "Mia Chen" },
  { id: 2, name: "Sofia Reyes" },
  { id: 3, name: "Priya Patel" },
];

function generateSlots(dateStr: string) {
  const slots: { time: string; staffId: number; staffName: string }[] = [];
  const [year, month, day] = dateStr.split("-").map(Number);
  const startHour = 10;
  const endHour = 18;
  const intervalMin = 30;

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMin) {
      const d = new Date(year, month - 1, day, h, m, 0, 0);
      const iso = d.toISOString();
      const staffIndex = (h * 2 + m / 30) % STAFF.length;
      const staff = STAFF[Math.floor(staffIndex)];
      slots.push({ time: iso, staffId: staff.id, staffName: staff.name });
    }
  }
  return slots;
}

const bookings: object[] = [];

router.get("/store/:slug", (req, res) => {
  const store = STORE[req.params.slug];
  if (!store) { res.status(404).json({ error: "Store not found" }); return; }
  res.json(store);
});

router.get("/store/:slug/services", (req, res) => {
  const services = SERVICES[req.params.slug] ?? [];
  res.json({ services });
});

router.get("/store/:slug/availability", (req, res) => {
  const { date } = req.query as { date: string };
  if (!date) { res.status(400).json({ error: "date is required" }); return; }
  if (!STORE[req.params.slug]) { res.status(404).json({ error: "Store not found" }); return; }
  res.json(generateSlots(date));
});

router.post("/store/:slug/book", (req, res) => {
  const { serviceId, staffId, date, duration, customerName } = req.body;
  if (!serviceId || !staffId || !date || !customerName) {
    res.status(400).json({ error: "Missing required fields" }); return;
  }
  const booking = { id: Math.random().toString(36).slice(2, 9), slug: req.params.slug, ...req.body, bookedAt: new Date().toISOString() };
  bookings.push(booking);
  res.status(201).json({ success: true, bookingId: (booking as { id: string }).id });
});

export default router;
