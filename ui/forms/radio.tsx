"use client";

type RadioProps = {
  value: string;
  name: string;
  is_checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

export default function RadioInput({ value, name, is_checked, onChange, label }: RadioProps) {
  return (
    <label key={value} className="flex items-center gap-1 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={is_checked}
        onChange={onChange}
        className="h-4 w-4 accent-blue-600 border-gray-300 focus:ring-red-500 cursor-pointer"
      />
      <div className="text-sm font-medium text-[#8c98ad] capitalize">
        {label}
      </div>
    </label>
  );
}