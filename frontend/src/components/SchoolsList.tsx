"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

interface School {
  id: string;
  name: string;
  phoneNumber1: string | null;
  schoolsWebSite: string | null;
  address: {
    city: string | null;
    district: string | null;
  } | null;
  primary: {
    price: number | null;
  } | null;
  basic: {
    price: number | null;
  } | null;
  secondary: {
    price: number | null;
  } | null;
}

interface SchoolsListProps {
  schools: School[];
}

export default function SchoolsList({ schools }: SchoolsListProps) {
  const tForm = useTranslations("form");
  const tAddress = useTranslations("address");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("any");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Get unique cities and districts for filters
  const cities = useMemo(() => {
    const citySet = new Set(schools.map(s => s.address?.city).filter((city): city is string => Boolean(city)));
    return Array.from(citySet).sort();
  }, [schools]);

  const districts = useMemo(() => {
    const districtSet = new Set(schools.map(s => s.address?.district).filter((district): district is string => Boolean(district)));
    return Array.from(districtSet).sort();
  }, [schools]);

  // Filter schools based on search and filters
  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const query = searchQuery.toLowerCase();

      // Search filter
      const nameMatch = school.name?.toLowerCase().includes(query);
      const cityMatch = school.address?.city?.toLowerCase().includes(query);

      const districtKey = school.address?.district?.toLowerCase() || "";
      let districtTranslated = "";
      try {
        districtTranslated = school.address?.district
          ? tAddress(school.address.district).toLowerCase()
          : "";
      } catch {
        districtTranslated = "";
      }
      const districtMatch = districtKey.includes(query) || districtTranslated.includes(query);

      const searchMatch = !searchQuery || nameMatch || cityMatch || districtMatch;

      // City filter
      const cityFilterMatch = !selectedCity || school.address?.city === selectedCity;

      // District filter
      const districtFilterMatch = !selectedDistrict || school.address?.district === selectedDistrict;

      // Education Level & Price filter
      let levelAndPriceMatch = true;

      const min = minPrice ? parseFloat(minPrice) : null;
      const max = maxPrice ? parseFloat(maxPrice) : null;

      // Only apply price filtering if at least one price filter is set
      const hasPriceFilter = min !== null || max !== null;

      if (selectedLevel === "any") {
        // For "any level", check if ANY level has a price in range
        const primaryPrice = school.primary?.price ?? 0;
        const basicPrice = school.basic?.price ?? 0;
        const secondaryPrice = school.secondary?.price ?? 0;

        const prices = [primaryPrice, basicPrice, secondaryPrice].filter(p => p > 0);

        if (hasPriceFilter) {
          // If price filters are set, at least one price must match
          if (prices.length === 0) {
            // School has no prices, exclude it
            levelAndPriceMatch = false;
          } else {
            // Check if ANY price is in range
            levelAndPriceMatch = prices.some(price => {
              const minMatch = min === null || price >= min;
              const maxMatch = max === null || price <= max;
              return minMatch && maxMatch;
            });
          }
        }
        // If no price filters, levelAndPriceMatch stays true
      } else {
        // For specific level, check only that level's price
        let levelPrice = 0;
        if (selectedLevel === "primary") levelPrice = school.primary?.price ?? 0;
        else if (selectedLevel === "basic") levelPrice = school.basic?.price ?? 0;
        else if (selectedLevel === "secondary") levelPrice = school.secondary?.price ?? 0;

        if (hasPriceFilter) {
          if (levelPrice === 0) {
            // School doesn't have this level or price is 0, exclude it
            levelAndPriceMatch = false;
          } else {
            const minMatch = min === null || levelPrice >= min;
            const maxMatch = max === null || levelPrice <= max;
            levelAndPriceMatch = minMatch && maxMatch;
          }
        }
        // If no price filters, levelAndPriceMatch stays true
      }

      return searchMatch && cityFilterMatch && districtFilterMatch && levelAndPriceMatch;
    });
  }, [schools, searchQuery, selectedCity, selectedDistrict, selectedLevel, minPrice, maxPrice, tAddress]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCity("");
    setSelectedDistrict("");
    setSelectedLevel("any");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <>
      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 md:p-8 mb-6 border-2 border-slate-400 shadow-lg">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
          🔍 {tForm("searchForSchools")}
        </h2>
        {/* Row 1: Search, City, District */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              {tForm("searchLabel")}
            </label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tForm("searchPlaceholder")}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* City Filter */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              🏙️ {tAddress("city")}
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">{tAddress("city")} - All</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
              📍 {tAddress("district")}
            </label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">{tAddress("selectDistrict")}</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {tAddress(district)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Education Level, Min Price, Max Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Education Level Filter */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
              🎓 {tForm("educationLevel")}
            </label>
            <select
              id="level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="any">{tForm("anyLevel")}</option>
              <option value="primary">{tForm("primaryOnly")}</option>
              <option value="basic">{tForm("basicOnly")}</option>
              <option value="secondary">{tForm("secondaryOnly")}</option>
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
              💰 {tForm("minPrice")}
            </label>
            <input
              id="minPrice"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Max Price */}
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
              💵 {tForm("maxPrice")}
            </label>
            <input
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="100000"
              min="0"
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Filter status and clear button */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {tForm("searchResults")}: <span className="font-semibold">{filteredSchools.length}</span> / {schools.length}
          </p>
          {(searchQuery || selectedCity || selectedDistrict || selectedLevel !== "any" || minPrice || maxPrice) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {tForm("clearSearch")}
            </button>
          )}
        </div>
      </div>

      {/* Schools List */}
      {filteredSchools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{tForm("noSearchResults")}</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-base"
          >
            {tForm("clearSearch")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 md:p-6 border border-gray-200"
            >
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{school.name}</h3>

              {/* Info Row 1: Location, Phone, Website */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                {/* Location */}
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span className="text-sm">
                    {school.address?.city}
                    {school.address?.district && (
                      <>, {tAddress(school.address.district)}</>
                    )}
                  </span>
                </div>

                {/* Phone */}
                {school.phoneNumber1 && (
                  <div className="flex items-center">
                    <span className="mr-2">📞</span>
                    <a
                      href={`tel:${school.phoneNumber1}`}
                      className="text-sm hover:text-blue-600 transition-colors"
                    >
                      {school.phoneNumber1}
                    </a>
                  </div>
                )}

                {/* Website */}
                {school.schoolsWebSite && (
                  <div className="flex items-center">
                    <span className="mr-2">🌐</span>
                    <a
                      href={school.schoolsWebSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:text-blue-700 underline truncate max-w-[200px] sm:max-w-none"
                    >
                      {school.schoolsWebSite.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </div>
                )}
              </div>

              {/* Info Row 2: Prices */}
              <div className="flex flex-wrap items-center gap-4 text-gray-700 bg-blue-50 rounded-lg p-3 border border-blue-100">
                <span className="font-semibold text-sm">💰 {tForm("priceRange")}:</span>

                {school.primary?.price && school.primary.price > 0 && (
                  <span className="text-sm">
                    <span className="font-medium">{tForm("primary")}:</span>{" "}
                    <span className="text-blue-700 font-semibold">
                      {school.primary.price.toLocaleString()} {tForm("currency")}
                    </span>
                  </span>
                )}

                {school.basic?.price && school.basic.price > 0 && (
                  <span className="text-sm">
                    <span className="font-medium">{tForm("basic")}:</span>{" "}
                    <span className="text-blue-700 font-semibold">
                      {school.basic.price.toLocaleString()} {tForm("currency")}
                    </span>
                  </span>
                )}

                {school.secondary?.price && school.secondary.price > 0 && (
                  <span className="text-sm">
                    <span className="font-medium">{tForm("secondary")}:</span>{" "}
                    <span className="text-blue-700 font-semibold">
                      {school.secondary.price.toLocaleString()} {tForm("currency")}
                    </span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
