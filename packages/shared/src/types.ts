export type UserRole = 'ADMIN' | 'GUEST';

export interface Profile {
  id: string;
  role: UserRole;
  familyId: string;
}

export interface Family {
  id: string;
  name: string;
  passcode?: string;
}

export interface Guest {
  id: string;
  familyId: string;
  firstName: string;
  lastName: string;
  isAttending: boolean | null;
  dietaryRestrictions: string;
  accommodationNeeded: boolean;
  requiresTransportation: boolean;
}
