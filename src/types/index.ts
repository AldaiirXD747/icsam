
// Types for gallery
export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  championshipId: string;
  createdAt: string | Date;
  featured?: boolean;
}

// Types for teams
export interface Team {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  logo?: string;
  category: string;
  group_name: string;
  active: boolean;
}

// Types for users
export interface User {
  id: string;
  email: string;
  teamId?: string;
}

// Types for championships
export interface Championship {
  id: string;
  name: string;
  year: string;
  description: string;
  banner_image: string;
  start_date: string;
  end_date: string;
  location: string;
  categories: string[];
  organizer: string;
  sponsors: any[];
  status: 'upcoming' | 'ongoing' | 'finished';
}
