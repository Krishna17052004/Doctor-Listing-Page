import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Doctor } from "@/types/doctor";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  doctors: Doctor[];
}

export default function SearchBar({ searchTerm, onSearch, doctors }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    // Add click outside handler to close suggestions
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length >= 2) {
      // Find matching doctors based on name
      const matches = doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 3);
      
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(inputValue);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setInputValue(name);
    onSearch(name);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="mt-4 md:mt-0 relative w-full md:w-96">
      <div className="relative">
        <input
          type="text"
          data-testid="autocomplete-input"
          placeholder="Search doctor by name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        <div className="absolute right-3 top-2.5 text-gray-400">
          <Search size={20} />
        </div>
      </div>
      
      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
          {suggestions.map((doctor) => (
            <div 
              key={doctor.id}
              data-testid="suggestion-item" 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(doctor.name)}
            >
              {doctor.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
