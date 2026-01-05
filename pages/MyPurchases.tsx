import React from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/mockStore';
import { ChevronLeft } from 'lucide-react';
import { ProductStatus } from '../types';

export const MyPurchases: React.FC = () => {
  const navigate = useNavigate();
  const user = store.getCurrentUser();
  
  if (!user) return null;

  const myPurchases = store.getProducts().filter(p => p.winnerId === user.id && p.status === ProductStatus.SOLD);

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-20">
      <div className="p-4 sticky top-0 bg-[#121212] z-10 flex items-center gap-3 border-b border-[#333]">
         <button onClick={() => navigate(-1)}><ChevronLeft size={24}/></button>
         <h1 className="text-lg font-bold">구매내역</h1>
      </div>

      <div className="p-4 space-y-4">
         {myPurchases.length === 0 ? (
             <div className="text-center py-20 text-gray-500">
                 구매한 내역이 없습니다.
             </div>
         ) : (
             myPurchases.map(p => (
                 <div key={p.id} className="bg-[#222] rounded-lg p-3 flex gap-3 border border-[#333]" onClick={() => navigate(p.type === 'AUCTION' ? `/auction/${p.id}` : `/shop/${p.id}`)}>
                    <div className="w-20 h-20 rounded bg-gray-700 overflow-hidden shrink-0 relative">
                        <img src={p.image} className="w-full h-full object-cover"/>
                        <div className="absolute top-0 left-0 bg-goblin-red text-[10px] px-1 font-bold">구매완료</div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="text-sm font-medium line-clamp-2 mb-1">{p.title}</div>
                        <div className="text-xs text-gray-500 mb-2">{p.type === 'AUCTION' ? '낙찰' : '즉시구매'}</div>
                        <div className="font-bold text-lg text-treasure-gold">{p.currentPrice.toLocaleString()}원</div>
                    </div>
                 </div>
             ))
         )}
      </div>
    </div>
  );
};