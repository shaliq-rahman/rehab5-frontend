"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Clock, ChevronLeft, CreditCard } from "lucide-react";
import Lottie from "lottie-react";
import successAnimation from "../assets/payment_success.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Script from "next/script";

interface SlotItem {
    time: string;
    booked: boolean;
}

interface SlotData {
    date: string;
    slots: SlotItem[];
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [slots, setSlots] = useState<SlotItem[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // User Details
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    // Fetch slots when date changes
    useEffect(() => {
        if (isOpen && selectedDate) {
            setLoading(true);
            const dateStr = selectedDate.toISOString().split('T')[0];
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            fetch(`${apiUrl}/slots?date=${dateStr}`)
                .then((res) => res.json())
                .then((data) => {
                    // Backend returns array, we take the first item since we request specific date
                    if (data.length > 0) {
                        setSlots(data[0].slots);
                    } else {
                        setSlots([]);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch slots:", err);
                    setLoading(false);
                });
        }
    }, [isOpen, selectedDate]);

    const resetForm = () => {
        setStep(1);
        setSelectedSlot(null);
        setFormData({
            name: "",
            email: "",
            phone: ""
        });
        onClose();
    };

    const handlePayment = async () => {
        if (!selectedSlot || !formData.name || !formData.email || !formData.phone) {
            alert("Please fill all details");
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            // 1. Create Order
            const res = await fetch(`${apiUrl}/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: 50000, // 500 INR
                    currency: "INR",
                    receipt: `receipt_${Date.now()}`,
                    date: selectedDate.toISOString().split('T')[0],
                    slot: selectedSlot,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                })
            });
            const order = await res.json();

            // 2. Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                amount: order.amount,
                currency: order.currency,
                name: "Rehab 5",
                description: "Doctor Consultation Fee",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                        const verifyRes = await fetch(`${apiUrl}/verify-payment`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                date: selectedDate.toISOString().split('T')[0],
                                slot: selectedSlot,
                                email: formData.email,
                                name: formData.name,
                                phone: formData.phone
                            })
                        });

                        if (!verifyRes.ok) throw new Error("Verification failed");

                        setStep(3); // Go to success step
                    } catch (err) {
                        console.error("Verification Error:", err);
                        alert("Payment successful but verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#24a3ac"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment initialization failed");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            {step === 2 && (
                                <button onClick={() => setStep(1)} className="p-1 hover:bg-gray-100 rounded-full">
                                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                                </button>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {step === 1 ? "Select Slot" : step === 2 ? "Patient Details" : "Booking Confirmed"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {step === 1 ? "Choose a date and time" : step === 2 ? "Enter your information to book" : "Thank you for your booking"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={resetForm}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {step === 1 ? (
                            <div className="flex flex-col gap-6">
                                {/* Date Picker */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">Select Date</label>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date: Date | null) => setSelectedDate(date || new Date())}
                                        minDate={new Date()}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        dateFormat="MMMM d, yyyy"
                                    />
                                </div>

                                {/* Slots Grid */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary" />
                                        Available Slots
                                    </h3>
                                    {loading ? (
                                        <div className="flex justify-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {slots.length > 0 ? (
                                                slots.map((slot, index) => (
                                                    <button
                                                        key={index}
                                                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all text-center ${slot.booked
                                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                                            : selectedSlot === slot.time
                                                                ? "bg-primary text-white border-primary"
                                                                : "border-gray-200 hover:border-primary hover:text-primary text-gray-600"
                                                            }`}
                                                        onClick={() => !slot.booked && setSelectedSlot(slot.time)}
                                                        disabled={slot.booked}
                                                    >
                                                        {slot.time}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="col-span-3 text-center text-gray-400 text-sm py-4">No slots available</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="w-full bg-primary text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
                                    disabled={!selectedSlot}
                                    onClick={() => setStep(2)}
                                >
                                    Continue
                                </button>
                            </div>
                        ) : step === 2 ? (
                            <div className="flex flex-col gap-5">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <PhoneInput
                                            country={'in'}
                                            value={formData.phone}
                                            onChange={(phone) => setFormData({ ...formData, phone })}
                                            inputClass="!w-full !p-3 !pl-12 !h-12 !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-primary"
                                            containerClass="!w-full"
                                            buttonClass="!border-gray-300 !rounded-l-lg"
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Consultation Fee</span>
                                    <span className="font-semibold text-gray-900">₹500.00</span>
                                </div>

                                <button
                                    className="w-full bg-primary text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
                                    onClick={handlePayment}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Pay & Book Appointment
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-6 py-6 animate-in fade-in zoom-in duration-300">
                                <div className="w-48 h-48">
                                    <Lottie animationData={successAnimation} loop={false} />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-800">Booking Successful!</h3>
                                    <p className="text-gray-500">
                                        Your appointment has been confirmed for <br />
                                        <span className="font-semibold text-gray-700">
                                            {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} at {selectedSlot}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    onClick={resetForm}
                                    className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                                >
                                    Back to Home
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingModal;
