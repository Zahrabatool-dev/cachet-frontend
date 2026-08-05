type AvatarDisplayProps = {
  avatar?: string | null; // dicebear ka poora URL store hota hai
  name?: string | null;
  size?: number;
  className?: string;
};

export function AvatarDisplay({ avatar, name, size = 32, className = "" }: AvatarDisplayProps) {
  const initials = name?.trim()?.[0]?.toUpperCase() || "?";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name || "avatar"}
        className={`rounded-full shrink-0 object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 bg-[rgb(var(--color-accent))]/15 text-[rgb(var(--color-accent))] font-medium ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}