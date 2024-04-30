"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const CityDetailsPage = () => {
  const [city, setCity] = useState<any>(null);
  const router = useParams();
  const  id  = router.id;
  

  useEffect(() => {
    const fetchCityDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cities/${id}`); 
        setCity(response.data);
      } catch (error) {
        console.error('Error fetching city details:', error);
      }
    };

    if (id) {
      fetchCityDetails();
    }
  }, [id]);

  

  if (!city) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img src={city.images[0]} alt={city.name} className="w-1/2 h-[400px] max-w-full mb-8" />
      <div className="bg-gray-200 p-8 rounded-lg w-1/2">
        <h1 className="text-3xl font-semibold mb-4">{city.name}</h1>
        <p>Coordinates: {city.lat} {city.long}</p>
        <p>Population: {city.population}</p>
        <p>Language: {city.language}</p>
        <ul>
        {city?.festivals?.map((item :any,index:any)=>{
          return(
          <li key={index}>{item.name} {item.date}</li>
        )})}
        </ul>
        <div className="mt-4">
          <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CityDetailsPage;
