const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'manageProducts', 'getProducts', 'manageOrders', 'getOrders', 'manageCarts', 'getCarts'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
