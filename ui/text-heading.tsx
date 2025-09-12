
type HeadingProps = {
    heading: string;
    subtitle?: string;
    spacing?: string;
    className?: string;
}

export default function Heading({ 
    heading, 
    subtitle,
    spacing = "1",
    className,
 }: HeadingProps) {
    return (
        <div className={`md:leading-6 h-[60px] space-y-1 md:space-y-${spacing} ${className}`}>
            <h2 className="text-2xl md:text-[23px] font-bold text-[#1F1F1F]">{heading}</h2>
            <p className={`text-sm md:text-base font-normal text-[#7C7979]`}>{subtitle}</p>
          </div>
    )
}
