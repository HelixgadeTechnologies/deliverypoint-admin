
'use client';

type CardProps = {
  children: React.ReactNode;
  height?: string;
};

export default function CardComponent({ 
    children,
    height = "fit-content"
}: CardProps) {
  return (
    <div 
    className="w-full rounded-2xl bg-white px-3 md:px-6 py-[35px] shadow-md" 
    style={{height: height}}
    >
        { children }
    </div>
  );
}
