import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Check,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  MapPin,
  Loader2,
  CheckCircle2,
  User,
  Phone,
  CalendarCheck,
} from "lucide-react";
import { addDays, subDays, isSameDay, format } from "date-fns";
import { Theme } from "../lib/themes";

/* ─── Types ─── */
interface StoreInfo {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  timezone: string;
}
interface ServiceItem {
  id: number;
  name: string;
  description?: string;
  duration: number;
  price: string;
  category: string;
}
interface TimeSlot {
  time: string;
  staffId: number;
  staffName: string;
}

type Step = "client" | "services" | "time" | "confirm" | "success";

/* ─── Helpers ─── */
function fmtTime(iso: string, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
  }).format(new Date(iso));
}
function fmtDate(iso: string, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: tz,
  }).format(new Date(iso));
}
function fmtShortDate(d: Date, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: tz,
  }).format(d);
}
function dateKey(d: Date) {
  return format(d, "yyyy-MM-dd");
}
function hourOf(iso: string, tz: string) {
  return parseInt(
    new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: tz }).format(
      new Date(iso)
    )
  );
}

/* ─── Spinner ─── */
function Spinner({ color }: { color: string }) {
  return <Loader2 size={22} className="animate-spin mx-auto my-8" style={{ color }} />;
}

/* ─── Main Component ─── */
interface Props {
  theme: Theme;
  bookingSlug: string;
  bookingDomain: string;
}

