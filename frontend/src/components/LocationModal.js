import React, { useState, useEffect, useRef } from 'react';

// ── City skyline SVG illustrations (inline, purple stroke style)
const CityIcon = ({ city }) => {
  const icons = {
    'Hyderabad': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* Charminar */}
        <rect x="30" y="28" width="20" height="22" rx="1"/>
        <rect x="34" y="20" width="4" height="10"/>
        <rect x="42" y="20" width="4" height="10"/>
        <path d="M32 28 Q40 18 48 28"/>
        <circle cx="40" cy="16" r="3"/>
        <rect x="27" y="40" width="6" height="10"/>
        <rect x="47" y="40" width="6" height="10"/>
        <rect x="10" y="38" width="14" height="12"/>
        <rect x="56" y="38" width="14" height="12"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
    'Mumbai': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* Gateway of India */}
        <rect x="25" y="30" width="30" height="20" rx="1"/>
        <path d="M25 30 Q40 15 55 30"/>
        <rect x="20" y="40" width="8" height="10"/>
        <rect x="52" y="40" width="8" height="10"/>
        <path d="M33 30 L33 50 M47 30 L47 50"/>
        <rect x="5" y="42" width="12" height="8"/>
        <rect x="63" y="38" width="12" height="12"/>
        <rect x="63" y="30" width="5" height="10"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
    'Delhi NCR': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* India Gate */}
        <path d="M28 50 L28 28 Q40 20 52 28 L52 50"/>
        <path d="M24 50 L56 50"/>
        <path d="M32 28 Q40 22 48 28"/>
        <rect x="37" y="22" width="6" height="8"/>
        <circle cx="40" cy="20" r="2.5"/>
        <rect x="5" y="38" width="16" height="12"/>
        <rect x="59" y="35" width="16" height="15"/>
        <rect x="10" y="30" width="6" height="10"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
    'Bengaluru': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* Vidhana Soudha */}
        <rect x="18" y="32" width="44" height="18" rx="1"/>
        <path d="M24 32 L24 22 L56 22 L56 32"/>
        <path d="M30 22 Q40 10 50 22"/>
        <circle cx="40" cy="8" r="3"/>
        <rect x="22" y="36" width="6" height="14"/>
        <rect x="52" y="36" width="6" height="14"/>
        <rect x="36" y="36" width="8" height="14"/>
        <rect x="5" y="42" width="10" height="8"/>
        <rect x="65" y="42" width="10" height="8"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
    'Chennai': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* Temple gopuram */}
        <rect x="30" y="30" width="20" height="20" rx="1"/>
        <path d="M30 30 L35 20 L40 14 L45 20 L50 30"/>
        <path d="M33 30 L33 24 M47 30 L47 24"/>
        <rect x="36" y="36" width="8" height="14"/>
        <rect x="8" y="38" width="18" height="12"/>
        <rect x="54" y="38" width="18" height="12"/>
        <path d="M8 38 L8 32 L26 32 L26 38"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
    'Kolkata': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* Victoria Memorial dome */}
        <rect x="20" y="34" width="40" height="16" rx="1"/>
        <ellipse cx="40" cy="34" rx="18" ry="10"/>
        <ellipse cx="40" cy="26" rx="8" ry="6"/>
        <rect x="38" y="18" width="4" height="8"/>
        <circle cx="40" cy="17" r="2"/>
        <rect x="8" y="42" width="10" height="8"/>
        <rect x="62" y="42" width="10" height="8"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
    'Pune': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* Shaniwar Wada fort */}
        <rect x="15" y="30" width="50" height="20" rx="1"/>
        <rect x="15" y="20" width="8" height="12"/>
        <rect x="57" y="20" width="8" height="12"/>
        <rect x="36" y="22" width="8" height="10"/>
        <path d="M15 30 L65 30"/>
        <rect x="35" y="36" width="10" height="14"/>
        <rect x="20" y="36" width="8" height="14"/>
        <rect x="52" y="36" width="8" height="14"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
    'Ahmedabad': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* Siddi Saiyed mosque */}
        <rect x="20" y="28" width="40" height="22" rx="1"/>
        <path d="M20 28 Q30 18 40 28"/>
        <path d="M40 28 Q50 18 60 28"/>
        <rect x="36" y="34" width="8" height="16"/>
        <rect x="22" y="34" width="8" height="16"/>
        <rect x="50" y="34" width="8" height="16"/>
        <rect x="5" y="40" width="12" height="10"/>
        <rect x="63" y="40" width="12" height="10"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
    'Goa': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* Palm trees + beach */}
        <path d="M25 50 L25 25"/>
        <path d="M25 30 Q15 22 10 25 Q18 28 22 32"/>
        <path d="M25 26 Q22 16 18 14 Q22 20 24 26"/>
        <path d="M25 32 Q35 26 38 28 Q32 30 26 34"/>
        <path d="M55 50 L55 28"/>
        <path d="M55 33 Q45 26 42 28 Q48 30 52 35"/>
        <path d="M55 28 Q52 18 50 16 Q52 22 54 29"/>
        <path d="M55 34 Q64 28 66 30 Q62 33 56 36"/>
        <path d="M5 50 Q20 44 40 47 Q60 44 75 50" strokeWidth="1.5"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
    'Dubai': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* Burj Khalifa */}
        <path d="M38 50 L38 10 L42 10 L42 50"/>
        <path d="M36 18 L44 18 M35 24 L45 24 M34 30 L46 30 M33 36 L47 36 M32 42 L48 42"/>
        <rect x="38" y="6" width="4" height="6"/>
        <rect x="40" y="2" width="2" height="6"/>
        <rect x="20" y="35" width="12" height="15"/>
        <rect x="48" y="30" width="14" height="20"/>
        <rect x="5" y="42" width="12" height="8"/>
        <rect x="64" y="38" width="11" height="12"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
    'Chandigarh': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* Open Hand monument */}
        <path d="M35 50 L35 30 L40 28 L45 30 L45 50"/>
        <path d="M35 36 L28 32 L26 28 L30 27 L35 32"/>
        <path d="M45 36 L52 32 L54 28 L50 27 L45 32"/>
        <path d="M38 28 L36 22 L38 18 L40 16 L42 18 L44 22 L42 28"/>
        <rect x="8" y="38" width="16" height="12"/>
        <rect x="56" y="35" width="16" height="15"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
    'Guntur': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* Kondaveedu Fort */}
        <rect x="20" y="32" width="40" height="18" rx="1"/>
        <rect x="20" y="24" width="8" height="10"/>
        <rect x="52" y="24" width="8" height="10"/>
        <path d="M20 32 L60 32"/>
        <rect x="36" y="24" width="8" height="8"/>
        <rect x="24" y="38" width="6" height="12"/>
        <rect x="50" y="38" width="6" height="12"/>
        <rect x="36" y="36" width="8" height="14"/>
        <path d="M22 24 L22 20 L26 20 L26 24 M54 24 L54 20 L58 20 L58 24 M38 24 L38 20 L42 20 L42 24"/>
        <rect x="5" y="42" width="12" height="8"/>
        <rect x="63" y="42" width="12" height="8"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
    'Vizag': (
      <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
        {/* Submarine museum + sea */}
        <ellipse cx="30" cy="40" rx="22" ry="8"/>
        <rect x="28" y="32" width="8" height="10"/>
        <path d="M32 32 L32 26 L36 26"/>
        <rect x="8" y="44" width="18" height="6"/>
        <rect x="54" y="36" width="20" height="14"/>
        <rect x="58" y="28" width="6" height="10"/>
        <path d="M2 48 Q20 44 40 46 Q60 44 78 48" strokeWidth="1.5"/>
        <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
      </svg>
    ),
  };
  return icons[city] || (
    <svg viewBox="0 0 80 60" fill="none" stroke="#6366f1" strokeWidth="1.2" className="w-16 h-12">
      <rect x="15" y="32" width="50" height="18" rx="1"/>
      <rect x="20" y="22" width="10" height="12"/>
      <rect x="50" y="22" width="10" height="12"/>
      <rect x="35" y="26" width="10" height="6"/>
      <rect x="35" y="38" width="10" height="12"/>
      <line x1="0" y1="50" x2="80" y2="50" strokeWidth="1"/>
    </svg>
  );
};

