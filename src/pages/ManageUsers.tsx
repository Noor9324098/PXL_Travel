import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail, RefreshCw, Shield, UserCircle2, Users } from "lucide-react";

interface ManagedUser {
	_id: string;
	full_name?: string;
	email: string;
	is_admin?: boolean;
	is_super_admin?: boolean;
	created_at?: string;
}

const ManageUsers = () => {
	const navigate = useNavigate();
	const [users, setUsers] = useState<ManagedUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchUsers = async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			toast.error("Please sign in to view users");
			navigate("/auth");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${API_BASE_URL}/api/users`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to fetch users");
			}

			setUsers(Array.isArray(data) ? data : []);
		} catch (error: any) {
			toast.error(error.message || "Unable to load users");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const filteredUsers = useMemo(() => {
		const needle = searchTerm.trim().toLowerCase();
		if (!needle) return users;

		return users.filter((user) => {
			const fullName = (user.full_name || "").toLowerCase();
			const email = (user.email || "").toLowerCase();
			return fullName.includes(needle) || email.includes(needle);
		});
	}, [searchTerm, users]);

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
					<div className="container mx-auto px-6 max-w-6xl">
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
									<Users className="w-6 h-6 text-primary-foreground" />
								</div>
								<div>
									<h1 className="font-display text-4xl font-bold">Users Management</h1>
									<p className="text-muted-foreground text-lg">
										List of registered users with names and email addresses
									</p>
								</div>
							</div>
						</div>

						<Card className="border-2 border-primary/20 shadow-large">
							<CardHeader className="space-y-4">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<div>
										<CardTitle className="font-display text-2xl">All Users</CardTitle>
										<CardDescription>
											{users.length} registered {users.length === 1 ? "user" : "users"}
										</CardDescription>
									</div>
									<Button
										type="button"
										variant="outline"
										onClick={fetchUsers}
										disabled={loading}
									>
										<RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
										Refresh
									</Button>
								</div>

								<Input
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									placeholder="Search by name or email"
								/>
							</CardHeader>

							<CardContent>
								{loading ? (
									<div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
										<Loader2 className="w-6 h-6 animate-spin text-primary" />
										<p>Loading users...</p>
									</div>
								) : filteredUsers.length === 0 ? (
									<div className="py-16 text-center">
										<Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
										<h3 className="font-display text-xl font-semibold mb-1">No users found</h3>
										<p className="text-muted-foreground">
											Try a different search term or refresh the list.
										</p>
									</div>
								) : (
									<div className="space-y-3">
										{filteredUsers.map((user, index) => (
											<div
												key={user._id}
												className="rounded-lg border border-primary/20 bg-card/80 p-4 hover:border-primary/40 transition-colors animate-slide-up"
												style={{ animationDelay: `${index * 0.05}s` }}
											>
												<div className="flex flex-wrap items-start justify-between gap-3">
													<div className="flex items-start gap-3 min-w-0">
														<div className="w-10 h-10 rounded-md bg-[#DB7B21]/20 flex items-center justify-center shrink-0">
															<UserCircle2 className="w-5 h-5 text-primary" />
														</div>
														<div className="min-w-0">
															<p className="font-semibold truncate">
																{user.full_name?.trim() || "No name provided"}
															</p>
															<p className="text-sm text-muted-foreground flex items-center gap-2 truncate">
																<Mail className="w-4 h-4 shrink-0" />
																<span className="truncate">{user.email}</span>
															</p>
															{user.created_at && (
																<p className="text-xs text-muted-foreground mt-1">
																	Joined {new Date(user.created_at).toLocaleDateString()}
																</p>
															)}
														</div>
													</div>

													<div className="flex items-center gap-2">
														{user.is_super_admin ? (
															<Badge className="bg-secondary text-secondary-foreground">
																<Shield className="w-3 h-3 mr-1" />
																Super Admin
															</Badge>
														) : user.is_admin ? (
															<Badge className="bg-primary/15 text-primary border border-primary/20">
																Admin
															</Badge>
														) : (
															<Badge variant="secondary">User</Badge>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</main>
			</div>
		</ProtectedRoute>
	);
};

export default ManageUsers;

