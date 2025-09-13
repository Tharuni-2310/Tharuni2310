import React from 'react';
import { BookingStatus, bookingStatusSteps } from '../types';

interface BookingStatusTimelineProps {
  currentStatus: BookingStatus;
}

const BookingStatusTimeline: React.FC<BookingStatusTimelineProps> = ({ currentStatus }) => {
  const currentIndex = bookingStatusSteps.indexOf(currentStatus);

  return (
    <div className="w-full py-2">
      <div className="flex items-center">
        {bookingStatusSteps.map((status, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <React.Fragment key={status}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'bg-cyan-500' : 'bg-slate-600'
                  }`}
                >
                  {isCurrent && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                  {!isCurrent && isActive && (
                    <svg className="w-3 h-3 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  )}
                </div>
                <p className={`mt-2 text-xs text-center font-medium ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>{status}</p>
              </div>
              {index < bookingStatusSteps.length - 1 && (
                 <div className={`flex-1 h-1 transition-colors duration-500 ease-in-out ${isActive && index < currentIndex ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BookingStatusTimeline;