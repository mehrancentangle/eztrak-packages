export interface PermissionRecord {
  moduleName: string;
  permission: string;
  permissionId: string | number;
}

export type TransformedPermissions = Record<
  string,
  Record<string, string | number>
>;

export function transformPermissions(
  permissions: PermissionRecord[]
): TransformedPermissions {
  return permissions.reduce<TransformedPermissions>((acc, permission) => {
    const { moduleName, permission: perm, permissionId } = permission;

    if (!acc[moduleName]) {
      acc[moduleName] = {};
    }

    acc[moduleName][perm] = permissionId;

    return acc;
  }, {});
}
