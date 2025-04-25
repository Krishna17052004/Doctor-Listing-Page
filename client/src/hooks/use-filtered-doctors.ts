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
        result = result.filter(doctor => {
          if (!doctor.specialties || doctor.specialties.length === 0) {
            return false;
          }
          return specialtiesArray.some(specialty => doctor.specialties!.includes(specialty));
        });
      }
    }
    
    // Apply sorting - handle different data types for fees and experience
    if (searchParams.sort === "fees") {
      result.sort((a, b) => {
        const aFees = typeof a.fees === 'number' ? a.fees : 0;
        const bFees = typeof b.fees === 'number' ? b.fees : 0;
        return aFees - bFees; // Ascending
      });
    } else if (searchParams.sort === "experience") {
      result.sort((a, b) => {
        const aExp = typeof a.experience === 'number' ? a.experience : 0;
        const bExp = typeof b.experience === 'number' ? b.experience : 0;
        return bExp - aExp; // Descending
      });
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
