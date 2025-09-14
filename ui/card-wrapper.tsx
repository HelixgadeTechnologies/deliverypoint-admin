
'use client';

type CardProps = {
  children: React.ReactNode;
  height?: string;
  bgColor?: string;
};

export default function CardComponent({ 
    children,
    height = "fit-content",
    bgColor = "white"
}: CardProps) {
  return (
    <div 
    className="w-full rounded-2xl bg-white px-3 md:px-6 py-[35px] shadow-sm" 
    style={{height: height, backgroundColor: bgColor}}
    >
        { children }
    </div>
  );
}
