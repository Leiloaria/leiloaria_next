export const ADMIN_EMAIL = "admin@admin.com";
export const USER__PATH = "/client/leiloes";
export const ADMIN_PATH = "/admin/users";

type RoleValue = string | null | undefined;

export const isAdminByScope = (scope?: string | null): boolean => {
  if (!scope) return false;
  return scope.includes("ROLE_ADMIN");
};

export const getPostAuthRedirectPath = ({
  email,
  scope,
}: {
  email?: string | null;
  scope?: RoleValue;
}): string => {
  if (isAdminByScope(scope)) {
    return ADMIN_PATH;
  }
  return USER__PATH;
};
