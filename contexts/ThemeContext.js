import { useAuth } from "@/contexts/AuthContexts";
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Default theme colors (your current orange theme)
const DEFAULT_THEME = {
  primary: "#F97316",
  header: "#F97316",
  buttonHover: "#F97316",
  buttonText: "#FFFFFF",
  cardHeader: "#F97316",
  content: "#FFFFFF",
  contentText: "#374151",
  footer: "#1e1f20ff",
};

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolTheme = async () => {
      if (user?.accID) {
        try {
          // TEMPORARY: Use default theme until API method is added
          // TODO: Implement ApiService.getSchoolAccount() method

          // For now, check if user object already has school theme data
          if (user.schoolTheme) {
            const schoolData = user.schoolTheme;

            // Map database color fields to theme object
            // The database stores colors as integers, convert to hex
            const schoolTheme = {
              primary: schoolData.thm_header
                ? `#${schoolData.thm_header.toString(16).padStart(6, "0")}`
                : DEFAULT_THEME.primary,
              header: schoolData.thm_header
                ? `#${schoolData.thm_header.toString(16).padStart(6, "0")}`
                : DEFAULT_THEME.header,
              buttonHover: schoolData.thm_button_hover
                ? `#${schoolData.thm_button_hover
                    .toString(16)
                    .padStart(6, "0")}`
                : DEFAULT_THEME.buttonHover,
              buttonText: schoolData.thm_button_text
                ? `#${schoolData.thm_button_text.toString(16).padStart(6, "0")}`
                : DEFAULT_THEME.buttonText,
              cardHeader: schoolData.thm_card_header
                ? `#${schoolData.thm_card_header.toString(16).padStart(6, "0")}`
                : DEFAULT_THEME.cardHeader,
              content: schoolData.thm_content
                ? `#${schoolData.thm_content.toString(16).padStart(6, "0")}`
                : DEFAULT_THEME.content,
              contentText: schoolData.thm_content_text
                ? `#${schoolData.thm_content_text
                    .toString(16)
                    .padStart(6, "0")}`
                : DEFAULT_THEME.contentText,
              footer: schoolData.thm_footer
                ? `#${schoolData.thm_footer.toString(16).padStart(6, "0")}`
                : DEFAULT_THEME.footer,
            };

            setTheme(schoolTheme);
          } else {
            // User data doesn't include school theme, use default
            console.log(
              "[ThemeContext] No school theme data found, using default"
            );
            setTheme(DEFAULT_THEME);
          }
        } catch (err) {
          console.error("Failed to load school theme:", err);
          setTheme(DEFAULT_THEME);
        }
      } else {
        // No user logged in, use default theme
        setTheme(DEFAULT_THEME);
      }
      setLoading(false);
    };

    fetchSchoolTheme();
  }, [user?.accID]);

  return (
    <ThemeContext.Provider value={{ theme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};
