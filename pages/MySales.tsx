import React from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/mockStore';
import { ChevronLeft } from 'lucide-react';
import { ProductStatus } from '../types';

export const MySales: React.FC = () => {
  const navigate = useNavigate();
  const user = store.getCurrentUser();
  
  if (!user) return null;

  const mySales = store.getProducts().filter(p => p.sellerId === user.id);

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-20">
      <div className="p-4 sticky top-0 bg-[#121212] z-10 flex items-center gap-3 border-b border-[#333]">
         <button onClick={() => navigate(-1)}><ChevronLeft size={24}/></button>
         <h1 className="text-lg font-bold">판매내역</h1>
      </div>

      <div className="p-4 space-y-4">
         {mySales.length === 0 ? (
             <div className="text-center py-20 text-gray-500">
                 판매한 내역이 없습니다.
             </div>
         ) : (
             mySales.map(p => (
                 <div key={p.id} className="bg-[#222] rounded-lg p-3 flex gap-3 border border-[#333]" onClick={() => navigate(p.type === 'AUCTION' ? `/auction/${p.id}` : `/shop/${p.id}`)}>
                    <div className="w-20 h-20 rounded bg-gray-700 overflow-hidden shrink-0 relative">
                        <img src={p.image} className="w-full h-full object-cover"/>
                        {p.status === ProductStatus.SOLD && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs font-bold text-white">판매완료</div>}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="text-sm font-medium line-clamp-2 mb-1">{p.title}</div>
                        <div className="text-xs text-gray-500 mb-2">{new Date(p.createdAt).toLocaleDateString()}</div>
                        <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-0.5 rounded font-bold ${p.status === ProductStatus.ACTIVE ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                                {p.status}
                            </span>
                            <span className="font-bold">{p.currentPrice.toLocaleString()}원</span>
                        </div>
                    </div>
                 </div>
             ))
         )}
      </div>
    </div>
  );
};