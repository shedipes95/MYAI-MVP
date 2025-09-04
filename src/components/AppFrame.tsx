import React from "react";

interface AppFrameProps {
  children: React.ReactNode;
}

export function AppFrame({ children }: AppFrameProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{
          width: "390px",
          height: "844px", // iPhone 14 Pro height
          maxHeight: "90vh",
        }}
      >
        {children}
      </div>
    </div>
  );
}


