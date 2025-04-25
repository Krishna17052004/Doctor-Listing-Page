export interface Specialty {
  name: string;
}

export interface Doctor {
  id: string | number;
  name: string;
  name_initials?: string;
  photo?: string;
  doctor_introduction?: string;
  specialities?: Specialty[];  // API uses 'specialities' with this format
  specialties?: string[];      // Our app uses this format
  experience: string | number;
  fees: string | number;
  rating?: number;
  reviews?: number;
  videoConsult?: boolean;
  inClinic?: boolean;
  gender?: string;
  languages?: string[];
}
