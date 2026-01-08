import React, { useState, useEffect } from 'react';
import { store } from '../services/mockStore';
import { Trash2, TrendingUp, ShoppingBag, Users, AlertCircle, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { UserRole, ProductType, ProductStatus, ReportStatus } from '../types';
import { useToast } from '../components/Toast';

export const Admin: React.FC = () => {
  const user = store.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'REPORTS'>('PRODUCTS');
  const [products, setProducts] = useState(store.getProducts());
  const [reports, setReports] = useState(store.getReports());
  const { showToast } = useToast();

  // Subscribe to updates for real-time dashboard
  useEffect(() => {
    // Initial load
    setReports([...store.getReports()]);
    setProducts([...store.getProducts()]);

    const unsubscribe = store.subscribe((event) => {
        if(event.type === 'REPORT_UPDATE') {
            setReports([...store.getReports()]);
            // Optional: If we wanted to notify admin of new report via toast, we could check diff here
        }
        if (event.type === 'BID_UPDATE' || event.type === 'AUCTION_CLOSED') {
            setProducts([...store.getProducts()]);
        }
    });
    return () => unsubscribe();
  }, []);

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
      showToast('상품이 삭제되었습니다.', 'INFO');
    }
  };

  const handleExportExcel = () => {
      const headers = ['ID', '상품명', '판매자', '카테고리', '유형', '현재가', '상태', '등록일'];
      const rows = products.map(p => [
          p.id,
          `"${p.title.replace(/"/g, '""')}"`, // Escape quotes
          p.sellerName,
          p.category,
          p.type,
          p.currentPrice,
          p.status,
          new Date(p.createdAt).toISOString().split('T')[0]
      ]);

      const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bomul_products_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('엑셀 다운로드가 시작되었습니다.', 'SUCCESS');
  };

  const handleReportAction = (id: string, action: 'RESOLVE' | 'DISMISS') => {
      const status = action === 'RESOLVE' ? ReportStatus.RESOLVED : ReportStatus.DISMISSED;
      store.updateReportStatus(id, status);
      showToast(`신고가 ${action === 'RESOLVE' ? '처리(승인)' : '기각'}되었습니다.`, action === 'RESOLVE' ? 'SUCCESS' : 'INFO');
  };

  // Stats Calculation
  const activeAuctions = products.filter(p => p.type === ProductType.AUCTION && p.status === ProductStatus.ACTIVE).length;
  const activeShopItems = products.filter(p => p.type === ProductType.SHOP && p.status === ProductStatus.ACTIVE).length;
  
  // Total Transaction Volume (Sold Items only)
  const soldVolume = products
    .filter(p => p.status === ProductStatus.SOLD)
    .reduce((acc, curr) => acc + curr.currentPrice, 0);

  const pendingReports = reports.filter(r => r.status === ReportStatus.PENDING).length;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center text-antique-white">
        <div>
          <h1 className="text-3xl font-heading text-antique-white">관리자 대시보드</h1>
          <p className="text-gray-400 mt-1">도깨비 장터 현황판</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[#2C2C2C]">
         <div className="bg-antique-white p-5 rounded-lg shadow-sm border border-gray-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-100 text-goblin-red flex items-center justify-center shrink-0">
               <TrendingUp size={24}/>
            </div>
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase">진행 중인 경매</p>
               <p className="text-xl font-black">{activeAuctions}건</p>
            </div>
         </div>
         <div className="bg-antique-white p-5 rounded-lg shadow-sm border border-gray-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
               <ShoppingBag size={24}/>
            </div>
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase">판매 중인 상품</p>
               <p className="text-xl font-black">{activeShopItems}건</p>
            </div>
         </div>
         <div className="bg-antique-white p-5 rounded-lg shadow-sm border border-gray-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
               <Users size={24}/>
            </div>
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase">총 거래 완료 금액</p>
               <p className="text-xl font-black">{soldVolume.toLocaleString()}원</p>
            </div>
         </div>
         <div className="bg-antique-white p-5 rounded-lg shadow-sm border border-gray-300 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center shrink-0">
               <AlertCircle size={24}/>
            </div>
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase">접수된 신고</p>
               <p className={`text-xl font-black ${pendingReports > 0 ? 'text-red-500' : ''}`}>{pendingReports}건</p>
            </div>
         </div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('PRODUCTS')}
            className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'PRODUCTS' ? 'text-treasure-gold border-b-2 border-treasure-gold' : 'text-gray-500 hover:text-gray-300'}`}
          >
              매물 및 거래 관리
          </button>
          <button 
            onClick={() => setActiveTab('REPORTS')}
            className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'REPORTS' ? 'text-treasure-gold border-b-2 border-treasure-gold' : 'text-gray-500 hover:text-gray-300'}`}
          >
              신고 관리 
              {pendingReports > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingReports}</span>}
          </button>
      </div>

      {/* Content Area */}
      {activeTab === 'PRODUCTS' && (
          <div className="bg-antique-white rounded-lg shadow-sm border border-gray-300 overflow-hidden text-[#2C2C2C] animate-in fade-in slide-in-from-bottom-2">
            <div className="px-8 py-6 border-b border-gray-300 flex justify-between items-center">
               <h3 className="font-bold text-lg">전체 상품 목록</h3>
               <button 
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-lg"
               >
                  <FileSpreadsheet size={16}/> Excel 내보내기
               </button>
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
      )}

      {activeTab === 'REPORTS' && (
          <div className="bg-antique-white rounded-lg shadow-sm border border-gray-300 overflow-hidden text-[#2C2C2C] animate-in fade-in slide-in-from-bottom-2">
            <div className="px-8 py-6 border-b border-gray-300">
               <h3 className="font-bold text-lg">신고 접수 현황</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">신고 대상 (ID)</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">유형</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">신고 사유</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">신고자</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">상태</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">처리</th>
                  </tr>
                </thead>
                <tbody className="bg-antique-white divide-y divide-gray-200">
                  {reports.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5 whitespace-nowrap font-mono text-sm font-bold text-gray-700">
                          {r.targetId}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${r.targetType === 'PRODUCT' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                            {r.targetType === 'PRODUCT' ? '매물' : '사용자'}
                         </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700 font-medium break-all max-w-xs">{r.reason}</td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">{r.reporterId}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                          {r.status === ReportStatus.PENDING && <span className="flex items-center gap-1 text-xs font-bold text-red-500"><AlertTriangle size={12}/> 접수됨</span>}
                          {r.status === ReportStatus.RESOLVED && <span className="flex items-center gap-1 text-xs font-bold text-green-600"><CheckCircle size={12}/> 처리완료</span>}
                          {r.status === ReportStatus.DISMISSED && <span className="flex items-center gap-1 text-xs font-bold text-gray-400"><XCircle size={12}/> 기각됨</span>}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                        {r.status === ReportStatus.PENDING && (
                            <div className="flex justify-end gap-2">
                                <button onClick={() => handleReportAction(r.id, 'RESOLVE')} className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 font-bold text-xs">승인</button>
                                <button onClick={() => handleReportAction(r.id, 'DISMISS')} className="px-3 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 font-bold text-xs">기각</button>
                            </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                      <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-400">접수된 신고 내역이 없습니다.</td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
      )}
    </div>
  );
};