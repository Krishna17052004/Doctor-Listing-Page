export interface Doctor {
  id: number;
  name: string;
  specialties: string[];
  experience: number;
  fees: number;
  rating: number;
  reviews: number;
  videoConsult: boolean;
  inClinic: boolean;
  gender: string;
}
