import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../services/mockStore';
import { ProductType, ProductStatus, CATEGORIES } from '../types';
import { MessageCircle, Heart, PlusCircle } from 'lucide-react';

export const AuctionList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const baseProducts = store.getProducts().filter(p => 
    p.type === ProductType.AUCTION && 
    p.status === ProductStatus.ACTIVE &&
    (selectedCategory === 'All' || p.category === selectedCategory)
  );

  const filteredProducts = baseProducts.filter(p => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term);
  });

  return (
    <div className="pb-10 min-h-screen bg-white">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 p-4 bg-white sticky top-14 z-40 border-b border-gray-100 md:top-16">
         <button 
           onClick={() => setSelectedCategory('All')}
           className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${selectedCategory === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-500 border-gray-200'}`}
         >
           전체
         </button>
         {CATEGORIES.map(c => (
           <button 
             key={c}
             onClick={() => setSelectedCategory(c)}
             className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${selectedCategory === c ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-500 border-gray-200'}`}
           >
             {c}
           </button>
         ))}
      </div>

      {/* Feed List */}
      <div className="px-4 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:mt-4">
        {filteredProducts.map(product => {
          const timeLeft = Math.max(0, product.endsAt - Date.now());
          const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

          return (
            <Link key={product.id} to={`/auction/${product.id}`} className="flex py-4 border-b border-gray-100 md:border md:rounded-2xl md:p-4 md:flex-col md:hover:shadow-lg md:transition-shadow group">
              {/* Image */}
              <div className="relative w-28 h-28 md:w-full md:h-48 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {product.bids.length > 0 && (
                   <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 px-2 text-[10px] text-white font-bold backdrop-blur-sm md:hidden text-center">
                      현재 입찰 {product.bids.length}명
                   </div>
                )}
              </div>

              {/* Info */}
              <div className="ml-4 md:ml-0 md:mt-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[15px] md:text-lg font-bold text-slate-900 line-clamp-2 leading-tight mb-1">{product.title}</h3>
                  <div className="text-xs md:text-sm text-gray-400 flex items-center gap-1 font-medium">
                     <span>{store.getProductById(product.id)?.sellerName}</span>
                     <span>·</span>
                     <span className="text-amber-600 font-bold">{daysLeft > 0 ? `${daysLeft}일 남음` : `${hoursLeft}시간 남음`}</span>
                  </div>
                  <div className="font-black text-lg md:text-xl text-slate-900 mt-1.5">
                    {product.currentPrice.toLocaleString()}원
                  </div>
                </div>
                
                <div className="flex justify-end items-center gap-3 text-gray-400 text-xs md:mt-2">
                   {product.bids.length > 0 && (
                     <div className="flex items-center gap-0.5">
                       <MessageCircle size={14} />
                       <span>{product.bids.length}</span>
                     </div>
                   )}
                   <div className="flex items-center gap-0.5">
                      <Heart size={14} />
                      <span>{Math.floor(Math.random() * 20)}</span>
                   </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-slate-300 font-black text-6xl mb-4">Empty</p>
          <p className="text-gray-400 font-medium">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};