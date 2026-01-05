import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/mockStore';
import { ProductType, ProductStatus, DeliveryMethod, CATEGORIES, Product, UserRole } from '../types';
import { Camera, HelpCircle, AlertCircle, Gavel, ShoppingBag, Truck, Package } from 'lucide-react';

export const PostItem: React.FC = () => {
  const navigate = useNavigate();
  const user = store.getCurrentUser();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    startPrice: 0,
    type: ProductType.AUCTION,
    deliveryMethod: DeliveryMethod.PARCEL,
    image: 'https://picsum.photos/400/300' // Default dummy image
  });

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">로그인이 필요합니다</h2>
        <button onClick={() => navigate('/login')} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition">로그인하러 가기</button>
      </div>
    );
  }

  // Allow sellers and admins
  if (user.role === UserRole.BUYER) {
     return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6">
            <AlertCircle size={40}/>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">판매자 권한이 필요합니다</h2>
          <p className="text-gray-500 mb-6">구매자 계정으로는 상품을 등록할 수 없습니다.<br/>Demo Mode에서 '판매자'로 전환하여 체험해보세요.</p>
        </div>
     );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.startPrice <= 0) {
      alert('가격은 0원보다 커야 합니다.');
      return;
    }

    const newProduct: Product = {
      id: 'p' + Date.now(),
      sellerId: user.id,
      sellerName: user.name,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      image: formData.image,
      type: formData.type,
      status: ProductStatus.ACTIVE,
      startPrice: Number(formData.startPrice),
      currentPrice: Number(formData.startPrice),
      createdAt: Date.now(),
      endsAt: Date.now() + 86400000 * 30, // 30 days
      bids: [],
      deliveryMethod: formData.deliveryMethod
    };

    store.addProduct(newProduct);
    alert('상품이 성공적으로 등록되었습니다!');
    navigate(formData.type === ProductType.AUCTION ? '/auctions' : '/shop');
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
         <h1 className="text-3xl font-black text-slate-900">상품 등록하기</h1>
         <p className="text-gray-500 mt-1">새로운 보물을 등록하여 판매를 시작해보세요.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
        {/* Type Selection */}
        <div className="space-y-3">
           <label className="text-sm font-bold text-gray-700 ml-1">판매 방식</label>
           <div className="grid grid-cols-2 gap-4">
            <label className={`cursor-pointer border-2 rounded-2xl p-6 text-center transition-all ${formData.type === ProductType.AUCTION ? 'border-amber-500 bg-amber-50/50' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}>
              <input 
                type="radio" 
                name="type" 
                className="hidden"
                checked={formData.type === ProductType.AUCTION}
                onChange={() => setFormData({...formData, type: ProductType.AUCTION})}
              />
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${formData.type === ProductType.AUCTION ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                 <Gavel size={24}/>
              </div>
              <span className={`block font-bold text-lg mb-1 ${formData.type === ProductType.AUCTION ? 'text-amber-900' : 'text-gray-500'}`}>경매로 팔기</span>
              <span className="text-xs text-gray-400">가격 상승 유도, 30일 후 마감</span>
            </label>
            <label className={`cursor-pointer border-2 rounded-2xl p-6 text-center transition-all ${formData.type === ProductType.SHOP ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}>
              <input 
                type="radio" 
                name="type" 
                className="hidden"
                checked={formData.type === ProductType.SHOP}
                onChange={() => setFormData({...formData, type: ProductType.SHOP})}
              />
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${formData.type === ProductType.SHOP ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                 <ShoppingBag size={24}/>
              </div>
              <span className={`block font-bold text-lg mb-1 ${formData.type === ProductType.SHOP ? 'text-blue-900' : 'text-gray-500'}`}>고정가로 팔기</span>
              <span className="text-xs text-gray-400">지정된 가격에 즉시 판매</span>
            </label>
          </div>
        </div>

        {/* Image Upload (Mock) */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 ml-1">상품 사진</label>
          <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-amber-300 hover:text-amber-500 transition-all cursor-pointer group">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
               <Camera size={32} />
            </div>
            <span className="font-bold text-sm">클릭하여 사진 업로드</span>
            <span className="text-xs mt-1 text-gray-400">(데모 버전에서는 랜덤 이미지가 적용됩니다)</span>
            <input type="file" className="hidden" /> 
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">카테고리</label>
            <div className="relative">
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none font-medium cursor-pointer"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">
              {formData.type === ProductType.AUCTION ? '경매 시작가' : '판매 가격'}
            </label>
            <div className="relative">
               <input 
                type="number" 
                required
                min="0"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-3 outline-none focus:ring-2 focus:ring-amber-500/50 font-bold"
                value={formData.startPrice}
                onChange={e => setFormData({...formData, startPrice: Number(e.target.value)})}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">원</span>
            </div>
          </div>
        </div>

        {formData.type === ProductType.AUCTION && (
            <div className="bg-amber-50 p-4 rounded-2xl flex items-start gap-3 text-sm text-amber-800 border border-amber-100">
               <HelpCircle size={18} className="shrink-0 mt-0.5"/> 
               <div>
                  <p className="font-bold">경매 설정 안내</p>
                  <p className="opacity-80 mt-1">상한가(즉시 낙찰가)는 시작가의 10배인 <strong>{(formData.startPrice * 10).toLocaleString()}원</strong>으로 자동 설정됩니다.</p>
               </div>
            </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">상품명</label>
          <input 
            type="text" 
            required
            placeholder="상품명을 입력하세요"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/50 font-medium"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">상품 설명</label>
          <textarea 
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/50 h-40 resize-none leading-relaxed"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="상품의 상태, 구매 시기, 하자 여부 등을 자세히 적어주세요."
          ></textarea>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 ml-1">배송 방법</label>
          <div className="grid grid-cols-2 gap-4">
             <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.deliveryMethod === DeliveryMethod.PARCEL ? 'border-gray-800 bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input 
                  type="radio" 
                  checked={formData.deliveryMethod === DeliveryMethod.PARCEL}
                  onChange={() => setFormData({...formData, deliveryMethod: DeliveryMethod.PARCEL})}
                  className="w-4 h-4 accent-slate-900"
                />
                <Truck size={20} className="text-gray-500"/>
                <span className="font-medium text-slate-900">택배 (착불/선불)</span>
             </label>
             <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.deliveryMethod === DeliveryMethod.PICKUP ? 'border-gray-800 bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input 
                  type="radio" 
                  checked={formData.deliveryMethod === DeliveryMethod.PICKUP}
                  onChange={() => setFormData({...formData, deliveryMethod: DeliveryMethod.PICKUP})}
                  className="w-4 h-4 accent-slate-900"
                />
                <Package size={20} className="text-gray-500"/>
                <span className="font-medium text-slate-900">직접 거래 (무료)</span>
             </label>
          </div>
        </div>

        <div className="pt-4">
            <button type="submit" className="w-full bg-slate-900 text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:-translate-y-1 transition-all active:translate-y-0">
            상품 등록 완료
            </button>
        </div>
      </form>
    </div>
  );
};