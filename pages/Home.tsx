import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Ticket, Sparkles } from 'lucide-react';
import { store } from '../services/mockStore';
import { ProductType, ProductStatus } from '../types';

const RECOMMENDED_KEYWORDS = ['자개장', '필름카메라', 'LP판', '고려청자', '맥북', '빈티지시계', '옛날동전'];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const popularAuctions = store.getProducts()
    .filter(p => p.type === ProductType.AUCTION && p.status === ProductStatus.ACTIVE)
    .slice(0, 4);

  const shopItems = store.getProducts()
    .filter(p => p.type === ProductType.SHOP && p.status === ProductStatus.ACTIVE)
    .slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
        navigate(`/auctions?search=${searchTerm}`);
    }
  };

  const handleKeywordClick = (keyword: string) => {
      setSearchTerm(keyword);
      navigate(`/auctions?search=${keyword}`);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Search Area - Vintage Charcoal with Red accent */}
      <section className="bg-[#222] px-4 pt-4 pb-12 rounded-b-[2rem] shadow-lg border-b border-gray-800">
          <h1 className="text-antique-white text-2xl font-heading mb-6 mt-2">
            오늘의 <span className="text-treasure-gold">보물</span>을 낚아보게!
          </h1>
          <form onSubmit={handleSearch} className="relative mb-6">
            <input 
                type="text" 
                placeholder="무엇을 찾고 있는가?"
                className="w-full h-12 pl-12 pr-4 rounded-lg bg-[#333] border border-gray-700 text-antique-white placeholder-gray-500 focus:bg-[#444] focus:text-white focus:border-treasure-gold transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
          </form>

          {/* Recommended Keywords Chips */}
          <div>
             <div className="flex items-center gap-1 mb-3">
                <Sparkles size={12} className="text-treasure-gold"/>
                <span className="text-[11px] text-gray-400 font-bold">요즘 뜨는 보물 키워드</span>
             </div>
             <div className="flex flex-wrap gap-2">
                {RECOMMENDED_KEYWORDS.map((keyword) => (
                    <button 
                        key={keyword}
                        onClick={() => handleKeywordClick(keyword)}
                        className="px-3 py-1.5 rounded-full bg-[#2C2C2C] border border-gray-600 text-xs text-gray-300 font-medium hover:border-treasure-gold hover:text-treasure-gold hover:bg-[#333] transition-all active:scale-95 shadow-sm"
                    >
                        #{keyword}
                    </button>
                ))}
             </div>
          </div>
      </section>

      {/* Ad Banner (Premium Ticket Promotion) - Goblin Red Gradient */}
      <section className="px-4 -mt-8">
        <div 
          className="bg-gradient-to-r from-goblin-red to-red-800 rounded-lg p-6 shadow-xl shadow-red-900/30 text-white flex items-center justify-between relative overflow-hidden group cursor-pointer hover:scale-[1.01] transition-transform duration-300 border border-red-700" 
          onClick={() => navigate('/profile')}
        >
           {/* Decorative elements */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
           
           <div className="relative z-10 flex-1 pr-4">
              <span className="bg-black/30 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-black tracking-wide mb-3 inline-block border border-white/10 text-treasure-gold">ITEM SHOP</span>
              <h3 className="font-heading text-xl leading-tight mb-2 drop-shadow-sm">놓치기 싫은 보물,<br/>도깨비 감투로 <span className="text-[#2C2C2C] bg-treasure-gold px-1 rounded">즉시 낙찰!</span></h3>
              <p className="text-xs text-red-100 mb-4 font-medium opacity-90">매월 3장 한정 판매</p>
              <button className="bg-[#2C2C2C] text-treasure-gold text-xs font-bold px-5 py-2.5 rounded-lg shadow-lg hover:bg-black transition flex items-center gap-2 border border-gray-700">
                 감투 구매하러 가기 <Ticket size={14} className="text-treasure-gold"/>
              </button>
           </div>
           
           <div className="relative z-10 transform rotate-12 group-hover:rotate-6 transition-transform duration-500">
               <div className="w-24 h-14 bg-antique-white rounded-lg shadow-2xl flex items-center justify-center border-2 border-[#2C2C2C] relative overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 w-6 bg-goblin-red border-r-2 border-[#2C2C2C] border-dashed"></div>
                   <span className="font-black text-[#2C2C2C] text-lg ml-4">LIMITED</span>
               </div>
           </div>
        </div>
      </section>

      {/* Popular Auctions - Antique Cards */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-heading text-antique-white">🔥 실시간 도깨비장터</h2>
            <Link to="/auctions" className="text-xs text-gray-400 font-bold hover:text-treasure-gold">전체보기</Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
            {popularAuctions.map(p => (
                <Link key={p.id} to={`/auction/${p.id}`} className="bg-antique-white rounded-lg overflow-hidden border border-gray-300 shadow-md hover:shadow-lg transition group">
                    <div className="aspect-square bg-gray-200 relative overflow-hidden">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-treasure-gold text-[10px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm border border-gray-600">
                            입찰 {p.bids.length}
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="font-bold text-[#2C2C2C] text-sm truncate">{p.title}</h3>
                        <p className="text-goblin-red font-black text-sm mt-1">{p.currentPrice.toLocaleString()}원</p>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      {/* Shop Items - Antique Cards */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-heading text-antique-white">🛍️ 도깨비 만물상</h2>
            <Link to="/shop" className="text-xs text-gray-400 font-bold hover:text-treasure-gold">전체보기</Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
            {shopItems.map(p => (
                <Link key={p.id} to={`/shop/${p.id}`} className="bg-antique-white rounded-lg overflow-hidden border border-gray-300 shadow-md hover:shadow-lg transition group">
                    <div className="aspect-square bg-gray-200 relative overflow-hidden">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                        <div className="absolute top-2 left-2 bg-blue-700 text-white text-[10px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">
                            SHOP
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="font-bold text-[#2C2C2C] text-sm truncate">{p.title}</h3>
                        <p className="text-gray-500 text-xs line-clamp-1 mt-1">{p.description}</p>
                        <p className="text-[#2C2C2C] font-black text-sm mt-2">{p.currentPrice.toLocaleString()}원</p>
                    </div>
                </Link>
            ))}
        </div>
      </section>

    </div>
  );
};