export default function BookingWidget({ theme, bookingSlug, bookingDomain }: Props) {
  const c = theme.colors;
  const base = `https://${bookingDomain}`;

  const [step, setStep] = useState<Step>("client");
  const [clientType, setClientType] = useState<"new" | "returning" | null>(null);
  const [returningPhone, setReturningPhone] = useState("");

  const [store, setStore] = useState<StoreInfo | null>(null);
  const [storeLoading, setStoreLoading] = useState(true);
  const [storeError, setStoreError] = useState(false);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);

  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<TimeSlot[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const tz = store?.timezone ?? "America/New_York";
  const totalDuration = selectedServices.reduce((s, x) => s + x.duration, 0);
  const totalPrice = selectedServices.reduce((s, x) => s + Number(x.price), 0);
  const primary = selectedServices[0];

  /* fetch store */
  useEffect(() => {
    fetch(`${base}/api/public/store/${bookingSlug}`)
      .then((r) => r.json())
      .then((d) => { setStore(d); setStoreLoading(false); })
      .catch(() => { setStoreError(true); setStoreLoading(false); });
  }, [base, bookingSlug]);

  /* fetch services when entering that step */
  useEffect(() => {
    if (step !== "services" || services.length) return;
    setServicesLoading(true);
    fetch(`${base}/api/public/store/${bookingSlug}/services`)
      .then((r) => r.json())
      .then((d) => { setServices(d.services ?? []); setServicesLoading(false); })
      .catch(() => setServicesLoading(false));
  }, [step, base, bookingSlug, services.length]);

  /* fetch slots when date or services change */
  useEffect(() => {
    if (step !== "time" || !primary) return;
    setSlotsLoading(true);
    setSlots(null);
    const params = new URLSearchParams({
      serviceId: String(primary.id),
      date: dateKey(selectedDate),
      duration: String(totalDuration),
    });
    fetch(`${base}/api/public/store/${bookingSlug}/availability?${params}`)
      .then((r) => r.json())
      .then((d) => { setSlots(Array.isArray(d) ? d : []); setSlotsLoading(false); })
      .catch(() => { setSlots([]); setSlotsLoading(false); });
  }, [step, primary, selectedDate, base, bookingSlug, totalDuration]);

  /* grouped */
  const groupedServices = useMemo(() => {
    const g: Record<string, ServiceItem[]> = {};
    for (const s of services) {
      const cat = s.category || "Services";
      if (!g[cat]) g[cat] = [];
      g[cat].push(s);
    }
    return g;
  }, [services]);

  const groupedSlots = useMemo(() => {
    if (!slots) return { morning: [], afternoon: [], evening: [] };
    const morning: TimeSlot[] = [], afternoon: TimeSlot[] = [], evening: TimeSlot[] = [];
    for (const slot of slots) {
      const h = hourOf(slot.time, tz);
      if (h < 12) morning.push(slot);
      else if (h < 17) afternoon.push(slot);
      else evening.push(slot);
    }
    return { morning, afternoon, evening };
  }, [slots, tz]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  /* handlers */
  const toggleCat = (cat: string) =>
    setCollapsedCats((p) => { const n = new Set(p); n.has(cat) ? n.delete(cat) : n.add(cat); return n; });

  const toggleService = (svc: ServiceItem) =>
    setSelectedServices((p) =>
      p.find((s) => s.id === svc.id) ? p.filter((s) => s.id !== svc.id) : [...p, svc]
    );

  const handleBook = async () => {
    if (!primary || !selectedSlot || !name.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${base}/api/public/store/${bookingSlug}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: primary.id,
          staffId: selectedSlot.staffId,
          date: selectedSlot.time,
          duration: totalDuration,
          customerName: name.trim(),
          customerEmail: email.trim() || undefined,
          customerPhone: phone.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("Booking failed");
      setStep("success");
    } catch {
      setSubmitError("Something went wrong. Please try again or call us to book.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Shared style helpers ─── */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: `1px solid ${c.border}`,
    backgroundColor: c.bg,
    color: c.text,
    fontFamily: theme.fonts.body,
    fontSize: "15px",
    outline: "none",
  };
  const btnPrimary: React.CSSProperties = {
    backgroundColor: c.buttonPrimary,
    color: c.badgeText,
    fontFamily: theme.fonts.body,
    fontWeight: 700,
    border: "none",
    borderRadius: "12px",
    padding: "14px 24px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "opacity 0.15s",
  };
  const btnOutline: React.CSSProperties = {
    backgroundColor: "transparent",
    color: c.text,
    fontFamily: theme.fonts.body,
    fontWeight: 600,
    border: `2px solid ${c.border}`,
    borderRadius: "12px",
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "border-color 0.15s",
  };

  /* ─── Loading / error ─── */
  if (storeLoading) return <Spinner color={c.accent} />;
  if (storeError || !store) {
    return (
      <p className="text-center py-10" style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}>
        Unable to load booking. Please call us to schedule your appointment.
      </p>
    );
  }

  /* ─── Success ─── */
  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: c.accentLight }}
        >
          <CheckCircle2 size={36} style={{ color: c.accent }} />
        </div>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: c.text, fontFamily: theme.fonts.heading }}
        >
          You're all booked!
        </h3>
        <p className="mb-4 text-base" style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}>
          Your appointment at {store.name} is confirmed.
        </p>
        {selectedSlot && (
          <p className="font-semibold" style={{ color: c.accent, fontFamily: theme.fonts.body }}>
            {fmtDate(selectedSlot.time, tz)} at {fmtTime(selectedSlot.time, tz)}
          </p>
        )}
        <button
          style={{ ...btnOutline, marginTop: "28px" }}
          onClick={() => { setStep("client"); setSelectedServices([]); setSelectedSlot(null); setName(""); setEmail(""); setPhone(""); }}
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  /* ─── Step: client ─── */
  if (step === "client") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <h3
          className="text-2xl font-bold mb-2 text-center"
          style={{ color: c.text, fontFamily: theme.fonts.heading }}
        >
          Welcome to {store.name}
        </h3>
        <p
          className="mb-10 text-center"
          style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
        >
          Are you a new or returning client?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button
            style={{ ...btnOutline, flex: 1, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", ...(clientType === "new" ? { borderColor: c.accent } : {}) }}
            onClick={() => { setClientType("new"); setStep("services"); }}
          >
            <User size={22} style={{ color: c.accent }} />
            <span>New Client</span>
          </button>
          <button
            style={{ ...btnOutline, flex: 1, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", ...(clientType === "returning" ? { borderColor: c.accent } : {}) }}
            onClick={() => setClientType("returning")}
          >
            <CalendarCheck size={22} style={{ color: c.accent }} />
            <span>Returning Client</span>
          </button>
        </div>
        {clientType === "returning" && (
          <div className="mt-6 w-full max-w-sm space-y-3">
            <input
              style={inputStyle}
              placeholder="Your phone number"
              value={returningPhone}
              onChange={(e) => setReturningPhone(e.target.value)}
            />
            <button
              style={{ ...btnPrimary, width: "100%" }}
              onClick={() => { setPhone(returningPhone); setStep("services"); }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ─── Step: services ─── */
  if (step === "services") {
    return (
      <div>
        <div
          className="flex items-center gap-3 px-2 py-3 mb-2"
          style={{ borderBottom: `1px solid ${c.border}` }}
        >
          <button
            onClick={() => setStep("client")}
            style={{ background: "none", border: "none", cursor: "pointer", color: c.textSecondary, display: "flex", alignItems: "center" }}
          >
            <ArrowLeft size={18} />
          </button>
          <h3
            className="font-bold text-lg"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            Select Services
          </h3>
        </div>

        {servicesLoading ? (
          <Spinner color={c.accent} />
        ) : (
          <div className="pb-24">
            {Object.entries(groupedServices).map(([cat, catServices]) => {
              const collapsed = collapsedCats.has(cat);
              return (
                <div key={cat} style={{ borderBottom: `1px solid ${c.border}` }}>
                  <button
                    onClick={() => toggleCat(cat)}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 4px", background: "none", border: "none", cursor: "pointer" }}
                  >
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: c.accent, fontFamily: theme.fonts.body }}
                    >
                      {cat}
                    </span>
                    <ChevronDown
                      size={16}
                      style={{ color: c.textSecondary, transform: collapsed ? "rotate(-90deg)" : "none", transition: "transform 0.2s" }}
                    />
                  </button>
                  {!collapsed && (
                    <div className="pb-2">
                      {catServices.map((svc) => {
                        const selected = selectedServices.some((s) => s.id === svc.id);
                        return (
                          <button
                            key={svc.id}
                            onClick={() => toggleService(svc)}
                            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px", background: "none", border: "none", cursor: "pointer", borderRadius: "8px" }}
                          >
                            <div style={{ textAlign: "left", flex: 1 }}>
                              <p
                                className="font-semibold text-sm"
                                style={{ color: c.text, fontFamily: theme.fonts.body }}
                              >
                                {svc.name}
                              </p>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
                              >
                                {svc.duration} min
                              </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span
                                className="font-bold"
                                style={{ color: c.priceTag, fontFamily: theme.fonts.heading }}
                              >
                                ${Number(svc.price).toFixed(2)}
                              </span>
                              <div
                                style={{ width: "28px", height: "28px", borderRadius: "50%", border: `2px solid ${selected ? c.accent : c.border}`, backgroundColor: selected ? c.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                              >
                                {selected
                                  ? <Check size={14} style={{ color: c.badgeText }} />
                                  : <Plus size={14} style={{ color: c.textSecondary }} />
                                }
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {selectedServices.length > 0 && (
          <div
            style={{ position: "sticky", bottom: 0, backgroundColor: c.bgSecondary, borderTop: `1px solid ${c.border}`, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}
          >
            <div>
              <span
                className="text-sm font-semibold"
                style={{ color: c.text, fontFamily: theme.fonts.body }}
              >
                {selectedServices.length} service{selectedServices.length > 1 ? "s" : ""}
              </span>
              <span
                className="text-sm ml-2"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                ${totalPrice.toFixed(2)} · {totalDuration} min
              </span>
            </div>
            <button style={btnPrimary} onClick={() => setStep("time")}>
              Choose Time
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ─── Step: time ─── */
  if (step === "time") {
    return (
      <div>
        <div
          className="flex items-center gap-3 px-2 py-3"
          style={{ borderBottom: `1px solid ${c.border}` }}
        >
          <button
            onClick={() => setStep("services")}
            style={{ background: "none", border: "none", cursor: "pointer", color: c.textSecondary, display: "flex", alignItems: "center" }}
          >
            <ArrowLeft size={18} />
          </button>
          <h3
            className="font-bold text-lg"
            style={{ color: c.text, fontFamily: theme.fonts.heading }}
          >
            Choose a Time
          </h3>
        </div>

        {/* Week navigator */}
        <div className="py-4" style={{ borderBottom: `1px solid ${c.border}` }}>
          <div className="flex items-center justify-between mb-3 px-2">
            <button
              onClick={() => { const s = subDays(weekStart, 7); setWeekStart(s); setSelectedDate(s); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: c.textSecondary, display: "flex" }}
            >
              <ChevronLeft size={20} />
            </button>
            <span
              className="text-sm font-semibold"
              style={{ color: c.text, fontFamily: theme.fonts.body }}
            >
              {fmtShortDate(selectedDate, tz)}
            </span>
            <button
              onClick={() => { const s = addDays(weekStart, 7); setWeekStart(s); setSelectedDate(s); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: c.textSecondary, display: "flex" }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex justify-between px-1">
            {weekDays.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "4px 6px", background: "none", border: "none", cursor: "pointer" }}
                >
                  <span
                    className="text-xs uppercase"
                    style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
                  >
                    {format(day, "EEE")}
                  </span>
                  <span
                    style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, fontFamily: theme.fonts.body, backgroundColor: isSelected ? c.accent : "transparent", color: isSelected ? c.badgeText : isToday ? c.accent : c.text, border: isToday && !isSelected ? `1px solid ${c.accent}` : "none" }}
                  >
                    {format(day, "d")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slots */}
        <div className="py-4 pb-6">
          {slotsLoading ? (
            <Spinner color={c.accent} />
          ) : !slots || slots.length === 0 ? (
            <p
              className="text-center py-10"
              style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
            >
              No availability for this date. Try another day.
            </p>
          ) : (
            <div className="space-y-6">
              {(["morning", "afternoon", "evening"] as const).map((period) => {
                const periodSlots = groupedSlots[period];
                if (!periodSlots.length) return null;
                return (
                  <div key={period}>
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-3"
                      style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
                    >
                      {period}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {periodSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => { setSelectedSlot(slot); setStep("confirm"); }}
                          style={{ ...btnOutline, padding: "8px 4px", fontSize: "13px", borderRadius: "10px" }}
                        >
                          {fmtTime(slot.time, tz)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─── Step: confirm ─── */
  return (
    <div>
      <div
        className="flex items-center gap-3 px-2 py-3"
        style={{ borderBottom: `1px solid ${c.border}` }}
      >
        <button
          onClick={() => setStep("time")}
          style={{ background: "none", border: "none", cursor: "pointer", color: c.textSecondary, display: "flex", alignItems: "center" }}
        >
          <ArrowLeft size={18} />
        </button>
        <h3
          className="font-bold text-lg"
          style={{ color: c.text, fontFamily: theme.fonts.heading }}
        >
          Confirm Booking
        </h3>
      </div>

      <div className="py-6 space-y-6">
        {/* Summary */}
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{ backgroundColor: c.card, border: `1px solid ${c.border}` }}
        >
          {selectedSlot && (
            <div className="flex items-start gap-3">
              <Clock size={16} style={{ color: c.accent, flexShrink: 0, marginTop: "2px" }} />
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: c.text, fontFamily: theme.fonts.body }}
                >
                  {fmtDate(selectedSlot.time, tz)}
                </p>
                <p
                  className="text-sm"
                  style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
                >
                  {fmtTime(selectedSlot.time, tz)} · {totalDuration} min
                </p>
              </div>
            </div>
          )}
          {store.address && (
            <div className="flex items-start gap-3">
              <MapPin size={16} style={{ color: c.accent, flexShrink: 0, marginTop: "2px" }} />
              <p
                className="text-sm"
                style={{ color: c.textSecondary, fontFamily: theme.fonts.body }}
              >
                {store.address}
              </p>
            </div>
          )}
          <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: "12px" }}>
            {selectedServices.map((svc) => (
              <div key={svc.id} className="flex justify-between text-sm">
                <span style={{ color: c.text, fontFamily: theme.fonts.body }}>{svc.name}</span>
                <span style={{ color: c.priceTag, fontFamily: theme.fonts.heading, fontWeight: 700 }}>
                  ${Number(svc.price).toFixed(2)}
                </span>
              </div>
            ))}
            {selectedServices.length > 1 && (
              <div
                className="flex justify-between text-sm font-bold mt-2 pt-2"
                style={{ borderTop: `1px solid ${c.border}` }}
              >
                <span style={{ color: c.text, fontFamily: theme.fonts.body }}>Total</span>
                <span style={{ color: c.accent, fontFamily: theme.fonts.heading }}>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact fields */}
        <div className="space-y-3">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: c.accent, fontFamily: theme.fonts.body }}
          >
            Your Details
          </p>
          <div style={{ position: "relative" }}>
            <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: c.textSecondary, pointerEvents: "none" }} />
            <input
              style={{ ...inputStyle, paddingLeft: "40px" }}
              placeholder="Full name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={{ position: "relative" }}>
            <Phone size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: c.textSecondary, pointerEvents: "none" }} />
            <input
              style={{ ...inputStyle, paddingLeft: "40px" }}
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <input
            style={inputStyle}
            placeholder="Email address (optional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {submitError && (
          <p
            className="text-sm"
            style={{ color: "#ef4444", fontFamily: theme.fonts.body }}
          >
            {submitError}
          </p>
        )}

        <button
          style={{ ...btnPrimary, width: "100%", opacity: (!name.trim() || submitting) ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          onClick={handleBook}
          disabled={!name.trim() || submitting}
        >
          {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
          {submitting ? "Booking…" : "Confirm Appointment"}
        </button>
      </div>
    </div>
  );
}
