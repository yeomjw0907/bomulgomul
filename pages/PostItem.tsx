import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../services/mockStore';
import { ProductType, ProductStatus, DeliveryMethod, CATEGORIES, Product } from '../types';
import { Camera, Gavel, ShoppingBag, ChevronLeft } from 'lucide-react';

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
    image: 'https://picsum.photos/400/300' 
  });

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 text-gray-400">
        <h2 className="text-2xl font-bold mb-4 text-white">로그인이 필요합니다</h2>
        <button onClick={() => navigate('/login')} className="bg-goblin-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-800 transition shadow-lg">로그인하러 가기</button>
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
      endsAt: Date.now() + 86400000 * 30,
      bids: [],
      deliveryMethod: formData.deliveryMethod
    };
    store.addProduct(newProduct);
    alert('물건이 등록되었습니다!');
    navigate(formData.type === ProductType.AUCTION ? '/auctions' : '/shop');
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 pt-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 px-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#333] rounded-full text-white transition">
            <ChevronLeft size={24}/>
          </button>
          <h1 className="text-2xl font-heading font-bold text-white">물건 내놓기</h1>
      </div>
      
      {/* Paper Container */}
      <div className="bg-antique-white mx-4 rounded-xl shadow-2xl overflow-hidden relative text-[#2C2C2C]">
         {/* Top Decoration */}
         <div className="h-2 bg-gradient-to-r from-goblin-red via-red-800 to-goblin-red"></div>

         <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
            
            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer rounded-xl p-5 text-center transition-all border-2 relative overflow-hidden group ${formData.type === ProductType.AUCTION ? 'border-goblin-red bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="type" className="hidden" checked={formData.type === ProductType.AUCTION} onChange={() => setFormData({...formData, type: ProductType.AUCTION})}/>
                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${formData.type === ProductType.AUCTION ? 'bg-goblin-red text-white' : 'bg-gray-200 text-gray-400'}`}>
                        <Gavel size={20}/>
                    </div>
                    <span className={`block font-bold text-sm mb-1 ${formData.type === ProductType.AUCTION ? 'text-goblin-red' : 'text-gray-600'}`}>경매로 팔기</span>
                    {formData.type === ProductType.AUCTION && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-goblin-red animate-pulse"></div>}
                </label>

                <label className={`cursor-pointer rounded-xl p-5 text-center transition-all border-2 relative overflow-hidden group ${formData.type === ProductType.SHOP ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="type" className="hidden" checked={formData.type === ProductType.SHOP} onChange={() => setFormData({...formData, type: ProductType.SHOP})}/>
                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${formData.type === ProductType.SHOP ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        <ShoppingBag size={20}/>
                    </div>
                    <span className={`block font-bold text-sm mb-1 ${formData.type === ProductType.SHOP ? 'text-blue-800' : 'text-gray-600'}`}>고정가 판매</span>
                </label>
            </div>

            {/* Photo Upload */}
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">상품 사진</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-goblin-red hover:text-goblin-red transition-colors cursor-pointer bg-white/50">
                    <Camera size={32} className="mb-2 opacity-50"/>
                    <span className="text-xs font-bold">사진 추가하기 (0/10)</span>
                </div>
            </div>

            {/* Title & Category */}
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">제목</label>
                    <input 
                        type="text" 
                        required
                        className="w-full bg-transparent border-b-2 border-gray-200 py-3 text-lg font-bold text-[#2C2C2C] placeholder-gray-300 focus:border-goblin-red focus:outline-none transition-colors rounded-none"
                        placeholder="물건의 이름을 입력해주세요"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">카테고리</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-goblin-red font-medium text-sm"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                            {formData.type === ProductType.AUCTION ? '시작 금액' : '판매 금액'}
                        </label>
                        <div className="relative">
                            <input 
                                type="number" 
                                required
                                min="0"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-8 py-3 outline-none focus:border-goblin-red font-bold text-right tabular-nums"
                                value={formData.startPrice}
                                onChange={e => setFormData({...formData, startPrice: Number(e.target.value)})}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">원</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">상세 설명</label>
                <textarea 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none focus:border-goblin-red min-h-[150px] resize-none leading-relaxed text-sm"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="구매 시기, 사용감, 하자 여부 등 물건에 대한 자세한 이야기를 들려주세요."
                ></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-[#2C2C2C] text-treasure-gold font-bold text-lg py-4 rounded-xl shadow-xl hover:bg-black transition-all transform active:scale-98">
                보물 등록하기
            </button>
         </form>
      </div>
    </div>
  );
};