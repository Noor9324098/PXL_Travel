import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import {
	ArrowLeft,
	Calendar,
	CheckCircle2,
	ClipboardList,
	CreditCard,
	Loader2,
	Pencil,
	Phone,
	Plane,
	Plus,
	RefreshCw,
	Trash2,
	UserRound,
} from "lucide-react";

type BookingStatus = "pending" | "booked" | "cancelled";

interface UserOption {
	_id: string;
	full_name?: string;
	email: string;
}

interface BookingRecord {
	_id: string;
	user_id: UserOption | string;
	flight_origin: string;
	flight_destination: string;
	flight_date: string;
	passenger_first_name: string;
	passenger_last_name: string;
	phone_number: string;
	transaction_number: string;
	status: BookingStatus | string;
	created_at: string;
}

interface BookingFormData {
	user_id: string;
	flight_origin: string;
	flight_destination: string;
	flight_date: string;
	passenger_first_name: string;
	passenger_last_name: string;
	phone_number: string;
	transaction_number: string;
	status: BookingStatus;
}

const emptyFormData: BookingFormData = {
	user_id: "",
	flight_origin: "",
	flight_destination: "",
	flight_date: "",
	passenger_first_name: "",
	passenger_last_name: "",
	phone_number: "",
	transaction_number: "",
	status: "pending",
};

