import { Doctor } from "@/types/doctor";
import DoctorCard from "@/components/doctor-card";
import { AlertCircle, Search } from "lucide-react";
import { SearchParams } from "@/hooks/use-url-state";

interface DoctorListProps {
  doctors: Doctor[];
  isLoading: boolean;
  error: Error | null;
  filters: SearchParams;
  onClearFilters: () => void;
}

export default function DoctorList({ doctors, isLoading, error, filters, onClearFilters }: DoctorListProps) {
  // Generate filter summary text
  const getFilterSummary = () => {
    const parts = [];
    
    if (filters.search) {
      parts.push(`"${filters.search}"`);
    }
    
    if (filters.consultation) {
      parts.push(filters.consultation === "video" ? "Video Consult" : "In Clinic");
    }
    
    if (filters.specialties && filters.specialties.length > 0) {
      const specialtiesArray = typeof filters.specialties === 'string' 
        ? [filters.specialties] 
        : filters.specialties;
        
      if (specialtiesArray.length === 1) {
        parts.push(specialtiesArray[0]);
      } else {
        parts.push(`${specialtiesArray.length} specialties`);
      }
    }
    
    if (filters.sort) {
      parts.push(`Sorted by ${filters.sort === "fees" ? "fees" : "experience"}`);
    }
    
    return parts.length > 0 ? `Filtered by: ${parts.join(", ")}` : "";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="lg:w-3/4">
        <div className="bg-white rounded-lg shadow p-5 mb-5">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-800">
              Loading Doctors...
            </h2>
          </div>
        </div>
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="lg:w-3/4">
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Error</h3>
          <p className="text-gray-500">{error.message || "Failed to load doctors data. Please try again later."}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (doctors.length === 0) {
    return (
      <div className="lg:w-3/4">
        <div className="bg-white rounded-lg shadow p-5 mb-5">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-800">
              0 Doctors Available
            </h2>
            <div className="text-sm text-gray-500">
              <span>{getFilterSummary()}</span>
              {Object.keys(filters).length > 0 && (
                <button 
                  onClick={onClearFilters}
                  className="ml-2 text-primary hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <Search className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No doctors found</h3>
          <p className="text-gray-500">Try adjusting your filters or search term.</p>
        </div>
      </div>
    );
  }

  // Doctor list
  return (
    <div className="lg:w-3/4">
      <div className="bg-white rounded-lg shadow p-5 mb-5">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-800">
            {doctors.length} Doctors Available
          </h2>
          <div className="text-sm text-gray-500">
            <span>{getFilterSummary()}</span>
            {Object.keys(filters).length > 0 && (
              <button 
                onClick={onClearFilters}
                className="ml-2 text-primary hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
