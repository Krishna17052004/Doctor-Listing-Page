import { useCallback, useEffect } from "react";
import { useLocation, useSearch } from "wouter";

export interface SearchParams {
  search?: string;
  consultation?: string;
  specialties?: string | string[];
  sort?: string;
}

export function useUrlState() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const urlParams = new URLSearchParams(search);
  
  // Parse the URL search params into our search params object
  const parseSearchParams = useCallback((): SearchParams => {
    const params: SearchParams = {};
    
    const searchParam = urlParams.get("search");
    if (searchParam) params.search = searchParam;
    
    const consultationParam = urlParams.get("consultation");
    if (consultationParam) params.consultation = consultationParam;
    
    // Handle specialties as an array if multiple
    const specialtiesParam = urlParams.getAll("specialties");
    if (specialtiesParam.length > 0) {
      // If there's only one specialty, store it as a string, otherwise as an array
      params.specialties = specialtiesParam.length === 1 
        ? specialtiesParam[0] 
        : specialtiesParam;
    }
    
    const sortParam = urlParams.get("sort");
    if (sortParam) params.sort = sortParam;
    
    return params;
  }, [urlParams]);
  
  // Current search params parsed from URL
  const searchParams = parseSearchParams();
  
  // Update the URL with new search params
  const updateSearchParams = useCallback((newParams: Partial<SearchParams>) => {
    // Start with the current URL params
    const currentParams = new URLSearchParams(search);
    
    // Update with new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        currentParams.delete(key);
      } else if (Array.isArray(value)) {
        // Handle array values (like specialties)
        currentParams.delete(key);
        value.forEach(val => {
          if (val) currentParams.append(key, val);
        });
      } else {
        currentParams.set(key, value);
      }
    });
    
    // Set the new URL
    const newSearch = currentParams.toString();
    const newPath = newSearch ? `${location.split('?')[0]}?${newSearch}` : location.split('?')[0];
    setLocation(newPath);
  }, [location, search, setLocation]);
  
  // Clear all search params
  const clearSearchParams = useCallback(() => {
    setLocation(location.split('?')[0]);
  }, [location, setLocation]);
  
  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Force a re-render when navigation happens
      parseSearchParams();
    };
    
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [parseSearchParams]);
  
  return { searchParams, updateSearchParams, clearSearchParams };
}