const AdminBookings = () => {
	const navigate = useNavigate();
	const [users, setUsers] = useState<UserOption[]>([]);
	const [bookings, setBookings] = useState<BookingRecord[]>([]);
	const [formData, setFormData] = useState<BookingFormData>(emptyFormData);
	const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const getTokenOrFail = () => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("Please sign in to access admin booking management");
			navigate("/auth");
			return null;
		}
		return token;
	};

	const parseErrorMessage = async (response: Response, fallback: string) => {
		try {
			const data = await response.json();
			return data?.error || fallback;
		} catch {
			return fallback;
		}
	};

	const fetchData = async (showRefreshing = false) => {
		const token = getTokenOrFail();
		if (!token) return;

		if (showRefreshing) {
			setRefreshing(true);
		} else {
			setLoading(true);
		}

		try {
			const [usersResponse, bookingsResponse] = await Promise.all([
				fetch(`${API_BASE_URL}/api/users`, {
					headers: { Authorization: `Bearer ${token}` },
				}),
				fetch(`${API_BASE_URL}/api/admin/bookings`, {
					headers: { Authorization: `Bearer ${token}` },
				}),
			]);

			if (!usersResponse.ok) {
				throw new Error(
					await parseErrorMessage(usersResponse, "Failed to load users"),
				);
			}

			if (!bookingsResponse.ok) {
				throw new Error(
					await parseErrorMessage(bookingsResponse, "Failed to load bookings"),
				);
			}

			const usersData = await usersResponse.json();
			const bookingsData = await bookingsResponse.json();

			setUsers(Array.isArray(usersData) ? usersData : []);
			setBookings(Array.isArray(bookingsData) ? bookingsData : []);
		} catch (error: any) {
			toast.error(error.message || "Unable to load admin bookings data");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const bookingsSummary = useMemo(
		() => ({
			pending: bookings.filter((booking) => booking.status === "pending").length,
			booked: bookings.filter((booking) => booking.status === "booked").length,
			cancelled: bookings.filter((booking) => booking.status === "cancelled").length,
		}),
		[bookings],
	);

	const resetForm = () => {
		setFormData(emptyFormData);
		setEditingBookingId(null);
	};

	const toDateInputValue = (dateValue: string) => {
		const parsed = new Date(dateValue);
		if (Number.isNaN(parsed.getTime())) return "";
		return parsed.toISOString().split("T")[0];
	};

	const getUserId = (userRef: BookingRecord["user_id"]) => {
		if (!userRef) return "";
		return typeof userRef === "string" ? userRef : userRef._id;
	};

	const getUserName = (userRef: BookingRecord["user_id"]) => {
		if (!userRef) return "Unknown user";
		if (typeof userRef === "string") return "Unknown user";
		return userRef.full_name?.trim() || "No name provided";
	};

	const getUserEmail = (userRef: BookingRecord["user_id"]) => {
		if (!userRef || typeof userRef === "string") return "No email";
		return userRef.email || "No email";
	};

	const getStatusBadgeClass = (status: string) => {
		switch (status) {
			case "booked":
				return "bg-green-500/10 text-green-700 border border-green-500/20 dark:text-green-300";
			case "cancelled":
				return "bg-red-500/10 text-red-700 border border-red-500/20 dark:text-red-300";
			default:
				return "bg-yellow-500/10 text-yellow-700 border border-yellow-500/20 dark:text-yellow-300";
		}
	};

	const validateForm = () => {
		if (
			!formData.user_id ||
			!formData.flight_origin ||
			!formData.flight_destination ||
			!formData.flight_date ||
			!formData.passenger_first_name ||
			!formData.passenger_last_name ||
			!formData.phone_number ||
			!formData.transaction_number
		) {
			toast.error("Please fill in all booking fields");
			return false;
		}

		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		const token = getTokenOrFail();
		if (!token) return;

		setSaving(true);

		try {
			const payload = {
				...formData,
				flight_date: formData.flight_date,
			};

			const isEditing = Boolean(editingBookingId);
			const endpoint = isEditing
				? `${API_BASE_URL}/api/admin/bookings/${editingBookingId}`
				: `${API_BASE_URL}/api/admin/bookings`;

			const response = await fetch(endpoint, {
				method: isEditing ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error(await parseErrorMessage(response, "Failed to save booking"));
			}

			toast.success(isEditing ? "Booking updated" : "Booking created");
			resetForm();
			await fetchData(true);
		} catch (error: any) {
			toast.error(error.message || "Unable to save booking");
		} finally {
			setSaving(false);
		}
	};

	const handleEdit = (booking: BookingRecord) => {
		setEditingBookingId(booking._id);
		setFormData({
			user_id: getUserId(booking.user_id),
			flight_origin: booking.flight_origin,
			flight_destination: booking.flight_destination,
			flight_date: toDateInputValue(booking.flight_date),
			passenger_first_name: booking.passenger_first_name,
			passenger_last_name: booking.passenger_last_name,
			phone_number: booking.phone_number,
			transaction_number: booking.transaction_number,
			status: (booking.status as BookingStatus) || "pending",
		});

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleDelete = async (bookingId: string) => {
		const shouldDelete = window.confirm("Delete this booking permanently?");
		if (!shouldDelete) return;

		const token = getTokenOrFail();
		if (!token) return;

		try {
			const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${bookingId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(await parseErrorMessage(response, "Failed to delete booking"));
			}

			setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
			if (editingBookingId === bookingId) {
				resetForm();
			}
			toast.success("Booking deleted");
		} catch (error: any) {
			toast.error(error.message || "Unable to delete booking");
		}
	};

	const handleMarkBooked = async (bookingId: string) => {
		const token = getTokenOrFail();
		if (!token) return;

		try {
			const response = await fetch(
				`${API_BASE_URL}/api/admin/bookings/${bookingId}/status`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ status: "booked" }),
				},
			);

			if (!response.ok) {
				throw new Error(await parseErrorMessage(response, "Failed to update status"));
			}

			setBookings((prev) =>
				prev.map((booking) =>
					booking._id === bookingId ? { ...booking, status: "booked" } : booking,
				),
			);
			toast.success("Booking marked as booked");
		} catch (error: any) {
			toast.error(error.message || "Unable to update booking status");
		}
	};

	return (
		<ProtectedRoute>
			<div
				className="min-h-screen"
				style={{
					backgroundColor: "rgba(219, 123, 33, 0.1)",
				}}
			>
				<Header />

				<main className="pt-24 pb-12">
					<div className="container mx-auto px-6 max-w-7xl">
						<div className="mb-8 animate-fade-in">
							<Button
								variant="ghost"
								onClick={() => navigate("/admin")}
								className="mb-4"
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Dashboard
							</Button>

							<div className="flex items-center gap-3 mb-2">
								<div className="w-12 h-12 bg-[#DB7B21] rounded-lg flex items-center justify-center shadow-medium">
									<ClipboardList className="w-6 h-6 text-primary-foreground" />
								</div>
								<div>
									<h1 className="font-display text-4xl font-bold">Admin Bookings</h1>
									<p className="text-muted-foreground text-lg">
										Add, edit, delete, and confirm customer bookings
									</p>
								</div>
							</div>

							<div className="flex flex-wrap gap-3 mt-4">
								<Badge className="bg-yellow-500/10 text-yellow-700 border border-yellow-500/20 dark:text-yellow-300">
									Pending: {bookingsSummary.pending}
								</Badge>
								<Badge className="bg-green-500/10 text-green-700 border border-green-500/20 dark:text-green-300">
									Booked: {bookingsSummary.booked}
								</Badge>
								<Badge className="bg-red-500/10 text-red-700 border border-red-500/20 dark:text-red-300">
									Cancelled: {bookingsSummary.cancelled}
								</Badge>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<Card className="lg:col-span-1 border-2 border-primary/20 shadow-large h-fit">
								<CardHeader>
									<CardTitle className="font-display text-2xl">
										{editingBookingId ? "Edit Booking" : "Add Booking"}
									</CardTitle>
									<CardDescription>
										{editingBookingId
											? "Modify booking details and save changes"
											: "Create a booking on behalf of a customer"}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form onSubmit={handleSubmit} className="space-y-4">
										<div className="space-y-2">
											<Label>User</Label>
											<Select
												value={formData.user_id}
												onValueChange={(value) =>
													setFormData((prev) => ({ ...prev, user_id: value }))
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select user" />
												</SelectTrigger>
												<SelectContent>
													{users.map((user) => (
														<SelectItem key={user._id} value={user._id}>
															{(user.full_name?.trim() || "No name")} - {user.email}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className="grid grid-cols-2 gap-3">
											<div className="space-y-2">
												<Label>Origin</Label>
												<Input
													value={formData.flight_origin}
													onChange={(e) =>
														setFormData((prev) => ({ ...prev, flight_origin: e.target.value }))
													}
													placeholder="Budapest"
												/>
											</div>
											<div className="space-y-2">
												<Label>Destination</Label>
												<Input
													value={formData.flight_destination}
													onChange={(e) =>
														setFormData((prev) => ({ ...prev, flight_destination: e.target.value }))
													}
													placeholder="Vienna"
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label>Flight Date</Label>
											<Input
												type="date"
												value={formData.flight_date}
												onChange={(e) =>
													setFormData((prev) => ({ ...prev, flight_date: e.target.value }))
												}
											/>
										</div>

										<div className="grid grid-cols-2 gap-3">
											<div className="space-y-2">
												<Label>Passenger First Name</Label>
												<Input
													value={formData.passenger_first_name}
													onChange={(e) =>
														setFormData((prev) => ({ ...prev, passenger_first_name: e.target.value }))
													}
													placeholder="John"
												/>
											</div>
											<div className="space-y-2">
												<Label>Passenger Last Name</Label>
												<Input
													value={formData.passenger_last_name}
													onChange={(e) =>
														setFormData((prev) => ({ ...prev, passenger_last_name: e.target.value }))
													}
													placeholder="Doe"
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label>Phone Number</Label>
											<Input
												value={formData.phone_number}
												onChange={(e) =>
													setFormData((prev) => ({ ...prev, phone_number: e.target.value }))
												}
												placeholder="+36 30 123 4567"
											/>
										</div>

										<div className="space-y-2">
											<Label>Transaction Number</Label>
											<Input
												value={formData.transaction_number}
												onChange={(e) =>
													setFormData((prev) => ({ ...prev, transaction_number: e.target.value }))
												}
												placeholder="TXN-123456"
											/>
										</div>

										<div className="space-y-2">
											<Label>Status</Label>
											<Select
												value={formData.status}
												onValueChange={(value: BookingStatus) =>
													setFormData((prev) => ({ ...prev, status: value }))
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select status" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="pending">Pending</SelectItem>
													<SelectItem value="booked">Booked</SelectItem>
													<SelectItem value="cancelled">Cancelled</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className="flex flex-col gap-2 pt-2">
											<Button type="submit" disabled={saving}>
												{saving ? (
													<>
														<Loader2 className="w-4 h-4 mr-2 animate-spin" />
														Saving...
													</>
												) : (
													<>
														{editingBookingId ? (
															<Pencil className="w-4 h-4 mr-2" />
														) : (
															<Plus className="w-4 h-4 mr-2" />
														)}
														{editingBookingId ? "Update Booking" : "Add Booking"}
													</>
												)}
											</Button>

											{editingBookingId && (
												<Button type="button" variant="outline" onClick={resetForm}>
													Cancel Edit
												</Button>
											)}
										</div>
									</form>
								</CardContent>
							</Card>

							<Card className="lg:col-span-2 border-2 border-primary/20 shadow-large">
								<CardHeader>
									<div className="flex flex-wrap items-center justify-between gap-3">
										<div>
											<CardTitle className="font-display text-2xl">Booking Requests</CardTitle>
											<CardDescription>
												Manage all bookings and confirm pending requests
											</CardDescription>
										</div>
										<Button
											type="button"
											variant="outline"
											onClick={() => fetchData(true)}
											disabled={refreshing}
										>
											<RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
											Refresh
										</Button>
									</div>
								</CardHeader>

								<CardContent>
									{loading ? (
										<div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
											<Loader2 className="w-6 h-6 animate-spin text-primary" />
											<p>Loading bookings...</p>
										</div>
									) : bookings.length === 0 ? (
										<div className="py-16 text-center">
											<ClipboardList className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
											<h3 className="font-display text-xl font-semibold mb-1">No bookings yet</h3>
											<p className="text-muted-foreground">Use the form to create the first booking.</p>
										</div>
									) : (
										<div className="space-y-4">
											{bookings.map((booking, index) => (
												<div
													key={booking._id}
													className="rounded-lg border border-primary/20 bg-card/80 p-4 hover:border-primary/40 transition-colors animate-slide-up"
													style={{ animationDelay: `${index * 0.05}s` }}
												>
													<div className="flex flex-wrap items-start justify-between gap-3 mb-3">
														<div className="flex items-start gap-3 min-w-0">
															<div className="w-10 h-10 rounded-md bg-[#DB7B21] flex items-center justify-center shrink-0">
																<Plane className="w-5 h-5 text-primary-foreground" />
															</div>
															<div className="min-w-0">
																<p className="font-semibold text-lg truncate">
																	{booking.flight_origin} → {booking.flight_destination}
																</p>
																<p className="text-sm text-muted-foreground truncate">
																	Passenger: {booking.passenger_first_name} {booking.passenger_last_name}
																</p>
															</div>
														</div>
														<Badge className={getStatusBadgeClass(booking.status)}>
															{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
														</Badge>
													</div>

													<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
														<div className="flex items-start gap-2 text-muted-foreground">
															<UserRound className="w-4 h-4 mt-0.5 text-primary" />
															<div>
																<p className="font-medium text-foreground">{getUserName(booking.user_id)}</p>
																<p>{getUserEmail(booking.user_id)}</p>
															</div>
														</div>

														<div className="flex items-start gap-2 text-muted-foreground">
															<Calendar className="w-4 h-4 mt-0.5 text-primary" />
															<div>
																<p className="font-medium text-foreground">Flight Date</p>
																<p>{new Date(booking.flight_date).toLocaleDateString()}</p>
															</div>
														</div>

														<div className="flex items-start gap-2 text-muted-foreground">
															<Phone className="w-4 h-4 mt-0.5 text-primary" />
															<div>
																<p className="font-medium text-foreground">Phone</p>
																<p>{booking.phone_number}</p>
															</div>
														</div>

														<div className="flex items-start gap-2 text-muted-foreground">
															<CreditCard className="w-4 h-4 mt-0.5 text-hero-end" />
															<div>
																<p className="font-medium text-foreground">Transaction</p>
																<p>{booking.transaction_number}</p>
															</div>
														</div>
													</div>

													<div className="flex flex-wrap gap-2 border-t border-primary/20 pt-3">
														<Button type="button" variant="outline" onClick={() => handleEdit(booking)}>
															<Pencil className="w-4 h-4 mr-2" />
															Edit
														</Button>

														{booking.status === "pending" && (
															<Button
																type="button"
																onClick={() => handleMarkBooked(booking._id)}
															>
																<CheckCircle2 className="w-4 h-4 mr-2" />
																Mark as Booked
															</Button>
														)}

														<Button
															type="button"
															variant="destructive"
															onClick={() => handleDelete(booking._id)}
														>
															<Trash2 className="w-4 h-4 mr-2" />
															Delete
														</Button>
													</div>
												</div>
											))}
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</main>
			</div>
		</ProtectedRoute>
	);
};

export default AdminBookings;
