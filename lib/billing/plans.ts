export type UserRole = 'guest' | 'user' | 'pro' | 'team' | 'admin';
export type PlanName = 'free' | 'pro' | 'team' | 'enterprise';
export type BillingInterval = 'monthly' | 'yearly';

export interface Plan {
  id: PlanName;
  name: string;
  role: UserRole;
  monthlyPriceId?: string;
  yearlyPriceId?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: PlanLimits;
}

export interface PlanLimits {
  aiMessagesPerMonth: number | 'unlimited';
  fileUploadsPerMonth: number | 'unlimited';
  storageGB: number;
  codeExecutionsPerMonth: number | 'unlimited';
  apiRequestsPerMonth: number | 'unlimited';
  maxFileSizeMB: number;
  seats: number;
}

export const PLANS: Record<PlanName, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    role: 'user',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '50 AI messages/month',
      '5 file uploads',
      '10 code executions',
      '500 MB storage',
      'Monaco editor',
      'Community support',
    ],
    limits: {
      aiMessagesPerMonth: 50,
      fileUploadsPerMonth: 5,
      storageGB: 0.5,
      codeExecutionsPerMonth: 10,
      apiRequestsPerMonth: 100,
      maxFileSizeMB: 10,
      seats: 1,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    role: 'pro',
    monthlyPriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    monthlyPrice: 2900,  // cents
    yearlyPrice: 29000,  // cents
    features: [
      'Unlimited AI messages',
      '500 file uploads/month',
      'Unlimited code executions',
      '50 GB storage',
      'All AI models',
      'API access',
      'Priority support',
    ],
    limits: {
      aiMessagesPerMonth: 'unlimited',
      fileUploadsPerMonth: 500,
      storageGB: 50,
      codeExecutionsPerMonth: 'unlimited',
      apiRequestsPerMonth: 'unlimited',
      maxFileSizeMB: 100,
      seats: 1,
    },
  },
  team: {
    id: 'team',
    name: 'Team',
    role: 'team',
    monthlyPriceId: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.STRIPE_TEAM_YEARLY_PRICE_ID,
    monthlyPrice: 7900,
    yearlyPrice: 79000,
    features: [
      'Everything in Pro',
      'Up to 10 seats',
      'Shared workspaces',
      '200 GB storage',
      'SSO via WorkOS',
      'Admin dashboard',
      'SLA support',
    ],
    limits: {
      aiMessagesPerMonth: 'unlimited',
      fileUploadsPerMonth: 'unlimited',
      storageGB: 200,
      codeExecutionsPerMonth: 'unlimited',
      apiRequestsPerMonth: 'unlimited',
      maxFileSizeMB: 250,
      seats: 10,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    role: 'team',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Custom limits',
      'Dedicated infrastructure',
      'Custom SLA',
      'On-premise option',
    ],
    limits: {
      aiMessagesPerMonth: 'unlimited',
      fileUploadsPerMonth: 'unlimited',
      storageGB: 1000,
      codeExecutionsPerMonth: 'unlimited',
      apiRequestsPerMonth: 'unlimited',
      maxFileSizeMB: 500,
      seats: 999,
    },
  },
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  user: 1,
  pro: 2,
  team: 3,
  admin: 99,
};

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function getPlanForRole(role: UserRole): PlanName {
  const map: Record<UserRole, PlanName> = {
    guest: 'free',
    user: 'free',
    pro: 'pro',
    team: 'team',
    admin: 'enterprise',
  };
  return map[role];
}

export function getPlanLimits(plan: PlanName): PlanLimits {
  return PLANS[plan].limits;
}

export function isAdmin(role: UserRole): boolean {
  return role === 'admin';
}
