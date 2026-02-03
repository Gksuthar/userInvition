export const FEATURES = {
  ADMIN: 'admin',
  USER: 'user',
  SUBSCRIPTION: 'subscription',
};

// export const ACCESS_TYPES = {
//   READ: true,
//   CREATE: true,
//   UPDATE: true,
//   DELETE: true,
// };

export const ACCESS_TYPES = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  SUPER_ADMIN: 'super_Admin',
};
