"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CitiesPage = () => {
  const [cities, setCities] = useState<any>([]);
  const [searchKeyword, setSearchKeyword] = useState<any>('');
  const [filteredCities, setFilteredCities] = useState<any>([]);
  const [suggestedCities, setSuggestedCities] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cities'); 
        setCities(response.data);
        setFilteredCities(response.data); 
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const handleSearchInputChange = (e:any) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    filterCities(keyword);
    suggestCities(keyword);
  };

  const filterCities = (keyword:any) => {
    const filtered = cities.filter((city:any) =>
      city.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const suggestCities = (keyword:any) => {
    const suggestions = cities.filter((city:any) =>
      city.name.toLowerCase().startsWith(keyword.toLowerCase())
    );
    
    setSuggestedCities(suggestions);
    
  };

  const handleSuggestionClick = (cityName:any) => {
    setSearchKeyword(cityName.name);
    router.push(`/cityDetail/${cityName. _id}`); 
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Cities</h1>
        <Link href="/addCity" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Add City
        </Link>
      </div>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search by city name..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          value={searchKeyword}
          onChange={handleSearchInputChange}
        />
        {suggestedCities.length > 0 && (
          <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-md z-50 absolute w-full h-[200px] overflow-auto">
            {suggestedCities.map((city:any) => (
              <li
                key={city._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(city)}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCities.map((city:any) => (
          <div key={city._id} className="bg-white p-4 rounded-lg shadow-md">
            {city.images.length > 0 && (
              <img src={city.images[0]} alt={city.name} className="h-40 w-full object-cover mb-2 rounded-md" />
            )}
            <h2 className="text-xl font-semibold mb-2">{city.name}</h2>
            <p className="text-gray-600 mb-2">Coordinates: {city.coordinates}</p>
            <p className="text-gray-600 mb-2">Population: {city.population}</p>
            <p className="text-gray-600 mb-4">Language: {city.language}</p>
            <Link href={`/cityDetail/${city._id}`} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 inline-block mr-2">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitiesPage;

