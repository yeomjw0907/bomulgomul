import React, { useState } from 'react';
import { store } from '../services/mockStore';
import { Trash2, TrendingUp, ShoppingBag, Users, AlertCircle } from 'lucide-react';
import { UserRole, ProductType, ProductStatus } from '../types';

export const Admin: React.FC = () => {
  const user = store.getCurrentUser();
  const [products, setProducts] = useState(store.getProducts());

  if (user?.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6">
           <AlertCircle size={40}/>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">접근 권한이 없습니다</h2>
        <p className="text-gray-500 mb-6">이 페이지는 관리자만 접근할 수 있습니다.<br/>상단 메뉴의 Demo Mode에서 역할을 '관리자'로 변경해보세요.</p>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">관리자 대시보드</h1>
          <p className="text-gray-500 mt-1">플랫폼의 모든 상품과 경매 현황을 관리합니다.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
               <TrendingUp size={28}/>
            </div>
            <div>
               <p className="text-sm font-bold text-gray-400">진행 중인 경매</p>
               <p className="text-2xl font-black text-slate-900">{activeAuctions}개</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
               <ShoppingBag size={28}/>
            </div>
            <div>
               <p className="text-sm font-bold text-gray-400">판매 중인 상품</p>
               <p className="text-2xl font-black text-slate-900">{activeShopItems}개</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
               <Users size={28}/>
            </div>
            <div>
               <p className="text-sm font-bold text-gray-400">총 거래 규모</p>
               <p className="text-2xl font-black text-slate-900">{totalValue.toLocaleString()}원</p>
            </div>
         </div>
      </div>
      
      {/* Table Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100">
           <h3 className="font-bold text-lg text-slate-900">전체 상품 목록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">상품 정보</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">판매자</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">유형</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">현재가</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                           <img src={p.image} alt="" className="w-full h-full object-cover"/>
                        </div>
                        <div>
                           <div className="text-sm font-bold text-slate-900">{p.title}</div>
                           <div className="text-xs text-gray-400">{p.category}</div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">{p.sellerName}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.type === ProductType.AUCTION ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {p.type === ProductType.AUCTION ? '경매' : '쇼핑'}
                     </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-900">{p.currentPrice.toLocaleString()}원</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                     <span className={`flex items-center gap-1.5 text-xs font-bold ${p.status === ProductStatus.ACTIVE ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${p.status === ProductStatus.ACTIVE ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        {p.status}
                     </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(p.id)} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
           <div className="p-12 text-center text-gray-400 text-sm">등록된 상품이 없습니다.</div>
        )}
      </div>
    </div>
  );
};