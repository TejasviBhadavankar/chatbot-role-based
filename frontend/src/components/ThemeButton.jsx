import { Palette } from "lucide-react";
import { useThemeStore } from "../store/UseThemeStore.jsx";

const themes = [
  "light","dark","cupcake","bumblebee","emerald","corporate","synthwave",
  "retro","cyberpunk","valentine","halloween","garden","forest","aqua",
  "lofi","pastel","fantasy","wireframe","black","luxury","dracula","cmyk",
  "autumn","business","acid","lemonade","night","coffee","winter","dim",
  "nord","sunset",
];

export default function ThemeButton() {
  const { theme, setTheme } = useThemeStore();
  const userId = localStorage.getItem("userId");

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-sm btn-ghost gap-2">
        <Palette size={16} /> Theme
      </label>

      <ul className="dropdown-content z-50 menu p-2 bg-base-200 rounded-box w-48 shadow-xl">
        {themes.map((t) => (
          <li key={t}>
            <button
              onClick={() => setTheme(t, userId)}
              className={`capitalize font-medium
                text-base-content opacity-100
                hover:bg-primary hover:text-primary-content
                ${theme === t ? "bg-primary text-primary-content" : ""}`}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
