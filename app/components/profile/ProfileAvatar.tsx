interface ProfileAvatarProps {
  name?: string;
}

export function ProfileAvatar({ name }: ProfileAvatarProps) {
  return (
    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#635EF2] text-white">
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  );
}
