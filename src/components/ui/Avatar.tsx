interface AvatarProps {
  color: string;
  username: string;
}

export default function Avatar({ color, username }: AvatarProps) {
  const initial = username.replace("@", "")[0].toUpperCase();
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center size-[50px] font-manrope font-medium text-[18px] text-brand-light"
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  );
}
