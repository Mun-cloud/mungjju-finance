export const HUSBAND_EMAIL = process.env.HUSBAND_EMAIL!;
export const WIFE_EMAIL = process.env.WIFE_EMAIL!;

export const USER_ROLE_MAP = {
  [HUSBAND_EMAIL]: "husband",
  [WIFE_EMAIL]: "wife",
} as const;

export type UserRole = (typeof USER_ROLE_MAP)[keyof typeof USER_ROLE_MAP];