const POPULAR_CITIES = [
  'Hyderabad', 'Bengaluru', 'Chennai', 'Mumbai',
  'Delhi NCR', 'Kolkata', 'Pune', 'Ahmedabad',
  'Goa', 'Dubai', 'Guntur', 'Vizag',
];

const ALL_CITIES = [
  'Agra','Ahmedabad','Ajmer','Aligarh','Allahabad','Amritsar','Aurangabad',
  'Bengaluru','Bhopal','Bhubaneswar','Chandigarh','Chennai','Coimbatore',
  'Delhi NCR','Dehradun','Dubai','Ernakulam','Faridabad','Goa','Guntur','Gurgaon',
  'Guwahati','Hyderabad','Indore','Jaipur','Jalandhar','Jammu','Jodhpur',
  'Kanpur','Kochi','Kolkata','Kozhikode','Lucknow','Ludhiana','Madurai',
  'Mangalore','Meerut','Mumbai','Mysuru','Nagpur','Nashik','Noida',
  'Patna','Pune','Raipur','Rajkot','Ranchi','Surat','Thiruvananthapuram',
  'Tiruchirappalli','Udaipur','Vadodara','Varanasi','Vijayawada','Vizag',
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const LocationModal = ({ isOpen, onClose, selectedCity, onSelectCity }) => {
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filteredCities = search.trim()
    ? ALL_CITIES.filter(c => c.toLowerCase().includes(search.toLowerCase()))
    : activeLetter
    ? ALL_CITIES.filter(c => c.toUpperCase().startsWith(activeLetter))
    : ALL_CITIES;

  const handleSelect = (city) => {
    onSelectCity(city);
    onClose();
    setSearch('');
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => { handleSelect('Hyderabad'); }, // default fallback
      () => {}
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center pt-4 px-4"
      onClick={e => { if (e.target === e.currentTarget) { onClose(); setSearch(''); } }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-slideDown">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Select Location</h2>
            <button
              onClick={() => { onClose(); setSearch(''); }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
            >
              ×
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search city, area or locality"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          {/* Use current location */}
          <button
            onClick={handleUseCurrentLocation}
            className="flex items-center gap-2 mt-3 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" strokeWidth="2"/>
              <path strokeLinecap="round" strokeWidth="2" d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              <circle cx="12" cy="12" r="8" strokeWidth="1.5" strokeDasharray="3 2"/>
            </svg>
            Use Current Location
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* Popular Cities */}
          {!search.trim() && (
            <div className="mb-8">
              <h3 className="text-base font-bold text-gray-900 mb-4">Popular Cities</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {POPULAR_CITIES.map(city => (
                  <button
                    key={city}
                    onClick={() => handleSelect(city)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition group
                      ${selectedCity === city
                        ? 'bg-indigo-50 ring-2 ring-indigo-400'
                        : 'bg-indigo-50 hover:bg-indigo-100'
                      }`}
                  >
                    <CityIcon city={city} />
                    <span className="text-xs font-semibold text-gray-800 text-center leading-tight">{city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Cities */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">
              {search.trim() ? `Results for "${search}"` : 'All Cities'}
            </h3>

            {/* Alphabet filter */}
            {!search.trim() && (
              <div className="flex flex-wrap gap-1 mb-4">
                {ALPHABET.map(l => (
                  <button
                    key={l}
                    onClick={() => setActiveLetter(l)}
                    className={`w-7 h-7 text-xs font-bold rounded transition
                      ${activeLetter === l
                        ? 'text-indigo-600 font-extrabold'
                        : 'text-gray-400 hover:text-gray-700'
                      }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}

            {/* City list */}
            {filteredCities.length === 0 ? (
              <p className="text-gray-400 text-sm py-4">No cities found</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4">
                {filteredCities.map(city => (
                  <button
                    key={city}
                    onClick={() => handleSelect(city)}
                    className={`text-left text-sm py-2.5 border-b border-gray-100 hover:text-indigo-600 transition
                      ${selectedCity === city ? 'text-indigo-600 font-semibold' : 'text-gray-700'}`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
