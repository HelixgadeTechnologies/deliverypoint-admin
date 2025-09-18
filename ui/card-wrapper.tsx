
'use client';

type CardProps = {
  children: React.ReactNode;
  height?: string;
  bgColor?: string;
  maxWidth?: string;
};

export default function CardComponent({ 
    children,
    height = "fit-content",
    bgColor = "white",
    maxWidth,
}: CardProps) {
  return (
    <div 
    className="w-full rounded-2xl bg-white px-3 md:px-6 py-[35px] shadow-sm" 
    style={{height: height, backgroundColor: bgColor, maxWidth: maxWidth,}}
    >
        { children }
    </div>
  );
}
