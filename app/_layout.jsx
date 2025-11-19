// ============================================
// Option 1: Wrap your ENTIRE app in AuthProvider
// File: app/_layout.js (or app/_layout.tsx)
// ============================================
import { AuthProvider } from "@/contexts/AuthContexts";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none",
          }}
        >
          <Stack.Screen name="index" /> {/* Login screen */}
          <Stack.Screen name="home" />
          <Stack.Screen name="(tabs)" />
          {/* Add all your other screens */}
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}

// // ============================================
// // Option 2: If you have nested layouts
// // File: app/(auth)/_layout.js - for login/auth screens
// // ============================================

// export default function AuthLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//         animation: "none",
//       }}
//     >
//       <Stack.Screen name="login" />
//     </Stack>
//   );
// }

// // ============================================
// // Then in your main app/_layout.js
// // ============================================

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <Stack
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <Stack.Screen name="(auth)" />
//         <Stack.Screen name="(tabs)" />
//         <Stack.Screen name="home" />
//       </Stack>
//     </AuthProvider>
//   );
// }
