import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { store } from '../services/mockStore';
import { ProductType, ProductStatus, CATEGORIES } from '../types';
import { MessageCircle, Heart, Search, SlidersHorizontal, ChevronDown, ChevronUp, RefreshCw, Clock, Flame, Tag, DollarSign, Activity } from 'lucide-react';

export const AuctionList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Expanded Sorting Options
  const [sortBy, setSortBy] = useState<'NEWEST' | 'MOST_BIDS' | 'FEWEST_BIDS' | 'LOWEST_PRICE' | 'CLOSING_SOON' | 'RECENTLY_BIDDED'>('NEWEST');
  
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState(5000000); // Default Max 5 Million Won
  const [maxAppraisedFilter, setMaxAppraisedFilter] = useState(10000000); // Default Max 10 Million Won

  // Category Translation Map
  const categoryMap: Record<string, string> = {
      'Antiques': '골동품',
      'Furniture': '가구',
      'Electronics': '전자기기',
      'Art': '예술품',
      'Fashion': '패션',
      'Others': '기타'
  };

  // Helper to format currency for slider labels
  const formatCompactNumber = (number: number) => {
      return new Intl.NumberFormat('ko-KR', { notation: "compact", maximumFractionDigits: 1 }).format(number);
  };

  const getFilteredAndSortedProducts = () => {
      let filtered = store.getProducts().filter(p => 
        p.type === ProductType.AUCTION && 
        p.status === ProductStatus.ACTIVE &&
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        p.currentPrice <= maxPriceFilter &&
        (p.appraisedValue ? p.appraisedValue <= maxAppraisedFilter : true)
      );

      if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(p => 
              p.title.toLowerCase().includes(term) || 
              p.description.toLowerCase().includes(term)
          );
      }

      return filtered.sort((a, b) => {
          switch (sortBy) {
              case 'NEWEST': 
                return b.createdAt - a.createdAt;
              case 'MOST_BIDS': 
                return b.bids.length - a.bids.length;
              case 'FEWEST_BIDS': 
                return a.bids.length - b.bids.length;
              case 'LOWEST_PRICE': 
                return a.currentPrice - b.currentPrice;
              case 'CLOSING_SOON':
                return a.endsAt - b.endsAt;
              case 'RECENTLY_BIDDED':
                 // Get latest bid timestamp or fallback to creation time
                 const aLast = a.bids.length > 0 ? a.bids[a.bids.length - 1].timestamp : 0;
                 const bLast = b.bids.length > 0 ? b.bids[b.bids.length - 1].timestamp : 0;
                 return bLast - aLast;
              default: return 0;
          }
      });
  };

  const filteredProducts = getFilteredAndSortedProducts();

  return (
    <div className="pb-10 min-h-screen relative">
      {/* Sticky Header Section */}
      <div className="sticky top-14 md:top-16 z-40 bg-[#2C2C2C]/95 backdrop-blur-md border-b border-gray-700 shadow-xl transition-all">
         
         {/* Search & Filter Toggle Area */}
         <div className="px-4 pt-4 pb-2 flex gap-2">
             <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="보물 검색 (예: 고려청자, 맥북)" 
                  className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-treasure-gold focus:ring-1 focus:ring-treasure-gold outline-none transition-all shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
             </div>
             <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 rounded-lg border flex items-center gap-2 font-bold text-sm transition-all ${showFilters ? 'bg-treasure-gold text-black border-treasure-gold' : 'bg-[#1a1a1a] text-gray-400 border-gray-600 hover:border-gray-400'}`}
             >
                <SlidersHorizontal size={18} />
                <span className="hidden md:inline">고급옵션</span>
                {showFilters ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
             </button>
         </div>

         {/* Advanced Filters Panel (Collapsible) */}
         {showFilters && (
             <div className="px-4 py-4 bg-[#1a1a1a] border-t border-gray-800 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {/* Current Price Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                <DollarSign size={12}/> 최대 입찰가 범위
                            </label>
                            <span className="text-sm font-black text-treasure-gold">{formatCompactNumber(maxPriceFilter)}원 이하</span>
                        </div>
                        <input 
                            type="range" 
                            min="10000" 
                            max="5000000" 
                            step="10000" 
                            value={maxPriceFilter}
                            onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-treasure-gold hover:accent-yellow-400"
                        />
                        <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-mono">
                            <span>1만원</span>
                            <span>500만원+</span>
                        </div>
                    </div>

                    {/* Appraised Value Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                <Tag size={12}/> 전문가 감정가 범위
                            </label>
                            <span className="text-sm font-black text-goblin-red">{formatCompactNumber(maxAppraisedFilter)}원 이하</span>
                        </div>
                        <input 
                            type="range" 
                            min="100000" 
                            max="10000000" 
                            step="100000" 
                            value={maxAppraisedFilter}
                            onChange={(e) => setMaxAppraisedFilter(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-goblin-red hover:accent-red-500"
                        />
                        <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-mono">
                            <span>10만원</span>
                            <span>1,000만원+</span>
                        </div>
                    </div>
                </div>

                {/* Granular Sorting Options as Grid */}
                <div>
                    <label className="text-xs font-bold text-gray-400 mb-2 block">상세 정렬 기준</label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                         <button onClick={() => setSortBy('NEWEST')} className={`py-2 rounded text-xs font-bold border transition-all ${sortBy === 'NEWEST' ? 'bg-gray-200 text-black border-white' : 'bg-[#222] text-gray-500 border-gray-700 hover:bg-[#333]'}`}>
                            ✨ 최신순
                         </button>
                         <button onClick={() => setSortBy('CLOSING_SOON')} className={`py-2 rounded text-xs font-bold border transition-all flex items-center justify-center gap-1 ${sortBy === 'CLOSING_SOON' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-[#222] text-gray-500 border-gray-700 hover:bg-[#333]'}`}>
                            <Clock size={12}/> 마감임박
                         </button>
                         <button onClick={() => setSortBy('RECENTLY_BIDDED')} className={`py-2 rounded text-xs font-bold border transition-all flex items-center justify-center gap-1 ${sortBy === 'RECENTLY_BIDDED' ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-[#222] text-gray-500 border-gray-700 hover:bg-[#333]'}`}>
                            <Activity size={12}/> 최근입찰
                         </button>
                         <button onClick={() => setSortBy('MOST_BIDS')} className={`py-2 rounded text-xs font-bold border transition-all flex items-center justify-center gap-1 ${sortBy === 'MOST_BIDS' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-[#222] text-gray-500 border-gray-700 hover:bg-[#333]'}`}>
                            <Flame size={12}/> 입찰많은
                         </button>
                         <button onClick={() => setSortBy('FEWEST_BIDS')} className={`py-2 rounded text-xs font-bold border transition-all ${sortBy === 'FEWEST_BIDS' ? 'bg-gray-200 text-black border-white' : 'bg-[#222] text-gray-500 border-gray-700 hover:bg-[#333]'}`}>
                            💧 입찰적은
                         </button>
                         <button onClick={() => setSortBy('LOWEST_PRICE')} className={`py-2 rounded text-xs font-bold border transition-all ${sortBy === 'LOWEST_PRICE' ? 'bg-gray-200 text-black border-white' : 'bg-[#222] text-gray-500 border-gray-700 hover:bg-[#333]'}`}>
                            💰 최저가
                         </button>
                    </div>
                </div>
             </div>
         )}

         {/* Category Chips - Thin Scrollbar */}
         <div className="flex overflow-x-auto thin-scrollbar gap-2 px-4 py-3 bg-[#2C2C2C]">
            <button 
                onClick={() => setSelectedCategory('All')}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedCategory === 'All' ? 'bg-treasure-gold text-[#2C2C2C] border-treasure-gold shadow-[0_0_10px_rgba(255,215,0,0.3)]' : 'bg-[#333] text-gray-400 border-gray-600 hover:border-gray-400'}`}
            >
                전체
            </button>
            {CATEGORIES.map(c => (
                <button 
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedCategory === c ? 'bg-treasure-gold text-[#2C2C2C] border-treasure-gold shadow-[0_0_10px_rgba(255,215,0,0.3)]' : 'bg-[#333] text-gray-400 border-gray-600 hover:border-gray-400'}`}
                >
                    {categoryMap[c] || c}
                </button>
            ))}
         </div>
         
         {/* Active Filters Summary */}
         {(maxPriceFilter < 5000000 || maxAppraisedFilter < 10000000 || sortBy !== 'NEWEST') && !showFilters && (
             <div className="px-4 py-2 bg-[#222] border-t border-gray-800 flex items-center gap-2 overflow-x-auto thin-scrollbar">
                <span className="text-[10px] text-gray-500 font-bold shrink-0">적용중:</span>
                {maxPriceFilter < 5000000 && <span className="text-[10px] bg-gray-700 px-2 py-0.5 rounded text-gray-300 whitespace-nowrap">~{formatCompactNumber(maxPriceFilter)}원</span>}
                {maxAppraisedFilter < 10000000 && <span className="text-[10px] bg-gray-700 px-2 py-0.5 rounded text-gray-300 whitespace-nowrap">감정가 ~{formatCompactNumber(maxAppraisedFilter)}원</span>}
                {sortBy !== 'NEWEST' && <span className="text-[10px] bg-goblin-red/20 text-goblin-red px-2 py-0.5 rounded font-bold whitespace-nowrap">{
                    sortBy === 'CLOSING_SOON' ? '마감임박순' :
                    sortBy === 'RECENTLY_BIDDED' ? '최근입찰순' :
                    sortBy === 'MOST_BIDS' ? '입찰많은순' : 
                    sortBy === 'LOWEST_PRICE' ? '최저가순' : sortBy
                }</span>}
                <button onClick={() => {
                    setMaxPriceFilter(5000000);
                    setMaxAppraisedFilter(10000000);
                    setSortBy('NEWEST');
                }} className="ml-auto text-[10px] text-gray-500 underline whitespace-nowrap">초기화</button>
             </div>
         )}
      </div>

      {/* Feed List */}
      <div className="px-4 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 mt-4 space-y-4 md:space-y-0">
        {filteredProducts.map(product => {
          const timeLeft = Math.max(0, product.endsAt - Date.now());
          const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const isClosingSoon = daysLeft === 0 && hoursLeft < 24;

          return (
            <Link key={product.id} to={`/auction/${product.id}`} className="flex py-4 bg-antique-white border-b border-gray-300 md:border md:rounded-lg md:p-4 md:flex-col md:hover:shadow-lg md:transition-shadow group text-[#2C2C2C] rounded-lg p-3 relative overflow-hidden">
              {/* Image */}
              <div className="relative w-28 h-28 md:w-full md:h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 border border-gray-300">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {product.bids.length > 0 && (
                   <div className="absolute bottom-0 left-0 right-0 bg-goblin-red/90 p-1 px-2 text-[10px] text-white font-bold backdrop-blur-sm md:hidden text-center">
                      현재 입찰 {product.bids.length}명
                   </div>
                )}
                <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-white font-bold md:hidden">
                    {categoryMap[product.category] || product.category}
                </div>
              </div>

              {/* Info */}
              <div className="ml-4 md:ml-0 md:mt-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="hidden md:block text-xs font-bold text-gray-500 mb-1">{categoryMap[product.category] || product.category}</div>
                  <h3 className="text-[15px] md:text-lg font-bold text-[#2C2C2C] line-clamp-2 leading-tight mb-1">{product.title}</h3>
                  <div className="text-xs md:text-sm text-gray-500 flex items-center gap-1 font-medium">
                     <span>{product.sellerName}</span>
                     <span>·</span>
                     <span className={`${isClosingSoon ? 'text-goblin-red animate-pulse font-black' : 'text-goblin-red font-bold'}`}>
                        {daysLeft > 0 ? `${daysLeft}일 남음` : `${hoursLeft}시간 남음`}
                     </span>
                  </div>
                  <div className="font-black text-lg md:text-xl text-[#2C2C2C] mt-1.5">
                    {product.currentPrice.toLocaleString()}원
                  </div>
                </div>
                
                <div className="flex justify-end items-center gap-3 text-gray-400 text-xs md:mt-2">
                   <div className="flex items-center gap-0.5">
                       <MessageCircle size={14} className={product.bids.length > 0 ? "text-goblin-red" : ""} />
                       <span className={product.bids.length > 0 ? "text-goblin-red font-bold" : ""}>{product.bids.length}</span>
                   </div>
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
          <p className="text-gray-600 font-heading text-6xl mb-4 opacity-30">텅</p>
          <p className="text-gray-500 font-medium">조건에 맞는 물건이 없습니다.</p>
          <button 
            onClick={() => {
                setMaxPriceFilter(5000000);
                setMaxAppraisedFilter(10000000);
                setSortBy('NEWEST');
                setSelectedCategory('All');
                setSearchTerm('');
            }}
            className="mt-4 flex items-center gap-2 text-treasure-gold text-sm font-bold hover:underline"
          >
              <RefreshCw size={14}/> 필터 초기화
          </button>
        </div>
      )}
    </div>
  );
};