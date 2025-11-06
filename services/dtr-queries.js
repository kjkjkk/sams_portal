// import { config, database } from "@/services/appwrite";
// import { Query } from "appwrite";

// export const fetchUserDetailsByEmail = async (email) => {
//   try {
//     console.log("[fetchUserDetails] Searching for email:", email);

//     const response = await database.listDocuments(
//       config.databaseId,
//       config.collections.users2,
//       [Query.equal("email", email.trim().toLowerCase())]
//     );

//     console.log(
//       "[fetchUserDetails] Documents found:",
//       response.documents.length
//     );

//     if (response.documents.length === 0) {
//       console.error("[fetchUserDetails] No user found");
//       return null;
//     }

//     const userDoc = response.documents[0];
//     console.log("[fetchUserDetails] User doc std_id:", userDoc.std_id);

//     const fullName =
//       userDoc.usrFirstName && userDoc.usrLastName
//         ? `${userDoc.usrFirstName} ${userDoc.usrLastName}`.trim()
//         : userDoc.email;

//     // IMPORTANT: Return std_id (from database) which will be mapped to stdId
//     return {
//       std_id: userDoc.std_id,
//       usrFirstName: userDoc.usrFirstName || "",
//       usrLastName: userDoc.usrLastName || "",
//       accID: userDoc.accID || 0,
//       schoolId: userDoc.schoolid || 0,
//       email: userDoc.email,
//       fullName: fullName,
//     };
//   } catch (error) {
//     console.error("[fetchUserDetails] Error:", error);
//     throw error;
//   }
// };
