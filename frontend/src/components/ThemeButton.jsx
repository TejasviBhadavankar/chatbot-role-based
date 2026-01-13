import { Palette } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore.jsx";

const themes = [
 "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
];

const ThemeButton = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="btn btn-sm btn-ghost flex items-center gap-2"
      >
        <Palette size={16} />
        Theme
      </label>

      <ul
        tabIndex={0}
        className="
          dropdown-content 
          z-100 
          menu 
          p-2 
          shadow-xl 
          bg-base-100 
          rounded-box 
          w-44
        "
      >
        {themes.map((t) => (
          <li key={t}>
            <button
              onClick={() => setTheme(t)}
              className={`
                capitalize 
                text-base-content 
                font-medium
                hover:bg-primary 
                hover:text-primary-content
                ${theme === t ? "bg-primary text-primary-content" : ""}
              `}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeButton;
