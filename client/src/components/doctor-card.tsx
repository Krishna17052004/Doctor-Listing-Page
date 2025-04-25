import { Doctor } from "@/types/doctor";
import { Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  // Render stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
    }
    
    // Add half star if needed
    if (halfStar) {
      stars.push(<StarHalf key="half" className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
    }
    
    return stars;
  };

  return (
    <div data-testid="doctor-card" className="bg-white rounded-lg shadow hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex flex-col md:flex-row">
          {/* Doctor Image and Basic Info */}
          <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
            <div className="w-20 h-20 rounded-full bg-gray-200 mb-3 md:mb-0 md:mr-5 flex items-center justify-center overflow-hidden">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 data-testid="doctor-name" className="font-semibold text-lg text-gray-800">{doctor.name}</h3>
              <p data-testid="doctor-specialty" className="text-gray-600">{doctor.specialties.join(', ')}</p>
              <p data-testid="doctor-experience" className="text-gray-600">{doctor.experience}+ years experience</p>
              <div className="flex items-center mt-1">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">{doctor.rating}</span>
                <div className="flex text-yellow-400 ml-1">
                  {renderStars(doctor.rating)}
                </div>
                <span className="text-xs text-gray-500 ml-1">({doctor.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          {/* Fee and Booking Info */}
          <div className="md:ml-auto text-center md:text-right">
            <div data-testid="doctor-fee" className="font-medium text-gray-800">₹{doctor.fees} Consultation Fee</div>
            <div className="flex flex-col md:items-end mt-2">
              {doctor.videoConsult && (
                <span className="inline-flex items-center bg-blue-50 text-primary text-xs px-2 py-1 rounded-full mb-2">
                  <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 10L19.5528 7.72361C19.8343 7.58281 20 7.29768 20 7V5.5M15 10V14M15 10V6M4 15V9C4 8.44772 4.44772 8 5 8H15C15.5523 8 16 8.44772 16 9V15C16 15.5523 15.5523 16 15 16H5C4.44772 16 4 15.5523 4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Video Consult Available
                </span>
              )}
              {doctor.inClinic && (
                <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                  <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21M3 21V15M3 21H7M21 21V15M21 21H17M17 3H21V9H17M17 3L12 7L7 3M17 3V9M7 3H3V9H7M7 3V9M3 9V15M7 9V15M17 9V15M21 9V15M7 15H3M7 15V21M7 15H17M17 15H21M17 15V21M7 21V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  In-clinic Available
                </span>
              )}
            </div>
            <Button className="mt-3 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
