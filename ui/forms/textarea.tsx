type TextareaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  name: string;
  placeholder?: string;
};

export default function TextareaInput({
  value,
  onChange,
  label,
  name,
  placeholder,
}: TextareaProps) {
  return (
    <div className="space-y-2 relative">
      <label className="text-sm capitalize text-[#1F1F1F] block">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        rows={4}
        className="w-full border border-[#C9D1DA] rounded-lg py-1 px-3 h-[100px] outline-none placeholder:text-[#C9D1DA] font-normal text-sm leading-6 focus:border-[#0095DA] focus:ring-1 focus:ring-[#0095DA] focus:outline-none resize-none"
      />
    </div>
  );
}