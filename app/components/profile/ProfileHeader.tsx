interface ProfileHeaderProps {
  name?: string;
}

export function ProfileHeader({ name }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
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
      <div>
        <h1 className="text-2xl font-bold text-[#414059]">Perfil</h1>
        <p className="text-[#9B9BA2] text-sm">
          Gerencie suas informações pessoais
        </p>
      </div>
    </div>
  );
}
