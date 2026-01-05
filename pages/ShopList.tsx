import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/mockStore';
import { ProductType, ProductStatus } from '../types';
import { Search } from 'lucide-react';

export const ShopList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = store.getProducts().filter(p => 
    p.type === ProductType.SHOP && 
    p.status === ProductStatus.ACTIVE &&
    (p.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pb-10 min-h-screen">
      <div className="p-4 bg-[#2C2C2C] sticky top-14 z-40 md:top-16 border-b border-gray-800">
         <h1 className="text-xl font-heading text-antique-white mb-4">도깨비 만물상</h1>
         <div className="relative">
            <input 
               type="text" 
               placeholder="물건 검색" 
               className="w-full bg-[#333] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-treasure-gold font-medium transition-all text-white placeholder-gray-500"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
         </div>
      </div>

      <div className="px-4 md:grid md:grid-cols-3 md:gap-6 mt-4 space-y-4 md:space-y-0">
        {filteredProducts.map(product => (
          <Link key={product.id} to={`/shop/${product.id}`} className="flex py-4 bg-antique-white border border-gray-300 rounded-lg p-3 md:flex-col md:gap-4 md:hover:shadow-md transition-all text-[#2C2C2C]">
            <div className="relative w-24 h-24 md:w-full md:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div className="ml-4 md:ml-0 flex-1 flex flex-col justify-center">
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">{product.category}</div>
              <h3 className="text-base font-bold text-[#2C2C2C] mb-1 line-clamp-1">{product.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-1 mb-2">{product.description}</p>
              <div className="font-black text-[#2C2C2C]">{product.currentPrice.toLocaleString()}원</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};