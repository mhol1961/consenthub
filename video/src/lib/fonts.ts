import { loadFont as loadDMSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily: serifFamily } = loadDMSerif();
const { fontFamily: sansFamily } = loadJakarta("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const FONTS = {
  serif: serifFamily,
  sans: sansFamily,
} as const;
