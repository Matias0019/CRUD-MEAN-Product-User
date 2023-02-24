const allRoles = {
  user: ['manageProducts', 'getProducts'],
  admin: ['getUsers', 'manageUsers', 'manageProducts', 'getProducts', 'manageOrders', 'getOrders'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
