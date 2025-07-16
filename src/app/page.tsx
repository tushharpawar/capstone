"use client"

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Social Media", value: 38 },
  { name: "Finance", value: 33 },
  { name: "Blackmail", value: 9 },
  { name: "Others", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Page = () => {
  const [query] = useState('tech scam');
  interface ResultItem {
    [key: string]: unknown;
  }
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/google-search?query=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Error fetching search results:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    handleSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className=''>
          <p className='font-bold text-3xl p-5 text-center'>Trending now 📈</p>
    <div className="w-full h-96 flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

        {loading ? <div className='text-center m-2'>Loading...</div> : ''}

        <div className="flex flex-col justify-center">
        {
        results.map((item, index) => (
          <div className="mx-10 my-5 p-8 border rounded-md border-zinc-700" key={index}>
            {/* <img src={item.pagemap?.cse_image[0].src || ''} alt="image" className='w-200 h-200'/> */}
            <p className=' font-semibold text-lg'>{String(item.title)}</p>
            <p className='text-zinc-300'>{String(item.snippet)}</p>
            <a href={typeof item.link === 'string' ? item.link : undefined} className='text-blue-500'>Read more</a>
          </div>
        ))}
        </div>

    </div>
  );
};

export default Page;
