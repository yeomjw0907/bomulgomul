import React from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/mockStore';
import { ChevronLeft } from 'lucide-react';
import { ProductStatus, ProductType } from '../types';

export const MyBids: React.FC = () => {
  const navigate = useNavigate();
  const user = store.getCurrentUser();
  
  if (!user) return null;

  // Products where I have placed at least one bid and are still active
  const myBids = store.getProducts().filter(p => 
      p.type === ProductType.AUCTION && 
      p.status === ProductStatus.ACTIVE &&
      p.bids.some(bid => bid.bidderId === user.id)
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-20">
      <div className="p-4 sticky top-0 bg-[#121212] z-10 flex items-center gap-3 border-b border-[#333]">
         <button onClick={() => navigate(-1)}><ChevronLeft size={24}/></button>
         <h1 className="text-lg font-bold">입찰 참여 내역</h1>
      </div>

      <div className="p-4 space-y-4">
         {myBids.length === 0 ? (
             <div className="text-center py-20 text-gray-500">
                 참여 중인 경매가 없습니다.
             </div>
         ) : (
             myBids.map(p => {
                 const myLastBid = [...p.bids].reverse().find(b => b.bidderId === user.id);
                 const isTopBidder = p.bids[p.bids.length - 1].bidderId === user.id;

                 return (
                    <div key={p.id} className="bg-[#222] rounded-lg p-3 flex gap-3 border border-[#333]" onClick={() => navigate(`/auction/${p.id}`)}>
                        <div className="w-20 h-20 rounded bg-gray-700 overflow-hidden shrink-0 relative">
                            <img src={p.image} className="w-full h-full object-cover"/>
                            {isTopBidder && <div className="absolute bottom-0 w-full bg-green-600 text-[9px] text-center font-bold">현재 최고가</div>}
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="text-sm font-medium line-clamp-1 mb-1">{p.title}</div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs text-gray-500">내 입찰가</div>
                                    <div className="font-bold text-gray-300">{myLastBid?.amount.toLocaleString()}원</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">현재가</div>
                                    <div className="font-bold text-goblin-red">{p.currentPrice.toLocaleString()}원</div>
                                </div>
                            </div>
                        </div>
                    </div>
                 );
             })
         )}
      </div>
    </div>
  );
};