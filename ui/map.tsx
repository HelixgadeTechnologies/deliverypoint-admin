"use client";

import { Icon } from "@iconify/react";

type Location = {
  label: string;
  description?: string;
  x: number; // percentage (0–100) for horizontal placement
  y: number; // percentage (0–100) for vertical placement
};

type MapViewProps = {
  currentLocation: Location;
  destination: Location;
  showPath?: boolean;
};

export default function MapView({
  currentLocation,
  destination,
  showPath = true,
}: MapViewProps) {
  return (
    <div className="relative w-full h-56 rounded-xl overflow-hidden bg-blue-100">
      {/* grid lines */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-3">
        <div className="border-r border-b border-gray-400"></div>
        <div className="border-r border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-r border-b border-gray-400"></div>
        <div className="border-r border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-b border-gray-400"></div>
        <div className="border-r border-gray-400"></div>
        <div className="border-r border-gray-400"></div>
      </div>

      {/* dotted path */}
      {showPath && (
        <svg className="absolute inset-0 w-full h-full">
          <path
            d={`M ${currentLocation.x}%,${currentLocation.y}% Q 50,60 ${destination.x}%,${destination.y}%`}
            stroke="#0095DA"
            strokeWidth="2"
            strokeDasharray="6,6"
            fill="none"
          />
        </svg>
      )}

      {/* current location marker */}
      <div
        className="absolute flex items-center gap-2 -bottom-20 -left-10"
        style={{
          left: `${currentLocation.x}%`,
          top: `${currentLocation.y}%`,
        }}
      >
        <div className="relative">
          <div className="w-4 h-4 border-[4.5px] border-blue-600 rounded-full bg-white" />
        </div>
        {/* label card */}
        <div className="bg-white px-3 py-2 rounded-md shadow text-xs max-w-[200px]">
          <p className="font-semibold text-gray-800">{currentLocation.label}</p>
          {currentLocation.description && (
            <p className="text-gray-500">{currentLocation.description}</p>
          )}
        </div>
      </div>

      {/* destination marker */}
      <div
        className="absolute"
        style={{
          left: `${destination.x}%`,
          top: `${destination.y}%`,
        }}
      >
        <Icon icon="mdi:map-marker" className="text-red-500" width={24} height={24} />
      </div>
    </div>
  );
}
