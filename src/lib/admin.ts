// Admin configuration
// Add admin email addresses here to grant admin access
export const ADMIN_EMAILS = [
  "admin@pxltravel.com",
  // Add more admin emails here
];

/**
 * Check if the current user is an admin
 * @param userEmail - The email of the current user
 * @returns true if the user is an admin, false otherwise
 */
export const isAdmin = (userEmail: string | undefined | null): boolean => {
  if (!userEmail) return false;
  return ADMIN_EMAILS.includes(userEmail.toLowerCase());
};

