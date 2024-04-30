"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AddCityPage = () => {
    const router = useRouter()
    const [formData, setFormData] = useState<any>({
        name: '',
        lat: '',
        long: '',
        population: '',
        language: '',
        images: [], 
        festivals: [{ name: '', date: '' }], 
      });
      const [uploading, setUploading] = useState<boolean>(false);
    
      const handleChange = (e:any, index: number) => {
        const { name, value } = e.target;
        const updatedFestivals = [...formData.festivals];
        updatedFestivals[index][name] = value;
        setFormData({ ...formData, festivals: updatedFestivals });
      };
    
      const handleAddFestival = () => {
        setFormData({ ...formData, festivals: [...formData.festivals, { name: '', date: '' }] });
      };
    
      const handleRemoveFestival = (index: number) => {
        const updatedFestivals = formData.festivals.filter((_ :any, i:any) => i !== index);
        setFormData({ ...formData, festivals: updatedFestivals });
      };
    
      const handleImageUpload = async (e: any) => {
        const files = e.target.files;
        if (!files) return;
        const uploadPreset  = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as any
    
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('upload_preset', uploadPreset );
    
        try {
          setUploading(true);
          const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        setFormData((prevData:any) => ({
            ...prevData,
            images: [...prevData.images, response.data.secure_url],
          }));
        } catch (error) {
          console.error('Error uploading image:', error);
        } finally {
          setUploading(false);
        }
      };
    
      const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
          const dataToSend = { ...formData };
          const response = await axios.post('http://localhost:5000/api/cities', dataToSend);
          console.log('City added:', response.data);
          setFormData({
            name: '',
            lat: '',
            long: '',
            population: '',
            language: '',
            images: [], 
            festivals: [{ name: '', date: '' }], 
          })
        } catch (error) {
          console.error('Error adding city:', error);
        }
      };
      const dummyLanguages = [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
      ];
     

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4">Add City</h1>
      <form className="max-w-md mx-auto">
        <label className="block mb-4">
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </label>
       
        
        <label className="block mb-4">
          Latitude:
          <input
            type="text"
            name="lat"
            value={formData.lat}
            onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </label>
        <label className="block mb-4">
          Longitude:
          <input
            type="text"
            name="long"
            value={formData.long}
            onChange={(e) => setFormData({ ...formData, long: e.target.value })}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </label>
        <label className="block mb-4">
          Population:
          <input
            type="number"
            name="population"
            value={formData.population}
            onChange={(e) => setFormData({ ...formData, population: e.target.value })}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </label>
        <label className="block mb-4">
          Language:
          <select
            name="language"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value="">Select Language</option>
            {dummyLanguages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </label>
        {formData.festivals.map((festival: any, index: number) => (
          <div key={index} className="flex items-center mb-4">
            <input
              type="text"
              name="name"
              value={festival.name}
              onChange={(e) => handleChange(e, index)}
              placeholder="Festival Name"
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring focus:border-blue-500"
            />
            <input
              type="date"
              name="date"
              value={festival.date}
              onChange={(e) => handleChange(e, index)}
              required
              className="w-36 px-4 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring focus:border-blue-500"
            />
            {index !== formData.festivals.length - 1 && (
              <button type="button" onClick={() => handleRemoveFestival(index)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddFestival} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Add Festival
        </button>
        <label className="block mb-4">
          Images:
          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={handleImageUpload}
            required
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
          {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
        </label>
        <div className='flex flex-row gap-4'>
        <button type="submit" onClick={(e)=>handleSubmit(e)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Add City
        </button>
        <button type="submit" onClick={()=> router.push("/")} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Home
        </button>
        </div>
      </form>
    </div>
  );
};

export default AddCityPage;
