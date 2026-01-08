import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { store } from '../services/mockStore';
import { ProductStatus } from '../types';
import { Package, Truck, ShieldCheck, Check, ChevronLeft, Heart, Star, ShoppingBag, ArrowRight, Siren } from 'lucide-react';
import { PaymentModal } from '../components/PaymentModal';
import { ReportModal } from '../components/ReportModal';

export const ShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = store.getProductById(id!);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const user = store.getCurrentUser();

  if (!product) return <div>Product not found</div>;

  const handleBuy = async () => {
     if (!user) {
         alert('로그인이 필요합니다.');
         navigate('/login');
         return;
     }
     const success = store.buyNow(product.id, user.id);
     if (success) {
         alert('구매가 완료되었습니다!');
         navigate('/shop');
     }
  };

  return (
    <div className="min-h-screen bg-vintage-charcoal pb-24 md:pb-12 text-gray-200 relative">
        
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between p-4 sticky top-0 bg-[#1a1a1a]/90 backdrop-blur-md z-40 border-b border-white/5">
            <button onClick={() => navigate(-1)} className="text-white"><ChevronLeft size={24}/></button>
            <div className="flex gap-4">
                <button onClick={() => setIsReportModalOpen(true)} className="text-gray-400 hover:text-red-400"><Siren size={24}/></button>
                <button className="text-white"><Heart size={24}/></button>
            </div>
        </div>

        <div className="max-w-7xl mx-auto md:pt-10 px-0 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
                
                {/* Left: Visuals */}
                <div className="space-y-6">
                    <div className="w-full aspect-square bg-[#1a1a1a] md:rounded-3xl overflow-hidden relative group border border-white/5 shadow-2xl">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        
                        {/* Sold Out Overlay */}
                        {product.status === ProductStatus.SOLD && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm z-10">
                                <span className="text-gray-500 font-heading text-4xl font-black border-4 border-gray-500 px-6 py-3 rounded-lg transform -rotate-12">SOLD OUT</span>
                            </div>
                        )}
                        
                        {/* Category Tag on Image */}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                            {product.category}
                        </div>
                    </div>
                    
                    {/* Trust Badges */}
                    <div className="hidden md:grid grid-cols-2 gap-4">
                        <div className="bg-[#252525] p-5 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-treasure-gold/30 transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-treasure-gold group-hover:scale-110 transition-transform">
                                <ShieldCheck size={24}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">100% 정품 보증</h4>
                                <p className="text-xs text-gray-500 mt-0.5">전문 감정사의 철저한 검수 완료</p>
                            </div>
                        </div>
                        <div className="bg-[#252525] p-5 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-treasure-gold/30 transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-treasure-gold group-hover:scale-110 transition-transform">
                                <Truck size={24}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">도깨비 안심 배송</h4>
                                <p className="text-xs text-gray-500 mt-0.5">파손 시 100% 환불 책임 보장</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="px-5 md:px-0 py-4 flex flex-col justify-center h-full">
                    
                    {/* Desktop Back & Report */}
                    <div className="hidden md:flex justify-between items-center mb-6">
                        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition">
                            <ChevronLeft size={16}/> 목록으로
                        </button>
                        <button onClick={() => setIsReportModalOpen(true)} className="text-gray-500 hover:text-red-400 flex items-center gap-1.5 text-xs font-bold transition">
                             <Siren size={14}/> 신고하기
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-bold text-treasure-gold px-2 py-1 bg-treasure-gold/10 rounded border border-treasure-gold/20 flex items-center gap-1">
                            <Check size={10} strokeWidth={4}/> Verified Item
                        </span>
                        <div className="h-1 w-1 rounded-full bg-gray-600"></div>
                        <span className="text-xs font-medium text-gray-400">판매자: {product.sellerName}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-8 leading-tight">
                        {product.title}
                    </h1>

                    {/* Price Block */}
                    <div className="bg-[#1e1e1e] p-8 rounded-3xl border border-white/5 mb-8 shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-treasure-gold/5 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="flex justify-between items-end mb-2 relative z-10">
                             <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Selling Price</span>
                             {product.originalPrice && (
                                 <span className="text-sm text-gray-600 line-through font-medium">
                                     {product.originalPrice.toLocaleString()}원
                                 </span>
                             )}
                        </div>
                        <div className="flex items-baseline gap-1 relative z-10">
                            <span className="text-5xl font-black text-white tracking-tight">
                                {product.currentPrice.toLocaleString()}
                            </span>
                            <span className="text-xl font-bold text-treasure-gold">KRW</span>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400 font-medium">
                             <ShoppingBag size={14} className="text-gray-500"/>
                             <span>최대 6개월 무이자 할부 가능</span>
                        </div>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none text-gray-400 mb-10 leading-relaxed whitespace-pre-line border-l-2 border-gray-700 pl-6">
                        {product.description}
                    </div>

                    {/* Action Area */}
                    <div className="space-y-4">
                        <div className="flex gap-4 h-16">
                           <button className="w-16 h-full flex items-center justify-center rounded-2xl border border-gray-600 hover:border-white text-gray-400 hover:text-white transition bg-[#252525]">
                               <Heart size={28} strokeWidth={2}/>
                           </button>
                           <button 
                              onClick={() => setIsPaymentOpen(true)}
                              disabled={product.status !== ProductStatus.ACTIVE}
                              className="flex-1 bg-gradient-to-r from-goblin-red to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold text-xl rounded-2xl shadow-lg shadow-red-900/30 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none flex items-center justify-center gap-3"
                           >
                              {product.status === ProductStatus.ACTIVE ? (
                                  <><span>구매하기</span> <ArrowRight size={24}/></>
                              ) : (
                                  '품절된 상품입니다'
                              )}
                           </button>
                        </div>
                        <p className="text-center text-xs text-gray-500 font-medium">
                            * 안전 결제 시스템(Escrow)을 통해 거래가 보호됩니다.
                        </p>
                    </div>

                    {/* Mobile Trust Badges (Horizontal Scroll) */}
                    <div className="md:hidden mt-10 overflow-x-auto thin-scrollbar pb-2 -mx-5 px-5">
                         <div className="flex gap-4 min-w-max">
                             <div className="bg-[#252525] p-4 rounded-xl border border-white/5 flex items-center gap-3 w-72">
                                 <ShieldCheck className="text-treasure-gold shrink-0" size={28}/>
                                 <div><div className="font-bold text-sm text-white">100% 정품 보증</div><div className="text-[10px] text-gray-500 mt-0.5">가품 확인 시 200% 책임 보상</div></div>
                             </div>
                             <div className="bg-[#252525] p-4 rounded-xl border border-white/5 flex items-center gap-3 w-72">
                                 <Truck className="text-treasure-gold shrink-0" size={28}/>
                                 <div><div className="font-bold text-sm text-white">안심 배송 서비스</div><div className="text-[10px] text-gray-500 mt-0.5">배송 중 파손 책임 보장</div></div>
                             </div>
                         </div>
                    </div>

                </div>
            </div>
        </div>
        
        <PaymentModal 
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            amount={product.currentPrice}
            onConfirm={async () => {
               await new Promise(r => setTimeout(r, 1500));
               handleBuy();
            }}
        />

        <ReportModal 
            isOpen={isReportModalOpen} 
            onClose={() => setIsReportModalOpen(false)}
            targetId={product.id}
            targetType="PRODUCT"
            targetName={product.title}
        />
    </div>
  );
};