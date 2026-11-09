import { DefaultTheme } from "@react-navigation/native";

export const colors = {
  background: "#F7F6FF",
  card: "#FFFFFF",
  primary: "#6B59DF",
  text: "#29263D",
  muted: "#6B687A",
  border: "#E7E4F3",
  danger: "#B42318",
};

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};
