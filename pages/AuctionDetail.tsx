import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { store } from '../services/mockStore';
import { Product, ProductStatus } from '../types';
import { ChevronLeft, Share, MoreVertical, Heart, X, Minus, Plus } from 'lucide-react';

export const AuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(store.getProductById(id!));
  const [now, setNow] = useState(Date.now());
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(0);

  const currentUser = store.getCurrentUser();
  const isSeller = currentUser && product && currentUser.id === product.sellerId;

  // Real-time updates
  useEffect(() => {
    const unsubscribe = store.subscribe((event) => {
      if (event.productId === id && event.product) {
        setProduct(event.product);
      }
    });
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [id]);

  useEffect(() => {
    if(product) setBidAmount(product.currentPrice + 1000);
  }, [product?.currentPrice]);

  if (!product) return <div className="p-10 text-center text-gray-500">존재하지 않는 상품입니다.</div>;

  const handlePlaceBid = () => {
      if (!currentUser) {
          alert('로그인이 필요합니다.');
          navigate('/login');
          return;
      }
      if (isSeller) {
          alert('판매자는 본인의 상품에 입찰할 수 없습니다.');
          return;
      }
      
      const result = store.placeBid(product.id, bidAmount, currentUser);
      if(result.success) {
          alert(result.message);
          setIsBidModalOpen(false);
      } else {
          alert(result.message);
      }
  };

  const adjustBid = (amount: number) => {
      setBidAmount(prev => Math.max(product.currentPrice + 1000, prev + amount));
  };

  // Sort bids newest first
  const sortedBids = [...product.bids].sort((a,b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-white pb-24 md:pb-10 relative min-h-screen">
      {/* Mobile Header (Transparent/Absolute) */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center md:hidden">
          <button onClick={() => navigate(-1)} className="text-white drop-shadow-md bg-black/20 p-2 rounded-full backdrop-blur-sm"><ChevronLeft size={24} /></button>
          <div className="flex gap-4 text-white drop-shadow-md">
             <button className="bg-black/20 p-2 rounded-full backdrop-blur-sm"><Share size={20} /></button>
             <button className="bg-black/20 p-2 rounded-full backdrop-blur-sm"><MoreVertical size={20} /></button>
          </div>
      </div>

      {/* Product Image */}
      <div className="w-full aspect-square md:aspect-video bg-gray-200 relative">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          {product.status !== ProductStatus.ACTIVE && (
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-3xl border-4 border-white p-4 rounded-xl transform -rotate-12">
                    {product.status === ProductStatus.SOLD ? '낙찰완료' : '경매종료'}
                </span>
             </div>
          )}
      </div>

      <div className="max-w-4xl mx-auto md:mt-8 md:px-4">
        {/* Simple Seller Info */}
        <div className="px-4 py-4 md:px-0 flex items-center border-b border-gray-100">
           <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden mr-3">
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">{product.sellerName[0]}</div>
           </div>
           <div>
              <div className="font-bold text-slate-900">{product.sellerName}</div>
              <div className="text-xs text-gray-400">판매자 · {new Date(product.createdAt).toLocaleDateString()} 등록</div>
           </div>
        </div>

        {/* Pricing Transparency Section (New) */}
        {product.type === 'AUCTION' && (
            <div className="px-4 py-6 md:px-0 bg-slate-50 border-b border-gray-100">
                <h3 className="font-bold text-slate-900 mb-3 text-sm">💰 투명 가격 정보</h3>
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-3 rounded-xl border border-gray-200 text-center shadow-sm">
                        <div className="text-[10px] text-gray-400 mb-1">정가 (원가)</div>
                        <div className="font-bold text-slate-700 text-sm">{product.originalPrice ? `${product.originalPrice.toLocaleString()}원` : '-'}</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-200 text-center shadow-sm">
                        <div className="text-[10px] text-gray-400 mb-1">매입가</div>
                        <div className="font-bold text-slate-700 text-sm">{product.costPrice ? `${product.costPrice.toLocaleString()}원` : '-'}</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-amber-200 text-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-amber-100 rounded-bl-full -mr-2 -mt-2"></div>
                        <div className="text-[10px] text-amber-600 font-bold mb-1 relative z-10">전문가 감정가</div>
                        <div className="font-black text-amber-600 text-sm relative z-10">{product.appraisedValue ? `${product.appraisedValue.toLocaleString()}원` : '-'}</div>
                    </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">* 보물고물 전문 감정단이 검수한 투명한 가격정보입니다.</p>
            </div>
        )}

        {/* Product Content */}
        <div className="p-4 md:px-0 border-b border-gray-100">
           <h1 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{product.title}</h1>
           <div className="text-sm text-gray-500 mb-6">{product.category}</div>
           
           <div className="prose prose-slate text-gray-700 whitespace-pre-line leading-relaxed mb-6">
              {product.description}
           </div>

           <div className="flex gap-4 text-xs text-gray-400 font-medium">
              <span>조회 {Math.floor(Math.random() * 500)}</span>
              <span>관심 {Math.floor(Math.random() * 50)}</span>
           </div>
        </div>

        {/* Bid History Section */}
        <div className="p-4 md:px-0">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                입찰 기록 <span className="text-amber-500">{sortedBids.length}건</span>
            </h3>
            
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 max-h-60 overflow-y-auto">
                {sortedBids.length > 0 ? (
                    sortedBids.map((bid, idx) => (
                        <div key={bid.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {idx + 1}
                                </span>
                                <span className={`font-medium ${idx === 0 ? 'text-slate-900' : 'text-gray-500'}`}>
                                    {bid.bidderName}
                                    {bid.bidderId === currentUser?.id && <span className="text-[10px] text-amber-600 ml-1">(나)</span>}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-slate-900">{bid.amount.toLocaleString()}원</div>
                                <div className="text-[10px] text-gray-400">
                                    {new Date(bid.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 text-gray-400 text-sm">
                        아직 입찰자가 없습니다.<br/>첫 번째 주인공이 되어보세요!
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 pb-safe z-40 md:sticky md:bottom-0 md:border md:rounded-xl md:shadow-lg md:mx-4 md:mb-4 md:max-w-4xl md:mx-auto">
         <div className="flex items-center justify-between max-w-4xl mx-auto px-2">
             <div className="flex items-center gap-4">
                 <button className="flex flex-col items-center justify-center text-gray-400 px-2 border-r border-gray-200 pr-4 hover:text-rose-500 transition">
                    <Heart size={24} />
                    <span className="text-[10px]">관심</span>
                 </button>
                 <div>
                    <div className="text-[10px] text-gray-500 font-bold">현재 최고가</div>
                    <div className="font-black text-xl text-slate-900">{product.currentPrice.toLocaleString()}원</div>
                 </div>
             </div>
             
             {isSeller ? (
                <button className="bg-gray-200 text-gray-500 font-bold px-8 py-3 rounded-xl text-sm cursor-not-allowed">
                   내 상품
                </button>
             ) : (
                <button 
                  onClick={() => setIsBidModalOpen(true)}
                  disabled={product.status !== ProductStatus.ACTIVE}
                  className={`font-bold px-8 py-3 rounded-xl text-base transition-all shadow-lg transform active:scale-95 ${product.status === ProductStatus.ACTIVE ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30' : 'bg-gray-300 text-gray-500 shadow-none'}`}
                >
                   {product.status === ProductStatus.ACTIVE ? '입찰하기' : '종료됨'}
                </button>
             )}
         </div>
      </div>

      {/* Bid Modal / Bottom Sheet */}
      {isBidModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsBidModalOpen(false)}></div>
              <div className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 z-10 animate-in slide-in-from-bottom-full duration-300">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-900">입찰하기</h3>
                      <button onClick={() => setIsBidModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
                  </div>

                  <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-500 mb-2">입찰 희망가 (현재가 {product.currentPrice.toLocaleString()}원)</label>
                      <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(Number(e.target.value))}
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-8">
                      <button onClick={() => adjustBid(1000)} className="py-3 rounded-xl bg-amber-50 text-amber-700 font-bold text-sm hover:bg-amber-100 transition border border-amber-100">+ 1천원</button>
                      <button onClick={() => adjustBid(5000)} className="py-3 rounded-xl bg-amber-50 text-amber-700 font-bold text-sm hover:bg-amber-100 transition border border-amber-100">+ 5천원</button>
                      <button onClick={() => adjustBid(10000)} className="py-3 rounded-xl bg-amber-50 text-amber-700 font-bold text-sm hover:bg-amber-100 transition border border-amber-100">+ 1만원</button>
                  </div>

                  <button 
                    onClick={handlePlaceBid}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl text-lg hover:bg-slate-800 transition shadow-xl"
                  >
                      입찰 확정
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};