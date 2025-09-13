import { Icon } from "@iconify/react";

type HeadingProps = {
    heading: string;
    subtitle?: string;
    spacing?: string;
    className?: string;
    icon?: string;
    iconColor?: string;
    sm?: boolean;
}

export default function Heading({ 
    heading, 
    subtitle,
    spacing = "1",
    className,
    icon,
    iconColor,
    sm,
 }: HeadingProps) {
    return (
        <div className={`md:leading-6 h-[60px] space-y-1 md:space-y-${spacing} ${className}`}>
            <div className="flex gap-2 items-center">
                {icon && <Icon icon={icon} height={20} width={20} color={iconColor} />}
                <h2 className={`${sm ? 'text-xl' : 'text-2xl'} font-bold text-[#1F1F1F]`}>{heading}</h2>
            </div>
            {subtitle && <p className={`${sm ? 'text-xs md:text-sm' : 'text-sm md:text-base'} font-normal text-[#7C7979]`}>{subtitle}</p>}
          </div>
    )
}
