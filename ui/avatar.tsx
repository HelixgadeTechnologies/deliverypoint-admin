
import Image from "next/image";
import Link from "next/link";

type AvatarProps = {
  src?: string;
  name?: string;
  href?: string;
};

function getInitials(fullName?: string) {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/); // split on spaces
  const first = parts[0]?.charAt(0).toUpperCase() || "";
  const second = parts[1]?.charAt(0).toUpperCase() || "";

  return first + second;
}


export default function Avatar({ src, name, href = "" }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <Link href={href}>
      {src ? (
        <div className="size-[30px] md:size-10 rounded-[16px] overflow-hidden">
          <Image
            src={src}
            alt="Profile picture"
            width={40}
            height={40}
            className="w-full h-full object-cover rounded-[16px]"
          />
        </div>
      ) : (
        <div
          className={`size-[30px] md:size-10 rounded-[16px] flex justify-center items-center text-xs md:text-sm font-semibold text-white bg-[#0095DA]`}
        >
          <span>{initials}</span>
        </div>
      )}
    </Link>
  );
}