import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { store } from '../services/mockStore';
import { ProductStatus } from '../types';
import { Package, Truck, ShieldCheck, Check } from 'lucide-react';
import { PaymentModal } from '../components/PaymentModal';

export const ShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = store.getProductById(id!);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
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
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 pb-20">
        <div className="space-y-6">
           <div className="aspect-square bg-gray-100 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
               <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
                 <ShieldCheck className="mx-auto text-blue-600 mb-2" size={24}/>
                 <p className="text-xs font-bold text-blue-900">100% 정품 보장</p>
                 <p className="text-[10px] text-blue-700">전문가 검수 완료</p>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl text-center border border-green-100">
                 <Truck className="mx-auto text-green-600 mb-2" size={24}/>
                 <p className="text-xs font-bold text-green-900">안심 배송</p>
                 <p className="text-[10px] text-green-700">파손 시 전액 환불</p>
              </div>
           </div>
        </div>
        
        <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
                 <div className="flex items-center gap-3">
                     <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm shadow-blue-200">인증 상품</span>
                     <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-bold border border-gray-200">{product.category}</span>
                 </div>
                 <h1 className="text-4xl font-black text-slate-900 leading-tight">{product.title}</h1>
                 <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="py-8 border-y border-gray-100">
                <p className="text-sm font-bold text-gray-400 mb-1">판매 가격</p>
                <div className="text-5xl font-black text-slate-900 tracking-tight">
                    {product.currentPrice.toLocaleString()}<span className="text-2xl font-bold text-gray-400 ml-1">원</span>
                </div>
            </div>

            <div className="space-y-4">
               <button 
                  onClick={() => setIsPaymentOpen(true)}
                  disabled={product.status !== ProductStatus.ACTIVE}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:bg-gray-300 disabled:shadow-none disabled:transform-none"
              >
                  {product.status === ProductStatus.ACTIVE ? '즉시 구매하기' : '품절되었습니다'}
              </button>
              
              <div className="text-center">
                 <p className="text-xs text-gray-400">
                    * 구매 즉시 결제가 진행되며, 배송은 영업일 기준 2-3일 소요됩니다.
                 </p>
              </div>
            </div>

            <div className="space-y-3">
               <h4 className="font-bold text-slate-900">구매 혜택</h4>
               <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><Check size={16} className="text-blue-500"/> 보물고물 안전결제 수수료 무료</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-blue-500"/> 가품일 경우 200% 보상</li>
               </ul>
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
    </div>
  );
};
