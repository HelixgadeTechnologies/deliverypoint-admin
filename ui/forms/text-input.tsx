
type TextInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
  name: string;
}

export default function TextInput({
  value,
  onChange,
  placeholder = "Enter text",
  label,
  name,
}: TextInputProps) {
  return (
    <div className="space-y-1.5">
        {label && <label htmlFor={name} className="text-sm block text-[#1F1F1F]">{label}</label>}
        <input
        type="text"
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-[#C9D1DA] rounded-lg py-1 px-3 h-11 outline-none placeholder:text-[#C9D1DA] font-normal text-sm leading-6 focus:border-[#0095DA] focus:ring-1 focus:ring-[#0095DA] focus:outline-none transition duration-200"
        />
    </div>
  );

}
