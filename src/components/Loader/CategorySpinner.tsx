import React, { useEffect, useState } from 'react';
import { Smartphone, Headphones, Laptop, Watch, BatteryCharging } from 'lucide-react';

const categories = [
  { name: 'Mobiles', icon: <Smartphone className="w-8 h-8" /> },
  { name: 'Airbuds', icon: <Headphones className="w-8 h-8" /> },
  { name: 'Laptops', icon: <Laptop className="w-8 h-8" /> },
  { name: 'Smartwatches', icon: <Watch className="w-8 h-8" /> },
  { name: 'Powerbanks', icon: <BatteryCharging className="w-8 h-8" /> },
];

export default function CategorySpinner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % categories.length), 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="w-20 h-20 flex items-center justify-center rounded-full border-4 border-blue-400 animate-spin-slow mb-4">
        {categories[index].icon}
      </div>
      <div className="text-lg font-semibold text-blue-600">{categories[index].name}</div>
    </div>
  );
}
