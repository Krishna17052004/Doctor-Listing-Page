import { SearchParams } from "@/hooks/use-url-state";
import { Doctor } from "@/types/doctor";

interface FilterPanelProps {
  searchParams: SearchParams;
  onConsultationChange: (value: string) => void;
  onSpecialtyChange: (value: string, checked: boolean) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  doctors: Doctor[];
}

export default function FilterPanel({ 
  searchParams, 
  onConsultationChange, 
  onSpecialtyChange, 
  onSortChange,
  doctors
}: FilterPanelProps) {
  // Extract unique specialties from doctors
  const getUniqueSpecialties = () => {
    const specialtiesSet = new Set<string>();
    doctors.forEach(doctor => {
      doctor.specialties.forEach(specialty => {
        specialtiesSet.add(specialty);
      });
    });
    return Array.from(specialtiesSet).sort();
  };

  const specialties = getUniqueSpecialties();
  
  // Convert specialties from searchParams to array for checking
  const selectedSpecialties = searchParams.specialties 
    ? Array.isArray(searchParams.specialties) 
      ? searchParams.specialties 
      : [searchParams.specialties]
    : [];

  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-lg shadow p-5 sticky top-4">
        <div className="mb-4">
          <h2 className="font-semibold text-lg text-gray-800">Filters</h2>
        </div>

        {/* Consultation Mode Filter */}
        <div className="border-t border-gray-200 pt-4 mb-5">
          <h3 data-testid="filter-header-moc" className="font-medium text-gray-700 mb-3">Consultation Mode</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input 
                type="radio" 
                id="video-consult" 
                name="consultation-mode" 
                data-testid="filter-video-consult"
                className="w-4 h-4 text-primary focus:ring-primary"
                checked={searchParams.consultation === "video"}
                onChange={() => onConsultationChange("video")}
              />
              <label htmlFor="video-consult" className="ml-2 text-sm text-gray-700">Video Consult</label>
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                id="in-clinic" 
                name="consultation-mode" 
                data-testid="filter-in-clinic"
                className="w-4 h-4 text-primary focus:ring-primary"
                checked={searchParams.consultation === "clinic"}
                onChange={() => onConsultationChange("clinic")}
              />
              <label htmlFor="in-clinic" className="ml-2 text-sm text-gray-700">In Clinic</label>
            </div>
          </div>
        </div>

        {/* Speciality Filter */}
        <div className="border-t border-gray-200 pt-4 mb-5">
          <h3 data-testid="filter-header-speciality" className="font-medium text-gray-700 mb-3">Speciality</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {specialties.map((specialty) => {
              // Format the ID to match test ID format
              const specialtyId = specialty.replace(/\s+/g, '-');
              return (
                <div key={specialty} className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`specialty-${specialtyId}`}
                    data-testid={`filter-specialty-${specialtyId}`}
                    className="w-4 h-4 text-primary focus:ring-primary"
                    checked={selectedSpecialties.includes(specialty)}
                    onChange={(e) => onSpecialtyChange(specialty, e.target.checked)}
                  />
                  <label htmlFor={`specialty-${specialtyId}`} className="ml-2 text-sm text-gray-700">{specialty}</label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sort Filter */}
        <div className="border-t border-gray-200 pt-4">
          <h3 data-testid="filter-header-sort" className="font-medium text-gray-700 mb-3">Sort By</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input 
                type="radio" 
                id="sort-fees" 
                name="sort-by" 
                data-testid="sort-fees"
                className="w-4 h-4 text-primary focus:ring-primary"
                checked={searchParams.sort === "fees"}
                onChange={() => onSortChange("fees")}
              />
              <label htmlFor="sort-fees" className="ml-2 text-sm text-gray-700">Fees (Low to High)</label>
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                id="sort-experience" 
                name="sort-by" 
                data-testid="sort-experience"
                className="w-4 h-4 text-primary focus:ring-primary"
                checked={searchParams.sort === "experience"}
                onChange={() => onSortChange("experience")}
              />
              <label htmlFor="sort-experience" className="ml-2 text-sm text-gray-700">Experience (High to Low)</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
