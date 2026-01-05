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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 text-antique-white">
        <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
        <button onClick={() => navigate('/login')} className="bg-goblin-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition">로그인하러 가기</button>
      </div>
    );
  }

  // Role restriction removed - Everyone can buy and sell now.

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
    alert('물건이 등록되었습니다!');
    navigate(formData.type === ProductType.AUCTION ? '/auctions' : '/shop');
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 text-[#2C2C2C]">
      <div className="mb-8">
         <h1 className="text-3xl font-heading font-black text-antique-white">물건 등록하기</h1>
         <p className="text-gray-400 mt-1">도깨비 장터에 내놓을 보물을 등록하세요.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-antique-white p-8 md:p-10 rounded-lg shadow-lg border border-gray-300">
        {/* Type Selection */}
        <div className="space-y-3">
           <label className="text-sm font-bold text-gray-700 ml-1">판매 방식</label>
           <div className="grid grid-cols-2 gap-4">
            <label className={`cursor-pointer border-2 rounded-lg p-6 text-center transition-all ${formData.type === ProductType.AUCTION ? 'border-goblin-red bg-red-50' : 'border-gray-300 hover:border-gray-400 hover:bg-white'}`}>
              <input 
                type="radio" 
                name="type" 
                className="hidden"
                checked={formData.type === ProductType.AUCTION}
                onChange={() => setFormData({...formData, type: ProductType.AUCTION})}
              />
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${formData.type === ProductType.AUCTION ? 'bg-red-100 text-goblin-red' : 'bg-gray-200 text-gray-400'}`}>
                 <Gavel size={24}/>
              </div>
              <span className={`block font-bold text-lg mb-1 ${formData.type === ProductType.AUCTION ? 'text-goblin-red' : 'text-gray-500'}`}>경매로 팔기</span>
              <span className="text-xs text-gray-400">가격 상승 유도, 30일 후 마감</span>
            </label>
            <label className={`cursor-pointer border-2 rounded-lg p-6 text-center transition-all ${formData.type === ProductType.SHOP ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-white'}`}>
              <input 
                type="radio" 
                name="type" 
                className="hidden"
                checked={formData.type === ProductType.SHOP}
                onChange={() => setFormData({...formData, type: ProductType.SHOP})}
              />
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${formData.type === ProductType.SHOP ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
                 <ShoppingBag size={24}/>
              </div>
              <span className={`block font-bold text-lg mb-1 ${formData.type === ProductType.SHOP ? 'text-blue-800' : 'text-gray-500'}`}>고정가로 팔기</span>
              <span className="text-xs text-gray-400">지정된 가격에 즉시 판매</span>
            </label>
          </div>
        </div>

        {/* Image Upload (Mock) */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 ml-1">상품 사진</label>
          <div className="border-2 border-dashed border-gray-400 rounded-lg p-12 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-goblin-red hover:text-goblin-red transition-all cursor-pointer group">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
               <Camera size={32} />
            </div>
            <span className="font-bold text-sm">클릭하여 사진 업로드</span>
            <input type="file" className="hidden" /> 
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">카테고리</label>
            <div className="relative">
              <select 
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-goblin-red appearance-none font-medium cursor-pointer"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
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
                className="w-full bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-3 outline-none focus:ring-2 focus:ring-goblin-red font-bold"
                value={formData.startPrice}
                onChange={e => setFormData({...formData, startPrice: Number(e.target.value)})}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">원</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">상품명</label>
          <input 
            type="text" 
            required
            placeholder="상품명을 입력하세요"
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-goblin-red font-medium"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">상품 설명</label>
          <textarea 
            required
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-goblin-red h-40 resize-none leading-relaxed"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="상품의 상태, 구매 시기, 하자 여부 등을 자세히 적어주세요."
          ></textarea>
        </div>

        <div className="pt-4">
            <button type="submit" className="w-full bg-goblin-red text-white font-black text-lg py-5 rounded-lg shadow-xl shadow-red-900/20 hover:bg-red-800 transition-all">
            등록 완료
            </button>
        </div>
      </form>
    </div>
  );
};