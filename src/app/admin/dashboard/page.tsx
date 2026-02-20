"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, Calendar, Clock, User, Phone, CheckCircle, Clock3, LayoutDashboard, Activity, Users, FileText, ChevronLeft, ChevronRight, Mail, RefreshCw, X } from "lucide-react";

interface Booking {
    id: number;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    status: string;
    order_id: string;
    created_at: string;
    amount: number;
}

export default function AdminDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [resendingId, setResendingId] = useState<number | null>(null);
    const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const bookingsPerPage = 10;
    const router = useRouter();

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem("admin_token");

            if (!token) {
                router.push("/admin");
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                const url = selectedDate
                    ? `${apiUrl}/admin/bookings?date=${selectedDate}`
                    : `${apiUrl}/admin/bookings`;

                const response = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setBookings(data);
                } else if (response.status === 401) {
                    localStorage.removeItem("admin_token");
                    router.push("/admin");
                }
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [router, selectedDate]);

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        router.push("/admin");
    };

    const handleResendEmail = async (id: number) => {
        setResendingId(id);
        setToastMessage(null);
        const token = localStorage.getItem("admin_token");
        if (!token) {
            router.push("/admin");
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const response = await fetch(`${apiUrl}/admin/resend-email/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setToastMessage({ type: 'success', text: 'Email resent successfully!' });
            } else {
                setToastMessage({ type: 'error', text: 'Failed to resend email. Please try again.' });
            }
        } catch (error) {
            setToastMessage({ type: 'error', text: 'Network error while sending email.' });
        } finally {
            setResendingId(null);
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center space-y-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500 font-medium animate-pulse">Loading dashboard data...</p>
            </div>
        );
    }

    // Pagination calculations
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(bookings.length / bookingsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-primary/10 to-transparent -z-10" />

            <div className="max-w-[85rem] mx-auto p-6 md:p-10 space-y-8">

                {/* Toast Notification */}
                {toastMessage && (
                    <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg border animate-fade-up flex items-center gap-3 ${toastMessage.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                        {toastMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                        <p className="font-semibold text-sm">{toastMessage.text}</p>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/80 p-5 md:px-8 rounded-2xl shadow-sm border border-white/60 backdrop-blur-xl animate-fade-up">
                    <div className="flex items-center gap-5 w-full md:w-auto">
                        <div className="bg-primary/5 p-2 rounded-xl border border-primary/10 hidden md:block">
                            <Image src="/assets/logo.png" alt="Rehab 5" width={130} height={35} className="object-contain" />
                        </div>
                        <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                <LayoutDashboard className="w-5 h-5" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 font-semibold px-5 py-2.5 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 uppercase tracking-wide text-xs w-full md:w-auto justify-center"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-7 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform animate-fade-up delay-100">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                Total Bookings
                            </p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-extrabold text-gray-900">{bookings.length}</h3>
                            <span className="text-sm font-medium text-gray-400">appointments</span>
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform animate-fade-up delay-200">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                Confirmed
                            </p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-extrabold text-emerald-600">
                                {bookings.filter(b => b.status === "Confirmed").length}
                            </h3>
                            <span className="text-sm font-medium text-emerald-600/60">appointments</span>
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform animate-fade-up delay-300">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Clock3 className="w-4 h-4 text-amber-400" />
                                Pending
                            </p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-extrabold text-amber-500">
                                {bookings.filter(b => b.status === "Pending").length}
                            </h3>
                            <span className="text-sm font-medium text-amber-500/60">appointments</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Table */}
                <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden animate-fade-up delay-400">
                    <div className="p-6 md:p-8 border-b border-gray-100/80 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recent Appointments</h2>
                            <p className="text-sm text-gray-500 mt-1">Overview of all scheduled patient consultations.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-gray-400 pointer-events-none">
                                    <Calendar className="w-4 h-4" />
                                </span>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                />
                                {selectedDate && (
                                    <button
                                        onClick={() => setSelectedDate("")}
                                        className="absolute right-3 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Clear Filter"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 opacity-60 hidden sm:block">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse relative">
                            <thead className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm shadow-sm">
                                <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="p-5 font-semibold border-b border-gray-100">Patient Details</th>
                                    <th className="p-5 font-semibold border-b border-gray-100">Schedule (IST)</th>
                                    <th className="p-5 font-semibold border-b border-gray-100">Status</th>
                                    <th className="p-5 font-semibold border-b border-gray-100">Added On</th>
                                    <th className="p-5 font-semibold border-b border-gray-100">Amount</th>
                                    <th className="p-5 font-semibold border-b border-gray-100 text-right">Order Reference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {currentBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/80 transition-colors group">
                                        {/* Patient */}
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg hidden sm:flex">
                                                    {booking.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 flex items-center gap-2 text-[15px]">
                                                        {booking.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-0.5">{booking.email}</div>
                                                    <div className="text-sm text-gray-400 mt-0.5 flex items-center gap-1.5 ">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        {booking.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Schedule */}
                                        <td className="p-5 align-top pt-6">
                                            <div className="flex items-center gap-2.5 font-semibold text-gray-900 text-sm">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                {booking.date}
                                            </div>
                                            <div className="flex items-center gap-2.5 text-sm text-gray-500 mt-1.5 font-medium">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {booking.time}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="p-5 align-top pt-6">
                                            {booking.status === "Confirmed" ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/60 shadow-sm shadow-emerald-100/50">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    CONFIRMED
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100/60 shadow-sm shadow-amber-100/50">
                                                    <Clock3 className="w-3.5 h-3.5" />
                                                    PENDING
                                                </span>
                                            )}
                                        </td>

                                        {/* Added On */}
                                        <td className="p-5 align-top pt-6">
                                            {booking.created_at ? (
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="text-[13px] font-semibold text-gray-800">
                                                        {new Date(booking.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    </div>
                                                    <div className="text-[12px] text-gray-500 font-medium flex items-center gap-1">
                                                        <Clock3 className="w-3 h-3 text-gray-400" />
                                                        {new Date(booking.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">—</span>
                                            )}
                                        </td>

                                        {/* Amount */}
                                        <td className="p-5 align-top pt-6">
                                            <div className="flex items-center gap-1 font-bold text-gray-800 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 inline-flex shadow-sm">
                                                <span className="text-gray-400 font-medium text-sm">₹</span>
                                                {Number(booking.amount).toFixed(2)}
                                            </div>
                                        </td>

                                        {/* Order ID */}
                                        <td className="p-5 align-top pt-6 text-right">
                                            <div className="flex flex-col items-end gap-2.5">
                                                <div className="text-[13px] font-mono font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg inline-block border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all shadow-gray-200/50">
                                                    #{booking.order_id.replace('order_', '')}
                                                </div>
                                                <button
                                                    onClick={() => handleResendEmail(booking.id)}
                                                    disabled={resendingId === booking.id}
                                                    className="text-[11px] font-bold text-primary flex items-center gap-1.5 hover:text-primary-dark transition-colors disabled:opacity-50 bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 rounded"
                                                >
                                                    {resendingId === booking.id ? (
                                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <Mail className="w-3.5 h-3.5" />
                                                    )}
                                                    RESEND MAIL
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {bookings.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-16 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                                    <Users className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <p className="text-gray-900 font-bold text-lg">No appointments yet</p>
                                                    <p className="text-gray-500 text-sm mt-1">When patients schedule a consultation, they will appear here.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="p-5 border-t border-gray-100/80 bg-gray-50/30 flex items-center justify-between">
                            <div className="text-sm text-gray-500 font-medium">
                                Showing <span className="text-gray-900">{indexOfFirstBooking + 1}</span> to{" "}
                                <span className="text-gray-900">
                                    {Math.min(indexOfLastBooking, bookings.length)}
                                </span>{" "}
                                of <span className="text-gray-900">{bookings.length}</span> appointments
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${currentPage === number
                                                ? "bg-primary text-white border border-primary shadow-sm shadow-primary/20"
                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
