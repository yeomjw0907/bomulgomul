import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { store } from '../services/mockStore';
import { ProductType, ProductStatus, CATEGORIES } from '../types';
import { MessageCircle, Heart, Search, SlidersHorizontal, ChevronDown, ChevronUp, RefreshCw, Clock, Flame, Tag, DollarSign, Activity, ArrowUp, ArrowDown } from 'lucide-react';

type TimeSort = 'NEWEST' | 'CLOSING_SOON' | null;
type BidSort = 'MOST_BIDS' | 'FEWEST_BIDS' | 'RECENTLY_BIDDED' | null;
type PriceSort = 'LOWEST_PRICE' | 'HIGHEST_PRICE' | null;

export const AuctionList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Independent Sorting States
  const [sortState, setSortState] = useState<{
      time: TimeSort;
      bid: BidSort;
      price: PriceSort;
  }>({
      time: 'NEWEST', // Default
      bid: null,
      price: null
  });
  
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState(5000000); 
  const [maxAppraisedFilter, setMaxAppraisedFilter] = useState(10000000);

  // Category Translation Map
  const categoryMap: Record<string, string> = {
      'Antiques': '골동품',
      'Furniture': '가구',
      'Electronics': '전자기기',
      'Art': '예술품',
      'Fashion': '패션',
      'Others': '기타'
  };

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

      // Multi-criteria Sort
      // Priority: Time > Price > Bid (Waterfall)
      return filtered.sort((a, b) => {
          // 1. Time Sort
          if (sortState.time) {
              if (sortState.time === 'NEWEST') {
                  const diff = b.createdAt - a.createdAt;
                  if (diff !== 0) return diff;
              } else if (sortState.time === 'CLOSING_SOON') {
                  const diff = a.endsAt - b.endsAt;
                  if (diff !== 0) return diff;
              }
          }

          // 2. Price Sort
          if (sortState.price) {
              if (sortState.price === 'LOWEST_PRICE') {
                  const diff = a.currentPrice - b.currentPrice;
                  if (diff !== 0) return diff;
              } else if (sortState.price === 'HIGHEST_PRICE') {
                  const diff = b.currentPrice - a.currentPrice;
                  if (diff !== 0) return diff;
              }
          }

          // 3. Bid Sort
          if (sortState.bid) {
              if (sortState.bid === 'MOST_BIDS') {
                  const diff = b.bids.length - a.bids.length;
                  if (diff !== 0) return diff;
              } else if (sortState.bid === 'FEWEST_BIDS') {
                  const diff = a.bids.length - b.bids.length;
                  if (diff !== 0) return diff;
              } else if (sortState.bid === 'RECENTLY_BIDDED') {
                  const aLast = a.bids.length > 0 ? a.bids[a.bids.length - 1].timestamp : 0;
                  const bLast = b.bids.length > 0 ? b.bids[b.bids.length - 1].timestamp : 0;
                  const diff = bLast - aLast;
                  if (diff !== 0) return diff;
              }
          }

          return 0;
      });
  };

  const filteredProducts = getFilteredAndSortedProducts();

  const handleResetFilters = () => {
      setMaxPriceFilter(5000000);
      setMaxAppraisedFilter(10000000);
      setSortState({ time: 'NEWEST', bid: null, price: null });
  };

  const toggleSort = (category: 'time' | 'bid' | 'price', value: string) => {
      setSortState(prev => ({
          ...prev,
          [category]: prev[category] === value ? null : value
      }));
  };

  // Helper component for sort buttons
  const SortButton = ({ 
      isActive, 
      onClick, 
      label, 
      icon: Icon 
  }: { 
      isActive: boolean, 
      onClick: () => void, 
      label: string, 
      icon?: any 
  }) => (
    <button 
        onClick={onClick} 
        className={`
            flex-1 py-2.5 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5
            ${isActive
                ? 'bg-treasure-gold text-black border-treasure-gold shadow-md' 
                : 'bg-[#2a2a2a] text-gray-400 border-gray-600 hover:bg-[#333] hover:border-gray-500'}
        `}
    >
        {Icon && <Icon size={14} />}
        {label}
    </button>
  );

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
                <span className="hidden md:inline">필터</span>
                {showFilters ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
             </button>
         </div>

         {/* Advanced Filters Panel (Collapsible) */}
         {showFilters && (
             <div className="px-4 py-4 bg-[#1a1a1a] border-t border-gray-800 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    {/* Current Price Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                <DollarSign size={14}/> 최대 입찰가 범위
                            </label>
                            <span className="text-base font-black text-treasure-gold">{formatCompactNumber(maxPriceFilter)}원 이하</span>
                        </div>
                        <div className="relative h-6 flex items-center">
                            {/* Track background lightened to bg-gray-300 for better visibility */}
                            <input 
                                type="range" 
                                min="10000" 
                                max="5000000" 
                                step="10000" 
                                value={maxPriceFilter}
                                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                                className="w-full h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-treasure-gold hover:accent-yellow-400 focus:outline-none focus:ring-2 focus:ring-treasure-gold/50"
                            />
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-500 mt-1 font-mono font-bold">
                            <span>1만원</span>
                            <span>500만원+</span>
                        </div>
                    </div>

                    {/* Appraised Value Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                <Tag size={14}/> 전문가 감정가 범위
                            </label>
                            <span className="text-base font-black text-goblin-red">{formatCompactNumber(maxAppraisedFilter)}원 이하</span>
                        </div>
                        <div className="relative h-6 flex items-center">
                            {/* Track background lightened to bg-gray-300 for better visibility */}
                            <input 
                                type="range" 
                                min="100000" 
                                max="10000000" 
                                step="100000" 
                                value={maxAppraisedFilter}
                                onChange={(e) => setMaxAppraisedFilter(Number(e.target.value))}
                                className="w-full h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-goblin-red hover:accent-red-500 focus:outline-none focus:ring-2 focus:ring-goblin-red/50"
                            />
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-500 mt-1 font-mono font-bold">
                            <span>10만원</span>
                            <span>1,000만원+</span>
                        </div>
                    </div>
                </div>

                {/* Categorized Sorting Options - Independent Selection */}
                <div className="space-y-4 mb-6">
                    {/* Time Sort */}
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1"><Clock size={10}/> 시간순</div>
                        <div className="flex gap-2">
                             <SortButton 
                                isActive={sortState.time === 'NEWEST'} 
                                onClick={() => toggleSort('time', 'NEWEST')} 
                                label="최신 등록순" 
                             />
                             <SortButton 
                                isActive={sortState.time === 'CLOSING_SOON'} 
                                onClick={() => toggleSort('time', 'CLOSING_SOON')} 
                                label="마감 임박순" 
                                icon={Clock} 
                             />
                        </div>
                    </div>

                    {/* Bid Sort */}
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1"><Flame size={10}/> 입찰순</div>
                        <div className="flex gap-2">
                             <SortButton 
                                isActive={sortState.bid === 'MOST_BIDS'} 
                                onClick={() => toggleSort('bid', 'MOST_BIDS')} 
                                label="입찰 많은순" 
                                icon={Flame} 
                             />
                             <SortButton 
                                isActive={sortState.bid === 'FEWEST_BIDS'} 
                                onClick={() => toggleSort('bid', 'FEWEST_BIDS')} 
                                label="입찰 적은순" 
                             />
                             <SortButton 
                                isActive={sortState.bid === 'RECENTLY_BIDDED'} 
                                onClick={() => toggleSort('bid', 'RECENTLY_BIDDED')} 
                                label="최근 입찰순" 
                                icon={Activity} 
                             />
                        </div>
                    </div>

                    {/* Price Sort */}
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1"><DollarSign size={10}/> 가격순</div>
                        <div className="flex gap-2">
                             <SortButton 
                                isActive={sortState.price === 'HIGHEST_PRICE'} 
                                onClick={() => toggleSort('price', 'HIGHEST_PRICE')} 
                                label="가격 높은순" 
                                icon={ArrowUp} 
                             />
                             <SortButton 
                                isActive={sortState.price === 'LOWEST_PRICE'} 
                                onClick={() => toggleSort('price', 'LOWEST_PRICE')} 
                                label="가격 낮은순" 
                                icon={ArrowDown} 
                             />
                        </div>
                    </div>
                </div>

                {/* Reset Button */}
                <button 
                    onClick={handleResetFilters}
                    className="w-full py-3 rounded-lg bg-[#333] hover:bg-[#444] text-gray-300 font-bold text-sm border border-gray-600 transition flex items-center justify-center gap-2"
                >
                    <RefreshCw size={16}/> 모든 필터 및 정렬 초기화
                </button>
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
                handleResetFilters();
                setSelectedCategory('All');
                setSearchTerm('');
            }}
            className="mt-4 flex items-center gap-2 text-treasure-gold text-sm font-bold hover:underline"
          >
              <RefreshCw size={14}/> 필터 및 검색 초기화
          </button>
        </div>
      )}
    </div>
  );
};