/**
 * Role-based access control utilities
 * Determines user permissions based on usrType
 */

/**
 * Admin role IDs (adjust these based on your usertypes table)
 * Update these with the actual typID values for Admin and LMS roles
 */
const ADMIN_ROLES = [1, 2]; // Example: 1 = Admin, 2 = LMS Admin (update with your actual IDs)

/**
 * Check if user has admin access to view all DTR records
 */
export const isAdminUser = (usrType) => {
  return (
    usrType !== null && usrType !== undefined && ADMIN_ROLES.includes(usrType)
  );
};

/**
 * Check if user is a student
 */
export const isStudentUser = (usrType) => {
  // Adjust this ID based on your usertypes table (e.g., 3 = Student)
  return usrType === 4;
};

/**
 * Get user role display name
 */
export const getRoleDisplayName = (usrType) => {
  const roleMap = {
    1: "Infinit Administrator (only for infinit staff)",
    2: "LMS Administrator",
    3: "Faculty",
    4: "Student",
    5: "Non-Teaching User",
    6: "Program Head",
    7: "SA",
  };
  return roleMap[usrType || 0] || "Unknown";
};
