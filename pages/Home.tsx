import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Ticket, Sparkles, TrendingUp, ChevronRight, Clock } from 'lucide-react';
import { store } from '../services/mockStore';
import { ProductType, ProductStatus } from '../types';

const RECOMMENDED_KEYWORDS = ['자개장', '필름카메라', 'LP판', '고려청자', '맥북', '빈티지시계', '옛날동전'];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const popularAuctions = store.getProducts()
    .filter(p => p.type === ProductType.AUCTION && p.status === ProductStatus.ACTIVE)
    .sort((a, b) => b.bids.length - a.bids.length)
    .slice(0, 4);

  const shopItems = store.getProducts()
    .filter(p => p.type === ProductType.SHOP && p.status === ProductStatus.ACTIVE)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) navigate(`/auctions?search=${searchTerm}`);
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* Hero Section */}
      <section className="relative px-4 pt-6 pb-8 bg-gradient-to-b from-[#1a1a1a] to-[#121212]">
          <div className="text-center mb-8">
             <h1 className="text-3xl md:text-4xl font-heading text-white mb-2 leading-tight">
                당신의 안목이 <br/> <span className="text-treasure-gold italic">전설</span>이 되는 곳
             </h1>
             <p className="text-gray-400 text-sm">오직 여기서만 만날 수 있는 희귀한 보물들</p>
          </div>

          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mb-6 group">
            <div className="absolute inset-0 bg-treasure-gold/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <input 
                type="text" 
                placeholder="어떤 보물을 찾고 계신가요?"
                className="relative z-10 w-full h-14 pl-14 pr-4 rounded-full bg-[#252525] border border-gray-700 text-white placeholder-gray-500 focus:bg-[#2a2a2a] focus:border-treasure-gold focus:ring-1 focus:ring-treasure-gold transition-all outline-none shadow-xl text-base font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 z-20 group-focus-within:text-treasure-gold transition-colors" size={22}/>
            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-treasure-gold/90 hover:bg-treasure-gold text-[#1a1a1a] px-4 rounded-full font-bold text-sm z-20 transition">검색</button>
          </form>

          {/* Keywords */}
          <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
             {RECOMMENDED_KEYWORDS.map((keyword) => (
                <button 
                    key={keyword}
                    onClick={() => { setSearchTerm(keyword); navigate(`/auctions?search=${keyword}`); }}
                    className="px-3 py-1 rounded-full bg-[#252525] border border-gray-700 text-xs text-gray-400 hover:border-gray-500 hover:text-white transition-all active:scale-95"
                >
                    #{keyword}
                </button>
             ))}
          </div>
      </section>

      {/* Ticket Banner (Horizontal Scroll Snap) */}
      <section className="px-4 overflow-x-auto thin-scrollbar pb-2">
        <div className="flex gap-4 min-w-max">
           
           {/* Premium Ticket */}
           <div 
             onClick={() => navigate('/profile')}
             className="w-80 h-40 bg-gradient-to-br from-goblin-red to-[#5a1010] rounded-xl relative overflow-hidden flex items-stretch shadow-lg shadow-red-900/20 cursor-pointer group hover:scale-[1.02] transition-transform duration-300 border border-white/5"
           >
              {/* Left Part */}
              <div className="flex-1 p-5 relative z-10 flex flex-col justify-between">
                 <div>
                    <div className="inline-flex items-center gap-1 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-treasure-gold font-bold mb-2 border border-white/10">
                        <Ticket size={10}/> PREMIUM ITEM
                    </div>
                    <h3 className="font-heading text-xl text-white leading-tight">도깨비 감투</h3>
                    <p className="text-xs text-red-200 mt-1">경매 마감 없이 <br/>즉시 낙찰받는 비법</p>
                 </div>
                 <div className="text-xs font-bold text-white/80 flex items-center gap-1 group-hover:text-white transition">
                    상점 바로가기 <ChevronRight size={12}/>
                 </div>
              </div>
              
              {/* Divider */}
              <div className="w-0 border-l-2 border-dashed border-white/20 relative my-3">
                 <div className="absolute -top-6 -left-1.5 w-3 h-3 rounded-full bg-[#1a1a1a]"></div>
                 <div className="absolute -bottom-6 -left-1.5 w-3 h-3 rounded-full bg-[#1a1a1a]"></div>
              </div>

              {/* Right Part (Icon) */}
              <div className="w-24 bg-black/10 flex items-center justify-center relative">
                  <Ticket size={48} className="text-white/20 rotate-45 absolute"/>
                  <span className="font-heading text-2xl text-white z-10 rotate-90">SALE</span>
              </div>
           </div>

           {/* Event Banner (Dummy) */}
           <div className="w-80 h-40 bg-[#252525] rounded-xl relative overflow-hidden flex items-center justify-center border border-gray-700">
               <div className="text-center">
                   <h3 className="text-gray-500 font-heading text-lg">새로운 이벤트</h3>
                   <p className="text-gray-600 text-xs mt-1">준비 중입니다...</p>
               </div>
           </div>

        </div>
      </section>

      {/* Popular Auctions Grid */}
      <section className="px-4">
        <div className="flex justify-between items-end mb-5">
            <div>
                <h2 className="text-xl font-heading text-white flex items-center gap-2">
                    <TrendingUp className="text-goblin-red" size={24}/> 실시간 인기 경매
                </h2>
                <p className="text-gray-500 text-xs mt-1">지금 가장 입찰 경쟁이 치열한 물건들</p>
            </div>
            <Link to="/auctions" className="text-xs text-gray-400 font-bold hover:text-white flex items-center gap-1">전체보기 <ChevronRight size={14}/></Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            {popularAuctions.map(p => (
                <Link key={p.id} to={`/auction/${p.id}`} className="group relative">
                    {/* Card Container - Paper Style */}
                    <div className="bg-antique-white rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                        {/* Image */}
                        <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                            <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"/>
                            
                            {/* Overlay Info */}
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-lg font-bold flex items-center gap-1 border border-white/10">
                                <Clock size={10} className="text-treasure-gold"/>
                                {Math.floor((p.endsAt - Date.now()) / (1000 * 60 * 60 * 24))}일 남음
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-3">
                            <h3 className="font-bold text-[#2C2C2C] text-sm truncate mb-1 font-heading">{p.title}</h3>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold mb-0.5">현재 입찰가</p>
                                    <p className="text-goblin-red font-black text-base">{p.currentPrice.toLocaleString()}원</p>
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                                    입찰 {p.bids.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      {/* Shop Items Grid */}
      <section className="px-4">
        <div className="flex justify-between items-end mb-5">
            <div>
                <h2 className="text-xl font-heading text-white flex items-center gap-2">
                    <Sparkles className="text-treasure-gold" size={24}/> 도깨비 만물상
                </h2>
                <p className="text-gray-500 text-xs mt-1">검증된 물건을 즉시 구매하세요</p>
            </div>
            <Link to="/shop" className="text-xs text-gray-400 font-bold hover:text-white flex items-center gap-1">전체보기 <ChevronRight size={14}/></Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            {shopItems.map(p => (
                <Link key={p.id} to={`/shop/${p.id}`} className="group">
                    <div className="bg-[#252525] border border-gray-700 rounded-xl overflow-hidden hover:border-gray-500 transition-colors">
                        <div className="aspect-square bg-[#1a1a1a] relative">
                            <img src={p.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                        </div>
                        <div className="p-3">
                            <h3 className="font-bold text-gray-200 text-sm truncate mb-1">{p.title}</h3>
                            <p className="text-white font-black text-sm">{p.currentPrice.toLocaleString()}원</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </section>

    </div>
  );
};