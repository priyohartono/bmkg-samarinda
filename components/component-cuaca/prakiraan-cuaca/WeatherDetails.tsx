import React from 'react';
import { Wind, Droplets, Eye, Cloud } from 'lucide-react';
import { WeatherData } from '@/lib/types';

export default function WeatherDetails({ data }: { data: WeatherData }) {
  if (!data) return null;

  const details = [
    { 
      title: "ANGIN", 
      value: `${data.windSpeed} km/j`, 
      icon: Wind, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
    { 
      title: "KELEMBAPAN", 
      value: `${data.humidity}%`, 
      icon: Droplets, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
    { 
      title: "TUTUPAN AWAN", 
      value: `${data.tcc} %`, 
      icon: Cloud, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
    { 
      title: "VISIBILITAS", 
      value: `${data.visibility} km`, 
      icon: Eye, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
  ];

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full w-full">
      {details.map((item, idx) => (
        <div 
          key={idx} 
          className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-full"
        >
          <div className="flex items-start justify-between">
            <div className={`p-2.5 rounded-full ${item.bg} ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {item.title}
            </p>
            <p className="text-xl md:text-2xl font-bold text-slate-900">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}