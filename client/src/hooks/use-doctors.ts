import { useQuery } from "@tanstack/react-query";
import { Doctor, Specialty } from "@/types/doctor";

// Transform API data to match our application format
const transformDoctorData = (apiData: any[]): Doctor[] => {
  return apiData.map(doc => {
    // Extract specialties from the API format to our app format
    const specialties = doc.specialities?.map((s: Specialty) => s.name) || [];
    
    // Extract experience as a number from string like "13 Years of experience"
    const experienceMatch = doc.experience ? doc.experience.match(/\d+/) : null;
    const experience = experienceMatch ? parseInt(experienceMatch[0], 10) : 0;
    
    // Extract fee as a number from string like "₹ 500"
    const feesMatch = doc.fees ? doc.fees.match(/\d+/) : null;
    const fees = feesMatch ? parseInt(feesMatch[0], 10) : 0;
    
    // For demo purposes, use default values for missing fields
    return {
      id: doc.id,
      name: doc.name,
      specialties,
      experience,
      fees,
      rating: 4.5, // Default value as not provided in API
      reviews: 100, // Default value as not provided in API
      videoConsult: true, // Default value as not provided in API
      inClinic: true, // Default value as not provided in API
      gender: 'Unknown', // Default value as not provided in API
      // Keep original fields
      name_initials: doc.name_initials,
      photo: doc.photo,
      doctor_introduction: doc.doctor_introduction,
      languages: doc.languages
    };
  });
};

export function useDoctors() {
  return useQuery<Doctor[], Error>({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await fetch("https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json");
      
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      
      const apiData = await response.json();
      return transformDoctorData(apiData);
    },
  });
}
