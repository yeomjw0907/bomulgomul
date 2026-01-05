import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck, Truck, TrendingUp, Search } from 'lucide-react';
import { store } from '../services/mockStore';
import { ProductType, ProductStatus } from '../types';

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

  return (
    <div className="space-y-8 pb-12 bg-gray-50 min-h-screen">
      
      {/* Header Search Area */}
      <section className="bg-slate-900 px-4 pt-4 pb-12 rounded-b-[2rem] shadow-lg">
          <h1 className="text-white text-2xl font-bold mb-6 mt-2">
            오늘의 <span className="text-amber-400">보물</span>을 찾아보세요
          </h1>
          <form onSubmit={handleSearch} className="relative">
            <input 
                type="text" 
                placeholder="어떤 물건을 찾고 계신가요?"
                className="w-full h-12 pl-12 pr-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 transition-all outline-none backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
          </form>
      </section>

      {/* Quick Menu */}
      <section className="px-4 -mt-8">
        <div className="grid grid-cols-4 gap-2 bg-white p-4 rounded-2xl shadow-md border border-gray-100">
           <Link to="/auctions" className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500"><Clock size={20}/></div>
              <span className="text-[11px] font-bold text-slate-700">마감임박</span>
           </Link>
           <Link to="/shop" className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500"><ShieldCheck size={20}/></div>
              <span className="text-[11px] font-bold text-slate-700">인증쇼핑</span>
           </Link>
           <div className="flex flex-col items-center gap-2 opacity-50">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500"><Truck size={20}/></div>
              <span className="text-[11px] font-bold text-slate-700">용달</span>
           </div>
           <div className="flex flex-col items-center gap-2 opacity-50">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500"><TrendingUp size={20}/></div>
              <span className="text-[11px] font-bold text-slate-700">시세</span>
           </div>
        </div>
      </section>

      {/* Popular Auctions */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">🔥 실시간 인기 경매</h2>
            <Link to="/auctions" className="text-xs text-slate-400 font-bold hover:text-slate-600">전체보기</Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
            {popularAuctions.map(p => (
                <Link key={p.id} to={`/auction/${p.id}`} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="aspect-square bg-gray-100 relative">
                        <img src={p.image} className="w-full h-full object-cover"/>
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">
                            입찰 {p.bids.length}
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{p.title}</h3>
                        <p className="text-amber-600 font-black text-sm mt-1">{p.currentPrice.toLocaleString()}원</p>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      {/* Shop Items */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">🛍️ 쇼핑몰 추천 상품</h2>
            <Link to="/shop" className="text-xs text-slate-400 font-bold hover:text-slate-600">전체보기</Link>
        </div>
        <div className="space-y-3">
            {shopItems.map(p => (
                <Link key={p.id} to={`/shop/${p.id}`} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <img src={p.image} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{p.description}</p>
                        <p className="text-slate-900 font-bold text-sm mt-2">{p.currentPrice.toLocaleString()}원</p>
                    </div>
                </Link>
            ))}
        </div>
      </section>

    </div>
  );
};