import { useMemo, useCallback } from "react";
import { Doctor } from "@/types/doctor";
import { SearchParams } from "@/hooks/use-url-state";

export function useFilteredDoctors(
  doctors: Doctor[],
  searchParams: SearchParams,
  updateSearchParams: (params: Partial<SearchParams>) => void
) {
  // Apply all filters and sort to the doctors list
  const filteredDoctors = useMemo(() => {
    let result = [...doctors];
    
    // Apply search filter
    if (searchParams.search) {
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(searchParams.search!.toLowerCase())
      );
    }
    
    // Apply consultation type filter
    if (searchParams.consultation === "video") {
      result = result.filter(doctor => doctor.videoConsult);
    } else if (searchParams.consultation === "clinic") {
      result = result.filter(doctor => doctor.inClinic);
    }
    
    // Apply specialties filter
    if (searchParams.specialties) {
      const specialtiesArray = Array.isArray(searchParams.specialties) 
        ? searchParams.specialties 
        : [searchParams.specialties];
      
      if (specialtiesArray.length > 0) {
        result = result.filter(doctor => 
          specialtiesArray.some(specialty => doctor.specialties.includes(specialty))
        );
      }
    }
    
    // Apply sorting
    if (searchParams.sort === "fees") {
      result.sort((a, b) => a.fees - b.fees); // Ascending
    } else if (searchParams.sort === "experience") {
      result.sort((a, b) => b.experience - a.experience); // Descending
    }
    
    return result;
  }, [doctors, searchParams]);
  
  // Handler for search input
  const handleSearchChange = useCallback((searchTerm: string) => {
    updateSearchParams({ search: searchTerm });
  }, [updateSearchParams]);
  
  // Handler for consultation type change
  const handleConsultationChange = useCallback((consultationType: string) => {
    updateSearchParams({ consultation: consultationType });
  }, [updateSearchParams]);
  
  // Handler for specialty selection
  const handleSpecialtyChange = useCallback((specialty: string, checked: boolean) => {
    // Get current specialties as an array
    const currentSpecialties = searchParams.specialties 
      ? Array.isArray(searchParams.specialties) 
        ? [...searchParams.specialties] 
        : [searchParams.specialties]
      : [];
    
    let newSpecialties: string[];
    
    if (checked) {
      // Add specialty if checked
      newSpecialties = [...currentSpecialties, specialty];
    } else {
      // Remove specialty if unchecked
      newSpecialties = currentSpecialties.filter(s => s !== specialty);
    }
    
    updateSearchParams({ specialties: newSpecialties });
  }, [searchParams.specialties, updateSearchParams]);
  
  // Handler for sort option change
  const handleSortChange = useCallback((sortBy: string) => {
    updateSearchParams({ sort: sortBy });
  }, [updateSearchParams]);
  
  return {
    filteredDoctors,
    handleSearchChange,
    handleConsultationChange,
    handleSpecialtyChange,
    handleSortChange
  };
}
