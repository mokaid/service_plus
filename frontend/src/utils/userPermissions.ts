import { User } from "@/types/user";
import { decodeBase64 } from "./decodeBase64";

export function userPermissions (user: User) {
    return user.permission ? decodeBase64(user.permission) : null;
}

type props = {
    key: string;
    action: "v" | "m" | "c" | "d" | "e";
}

export function hasPermission(user: User, key: string, action: props["action"]): boolean {
    const permission = userPermissions(user);

    if (!permission) {
        return true; // Admins or users with no permissions object have full access
    }
    // Normalize permission keys to lowercase for case-insensitive matching
    const normalizedPermissions = Object.keys(permission).reduce((acc, curr) => {
        acc[curr.toLowerCase()] = permission[curr];
        return acc;
    }, {} as Record<string, any>);

    // Convert the input key to lowercase
    const lowerKey = key.toLowerCase();

    // Check if the resource key exists
    if (!normalizedPermissions[lowerKey]) {
        return false; // No permissions defined for the resource
    }

    // Check if the specific action is allowed
    const resourcePermissions = normalizedPermissions[lowerKey];
    return resourcePermissions[action] === 1; // Allowed if the action value is 1
}