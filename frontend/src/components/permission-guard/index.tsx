import { ReactNode } from "react";
import { User } from "@/types/user";
import { hasPermission } from "@/utils/userPermissions";
import { useAppSelector } from "@/hooks/use-app-selector";

type PermissionGuardProps = {
  keyName: string;
  action: "v" | "m" | "c" | "d" | "e";
  children: ReactNode;
};

export function PermissionGuard({ keyName, action, children }: PermissionGuardProps) {
  const user = useAppSelector((state) => state.authState.user as User);

  if (hasPermission(user, keyName, action)) {
    return <>{children}</>; // Render children if permission is granted
  }

  return null; // Hide content if permission is denied
}