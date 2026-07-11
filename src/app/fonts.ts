import { Patua_One, Playfair_Display } from "next/font/google";

export const patuaOne = Patua_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patua-one",
  display: "swap",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});
