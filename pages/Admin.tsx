import React, { useState } from 'react';
import { store } from '../services/mockStore';
import { Trash2, TrendingUp, ShoppingBag, Users, AlertCircle } from 'lucide-react';
import { UserRole, ProductType, ProductStatus } from '../types';

export const Admin: React.FC = () => {
  const user = store.getCurrentUser();
  const [products, setProducts] = useState(store.getProducts());

  if (user?.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 text-antique-white">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center text-red-500 mb-6">
           <AlertCircle size={40}/>
        </div>
        <h2 className="text-2xl font-black mb-2">접근 권한이 없습니다</h2>
        <p className="text-gray-400 mb-6">이 페이지는 관리자만 접근할 수 있습니다.</p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if(confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      store.deleteProduct(id);
      setProducts([...store.getProducts()]);
    }
  };

  const activeAuctions = products.filter(p => p.type === ProductType.AUCTION && p.status === ProductStatus.ACTIVE).length;
  const activeShopItems = products.filter(p => p.type === ProductType.SHOP && p.status === ProductStatus.ACTIVE).length;
  const totalValue = products.reduce((acc, curr) => acc + curr.currentPrice, 0);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center text-antique-white">
        <div>
          <h1 className="text-3xl font-heading text-antique-white">관리자 대시보드</h1>
          <p className="text-gray-400 mt-1">도깨비 장터 현황판</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#2C2C2C]">
         <div className="bg-antique-white p-6 rounded-lg shadow-sm border border-gray-300 flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-red-100 text-goblin-red flex items-center justify-center">
               <TrendingUp size={28}/>
            </div>
            <div>
               <p className="text-sm font-bold text-gray-400">진행 중인 경매</p>
               <p className="text-2xl font-black">{activeAuctions}개</p>
            </div>
         </div>
         <div className="bg-antique-white p-6 rounded-lg shadow-sm border border-gray-300 flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
               <ShoppingBag size={28}/>
            </div>
            <div>
               <p className="text-sm font-bold text-gray-400">판매 중인 상품</p>
               <p className="text-2xl font-black">{activeShopItems}개</p>
            </div>
         </div>
         <div className="bg-antique-white p-6 rounded-lg shadow-sm border border-gray-300 flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
               <Users size={28}/>
            </div>
            <div>
               <p className="text-sm font-bold text-gray-400">총 거래 규모</p>
               <p className="text-2xl font-black">{totalValue.toLocaleString()}원</p>
            </div>
         </div>
      </div>
      
      {/* Table Section */}
      <div className="bg-antique-white rounded-lg shadow-sm border border-gray-300 overflow-hidden text-[#2C2C2C]">
        <div className="px-8 py-6 border-b border-gray-300">
           <h3 className="font-bold text-lg">전체 상품 목록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">상품 정보</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">판매자</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">유형</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">현재가</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody className="bg-antique-white divide-y divide-gray-200">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                           <img src={p.image} alt="" className="w-full h-full object-cover"/>
                        </div>
                        <div>
                           <div className="text-sm font-bold text-[#2C2C2C]">{p.title}</div>
                           <div className="text-xs text-gray-400">{p.category}</div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">{p.sellerName}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.type === ProductType.AUCTION ? 'bg-red-100 text-goblin-red' : 'bg-blue-100 text-blue-700'}`}>
                        {p.type === ProductType.AUCTION ? '경매' : '쇼핑'}
                     </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-[#2C2C2C]">{p.currentPrice.toLocaleString()}원</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                     <span className={`flex items-center gap-1.5 text-xs font-bold ${p.status === ProductStatus.ACTIVE ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${p.status === ProductStatus.ACTIVE ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        {p.status}
                     </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};