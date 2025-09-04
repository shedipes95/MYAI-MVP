import React, { useState } from "react";
import { Smartphone, Monitor } from "lucide-react";

interface PresentationToggleProps {
  onToggle: (enabled: boolean) => void;
}

export function PresentationToggle({ onToggle }: PresentationToggleProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onToggle(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-lg ${
        isEnabled
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
      }`}
      title={`Switch to ${isEnabled ? "desktop" : "mobile"} view`}
    >
      {isEnabled ? <Smartphone size={16} /> : <Monitor size={16} />}
      <span className="text-sm font-medium">{isEnabled ? "Mobile" : "Desktop"}</span>
    </button>
  );
}
