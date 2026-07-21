import { type UserRole, hasRole, isAdmin } from './plans';

export interface PermissionContext {
  role: UserRole;
  plan: string;
}

export const FEATURES = {
  CHAT: 'chat',
  EDITOR: 'editor',
  TERMINAL: 'terminal',
  FILE_UPLOAD: 'file_upload',
  ADVANCED_MODELS: 'advanced_models',
  API_ACCESS: 'api_access',
  TEAM_WORKSPACE: 'team_workspace',
  ADMIN_PANEL: 'admin_panel',
  SSO: 'sso',
  ANALYTICS: 'analytics',
} as const;

export type Feature = typeof FEATURES[keyof typeof FEATURES];

const FEATURE_ROLE_REQUIREMENTS: Record<Feature, UserRole> = {
  [FEATURES.CHAT]: 'user',
  [FEATURES.EDITOR]: 'user',
  [FEATURES.TERMINAL]: 'user',
  [FEATURES.FILE_UPLOAD]: 'user',
  [FEATURES.ADVANCED_MODELS]: 'pro',
  [FEATURES.API_ACCESS]: 'pro',
  [FEATURES.TEAM_WORKSPACE]: 'team',
  [FEATURES.ADMIN_PANEL]: 'admin',
  [FEATURES.SSO]: 'team',
  [FEATURES.ANALYTICS]: 'pro',
};

/** Check if a user has access to a feature */
export function canAccess(role: UserRole, feature: Feature): boolean {
  if (isAdmin(role)) return true;  // admin override
  const required = FEATURE_ROLE_REQUIREMENTS[feature];
  return hasRole(role, required);
}

/** Check multiple features at once */
export function canAccessAll(role: UserRole, features: Feature[]): boolean {
  return features.every((f) => canAccess(role, f));
}

/** Get all features available for a role */
export function getAvailableFeatures(role: UserRole): Feature[] {
  return Object.values(FEATURES).filter((f) => canAccess(role, f));
}

/** Guard function — throws if access denied */
export function requireAccess(role: UserRole, feature: Feature): void {
  if (!canAccess(role, feature)) {
    throw new Error(`Access denied: ${feature} requires higher tier`);
  }
}
