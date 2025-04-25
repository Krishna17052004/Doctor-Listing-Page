import SearchBar from "@/components/search-bar";
import FilterPanel from "@/components/filter-panel";
import DoctorList from "@/components/doctor-list";
import { useDoctors } from "@/hooks/use-doctors";
import { useUrlState } from "@/hooks/use-url-state";
import { useFilteredDoctors } from "@/hooks/use-filtered-doctors";

export default function Home() {
  const { searchParams, updateSearchParams, clearSearchParams } = useUrlState();
  const { 
    data: doctors, 
    isLoading: isLoadingDoctors, 
    error: doctorsError 
  } = useDoctors();

  const { 
    filteredDoctors, 
    handleSearchChange, 
    handleConsultationChange, 
    handleSpecialtyChange, 
    handleSortChange 
  } = useFilteredDoctors(doctors || [], searchParams, updateSearchParams);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Doctor Finder</h1>
            <SearchBar 
              searchTerm={searchParams.search || ''}
              onSearch={handleSearchChange}
              doctors={doctors || []}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <FilterPanel 
            searchParams={searchParams}
            onConsultationChange={handleConsultationChange}
            onSpecialtyChange={handleSpecialtyChange}
            onSortChange={handleSortChange}
            onClearFilters={clearSearchParams}
            doctors={doctors || []}
          />
          <DoctorList 
            doctors={filteredDoctors} 
            isLoading={isLoadingDoctors}
            error={doctorsError}
            filters={searchParams}
            onClearFilters={clearSearchParams}
          />
        </div>
      </main>
    </div>
  );
}
