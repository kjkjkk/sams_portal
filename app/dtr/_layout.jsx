import { Stack } from "expo-router";

export default function DTRLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
