"use client";

import { useState, useEffect, useRef } from "react";
import {
    X, Calendar, Clock, ChevronLeft, CreditCard, AlertCircle,
    CheckCircle2, User, Mail, Phone, Sparkles, ArrowRight
} from "lucide-react";
import Lottie from "lottie-react";
import successAnimation from "../assets/payment_success.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Script from "next/script";

interface SlotItem { time: string; booked: boolean; passed?: boolean; }

interface BookingModalProps { isOpen: boolean; onClose: () => void; }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidPhone = (p: string) => p.replace(/\D/g, "").length >= 10;

// Step labels for the progress bar
const STEPS = ["Select Slot", "Your Details", "Payment"];

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
    const [step, setStep] = useState(1);         // 1=slot, 2=details, 3=success, 4=processing, 5=failed
    const [prevStep, setPrevStep] = useState(1);
    const [animDir, setAnimDir] = useState<"forward" | "back">("forward");
    const [animating, setAnimating] = useState(false);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [slots, setSlots] = useState<SlotItem[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const contentRef = useRef<HTMLDivElement>(null);

    // ── Fetch slots ──
    useEffect(() => {
        if (!isOpen) return;
        setLoadingSlots(true);
        const dateStr = selectedDate.toISOString().split("T")[0];
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        fetch(`${apiUrl}/slots?date=${dateStr}`)
            .then(r => r.json())
            .then(d => { setSlots(d[0]?.slots ?? []); setLoadingSlots(false); })
            .catch(() => setLoadingSlots(false));
    }, [isOpen, selectedDate]);

    // ── Animated step transition ──
    const goTo = (next: number, dir: "forward" | "back" = "forward") => {
        if (animating) return;
        setAnimDir(dir);
        setAnimating(true);
        setTimeout(() => {
            setPrevStep(step);
            setStep(next);
            setAnimating(false);
        }, 220);
    };

    // ── Validation ──
    const validate = (data: typeof formData) => {
        const e: Record<string, string> = {};
        if (!data.name.trim()) e.name = "Full name is required";
        else if (data.name.trim().length < 2) e.name = "Name must be at least 2 characters";
        if (!data.email.trim()) e.email = "Email address is required";
        else if (!EMAIL_REGEX.test(data.email)) e.email = "Please enter a valid email address";
        if (!data.phone) e.phone = "Phone number is required";
        else if (!isValidPhone(data.phone)) e.phone = "Please enter a valid 10-digit number";
        return e;
    };

    const handleChange = (field: string, value: string) => {
        const updated = { ...formData, [field]: value };
        setFormData(updated);
        if (touched[field]) setErrors(prev => ({ ...prev, [field]: validate(updated)[field] || "" }));
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        setErrors(prev => ({ ...prev, [field]: validate(formData)[field] || "" }));
    };

    // ── Payment ──
    const handlePayment = async () => {
        setTouched({ name: true, email: true, phone: true });
        const errs = validate(formData);
        setErrors(errs);
        if (Object.keys(errs).filter(k => errs[k]).length > 0) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${apiUrl}/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: 50000, currency: "INR",
                    receipt: `rcpt_${Date.now()}`,
                    date: selectedDate.toISOString().split("T")[0],
                    slot: selectedSlot,
                    ...formData
                }),
            });
            const order = await res.json();

            const rzp = new (window as any).Razorpay({
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                amount: order.amount, currency: order.currency,
                name: "Rehab 5", description: "Doctor Consultation Fee",
                order_id: order.id,
                theme: { color: "#24a3ac" },
                prefill: { name: formData.name, email: formData.email, contact: formData.phone },
                handler: async (resp: any) => {
                    goTo(4);
                    try {
                        const v = await fetch(`${apiUrl}/verify-payment`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: resp.razorpay_order_id,
                                razorpay_payment_id: resp.razorpay_payment_id,
                                razorpay_signature: resp.razorpay_signature,
                                date: selectedDate.toISOString().split("T")[0],
                                slot: selectedSlot, ...formData
                            }),
                        });
                        if (!v.ok) throw new Error();
                        goTo(3);
                    } catch { goTo(5); }
                },
            });
            rzp.open();
        } catch { /* silent */ }
    };

    const resetForm = () => {
        setStep(1); setPrevStep(1); setSelectedSlot(null);
        setFormData({ name: "", email: "", phone: "" });
        setErrors({}); setTouched({});
        onClose();
    };

    if (!isOpen) return null;

    // ── Helpers ──
    const fieldCls = (err?: string) =>
        `w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all duration-200 text-sm ${err
            ? "border-red-400 bg-red-50 focus:ring-red-200"
            : "border-gray-200 bg-gray-50 focus:bg-white focus:border-primary"
        }`;

    const FieldError = ({ msg }: { msg?: string }) =>
        msg ? (
            <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5 animate-[slideDown_0.2s_ease]">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {msg}
            </p>
        ) : null;

    // Animation class for content slide
    const slideClass = animating
        ? animDir === "forward"
            ? "opacity-0 translate-x-6 scale-[0.98]"
            : "opacity-0 -translate-x-6 scale-[0.98]"
        : "opacity-100 translate-x-0 scale-100";

    const isMainStep = step <= 2;
    const progressStep = step === 3 || step === 4 || step === 5 ? 3 : step;

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {/* ── Backdrop ── */}
            <div
                className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
                style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
                onClick={(e) => e.target === e.currentTarget && resetForm()}
            >
                {/* ── Modal ── */}
                <div
                    className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
                    style={{
                        animation: "modalSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                        maxHeight: "92dvh",
                    }}
                >
                    {/* ── Gradient header strip ── */}
                    <div className="relative bg-gradient-to-r from-primary to-[#1b7c83] px-5 pt-5 pb-6">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-12 w-20 h-20 bg-white/5 rounded-full translate-y-1/2" />

                        <div className="relative flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {step === 2 && (
                                    <button
                                        onClick={() => goTo(1, "back")}
                                        className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-white" />
                                    </button>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-white/70" />
                                        <span className="text-white/70 text-xs font-medium tracking-wide uppercase">
                                            {step === 1 ? "Step 1 of 3" : step === 2 ? "Step 2 of 3" : step === 3 ? "Confirmed!" : step === 4 ? "Processing" : "Error"}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-white mt-0.5">
                                        {step === 1 ? "Choose Your Slot" : step === 2 ? "Patient Details" : step === 4 ? "Confirming Booking" : step === 5 ? "Payment Failed" : "Booking Confirmed!"}
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={resetForm}
                                className="p-2 bg-white/15 hover:bg-white/25 rounded-full transition-colors group"
                            >
                                <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-200" />
                            </button>
                        </div>

                        {/* ── Progress bar ── */}
                        {isMainStep && (
                            <div className="flex items-center gap-1">
                                {STEPS.map((label, i) => {
                                    const n = i + 1;
                                    const active = n === progressStep;
                                    const done = n < progressStep;
                                    return (
                                        <div key={label} className="flex items-center flex-1">
                                            <div className={`flex items-center gap-1.5 ${active ? "opacity-100" : done ? "opacity-80" : "opacity-40"}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${done ? "bg-white text-primary" : active ? "bg-white text-primary ring-2 ring-white/40 ring-offset-1 ring-offset-primary" : "bg-white/20 text-white"}`}>
                                                    {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
                                                </div>
                                                <span className="text-white text-xs font-medium hidden sm:block">{label}</span>
                                            </div>
                                            {i < STEPS.length - 1 && (
                                                <div className="flex-1 mx-2 h-0.5 rounded-full" style={{ background: done ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)" }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── Scrollable content ── */}
                    <div
                        ref={contentRef}
                        className="overflow-y-auto"
                        style={{ maxHeight: "calc(92dvh - 140px)" }}
                    >
                        <div
                            className={`p-5 transition-all duration-200 ease-out ${slideClass}`}
                            style={{ willChange: "transform, opacity" }}
                        >
                            {/* ══ STEP 1: Slot Picker ══ */}
                            {step === 1 && (
                                <div className="space-y-5">
                                    {/* Date picker */}
                                    <div>
                                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                                            <Calendar className="w-4 h-4 text-primary" /> Select Date
                                        </label>
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={(d: Date | null) => setSelectedDate(d || new Date())}
                                            minDate={new Date()}
                                            className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none text-sm transition-all"
                                            dateFormat="MMMM d, yyyy"
                                            wrapperClassName="w-full"
                                        />
                                    </div>

                                    {/* Slots */}
                                    <div>
                                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-3">
                                            <Clock className="w-4 h-4 text-primary" /> Available Slots
                                        </label>
                                        {loadingSlots ? (
                                            <div className="grid grid-cols-3 gap-2">
                                                {[...Array(6)].map((_, i) => (
                                                    <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                                {slots.length > 0 ? slots.map((slot, i) => {
                                                    const isDisabled = slot.booked || slot.passed;
                                                    return (
                                                        <button
                                                            key={i}
                                                            disabled={isDisabled}
                                                            onClick={() => !isDisabled && setSelectedSlot(slot.time)}
                                                            className={`relative px-3 py-3 rounded-xl border text-sm font-medium transition-all duration-200 group ${isDisabled
                                                                ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                                                                : selectedSlot === slot.time
                                                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-[1.03]"
                                                                    : "border-gray-200 hover:border-primary/60 hover:bg-primary/5 text-gray-600 hover:text-primary hover:scale-[1.02]"
                                                                }`}
                                                            style={{ animationDelay: `${i * 50}ms` }}
                                                        >
                                                            {selectedSlot === slot.time && (
                                                                <span className="absolute inset-0 rounded-xl animate-ping bg-primary/20" />
                                                            )}
                                                            {isDisabled ? <s>{slot.time}</s> : slot.time}
                                                            {isDisabled && (
                                                                <span className="block text-[9px] text-gray-300 mt-0.5">
                                                                    {slot.passed ? "Passed" : "Booked"}
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                }) : (
                                                    <p className="col-span-3 text-center text-gray-400 text-sm py-6">No slots available for this date</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected slot summary */}
                                    {selectedSlot && (
                                        <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl animate-[slideDown_0.25s_ease]">
                                            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Selected</p>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {selectedSlot}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        disabled={!selectedSlot}
                                        onClick={() => goTo(2)}
                                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-dark active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
                                    >
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* ══ STEP 2: Patient Details ══ */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    {/* Slot summary pill */}
                                    <div className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-full px-4 py-2 text-xs text-primary font-medium">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {selectedSlot}
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                                            <User className="w-3.5 h-3.5 text-primary" />
                                            Full Name <span className="text-red-400 ml-0.5">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={fieldCls(errors.name)}
                                            placeholder="e.g. Priya Sharma"
                                            value={formData.name}
                                            onChange={e => handleChange("name", e.target.value)}
                                            onBlur={() => handleBlur("name")}
                                        />
                                        <FieldError msg={errors.name} />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                                            <Mail className="w-3.5 h-3.5 text-primary" />
                                            Email Address <span className="text-red-400 ml-0.5">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className={fieldCls(errors.email)}
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={e => handleChange("email", e.target.value)}
                                            onBlur={() => handleBlur("email")}
                                        />
                                        <FieldError msg={errors.email} />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                                            <Phone className="w-3.5 h-3.5 text-primary" />
                                            Phone Number <span className="text-red-400 ml-0.5">*</span>
                                        </label>
                                        <div className={`rounded-xl overflow-hidden border transition-all duration-200 ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus-within:border-primary focus-within:bg-white"}`}>
                                            <PhoneInput
                                                country="in"
                                                value={formData.phone}
                                                onChange={p => handleChange("phone", p)}
                                                onBlur={() => handleBlur("phone")}
                                                inputStyle={{ width: "100%", border: "none", background: "transparent", height: "44px", paddingLeft: "58px", fontSize: "14px" }}
                                                buttonStyle={{ border: "none", background: "transparent" }}
                                                containerStyle={{ width: "100%" }}
                                            />
                                        </div>
                                        <FieldError msg={errors.phone} />
                                    </div>

                                    {/* Fee summary */}
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-400">Consultation Fee</p>
                                            <p className="text-lg font-bold text-gray-800">₹500</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">Secure payment via</p>
                                            <p className="text-sm font-semibold text-primary">Razorpay</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-dark active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Pay &amp; Book — ₹500
                                    </button>
                                    <p className="text-center text-[11px] text-gray-400">🔒 Safe, encrypted &amp; secure checkout</p>
                                </div>
                            )}

                            {/* ══ STEP 4: Processing ══ */}
                            {step === 4 && (
                                <div className="flex flex-col items-center justify-center gap-6 py-14">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <CreditCard className="w-7 h-7 text-primary animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-gray-800">Confirming your booking...</h3>
                                        <p className="text-sm text-gray-400 mt-1">Please don't close this window</p>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {[0, 1, 2].map(i => (
                                            <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ══ STEP 5: Failed ══ */}
                            {step === 5 && (
                                <div className="flex flex-col items-center justify-center gap-5 py-10">
                                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-[scaleIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
                                        <X className="w-10 h-10 text-red-500" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-gray-800">Verification Failed</h3>
                                        <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">Payment was received but booking couldn't be confirmed. Please contact support with your payment ID.</p>
                                    </div>
                                    <button onClick={resetForm} className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors">Close</button>
                                </div>
                            )}

                            {/* ══ STEP 3: Success ══ */}
                            {step === 3 && (
                                <div className="flex flex-col items-center justify-center gap-4 py-6">
                                    <div className="w-44 h-44">
                                        <Lottie animationData={successAnimation} loop={false} />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <h3 className="text-2xl font-bold text-gray-800">You&apos;re all set! 🎉</h3>
                                        <p className="text-gray-500 text-sm">Appointment confirmed for</p>
                                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold px-5 py-2.5 rounded-full mt-1 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            {selectedDate.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })} · {selectedSlot}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 text-center">A confirmation email has been sent to <strong>{formData.email}</strong></p>
                                    <button
                                        onClick={resetForm}
                                        className="mt-2 flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                                    >
                                        Back to Home
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
