
export interface Team {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  foundationDate?: string | Date;
  active: boolean;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  teamId?: string;
}
