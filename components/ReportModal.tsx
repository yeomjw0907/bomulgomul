import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { store } from '../services/mockStore';
import { useToast } from './Toast';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'PRODUCT' | 'USER';
  targetName: string;
}

const REPORT_REASONS = [
    '판매 금지 물품입니다 (가품, 장물 등)',
    '사기 글이 의심됩니다',
    '상품 정보가 실제와 다릅니다',
    '부적절한 내용이나 욕설이 포함되어 있습니다',
    '전문 판매업자의 홍보글입니다',
    '기타 사유'
];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetId, targetType, targetName }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const user = store.getCurrentUser();
      
      if (!user) {
          showToast('로그인이 필요합니다.', 'ERROR');
          return;
      }

      if (!selectedReason) {
          showToast('신고 사유를 선택해주세요.', 'ERROR');
          return;
      }

      const finalReason = selectedReason === '기타 사유' ? `기타: ${customReason}` : selectedReason;

      store.addReport({
          targetId,
          targetType,
          reporterId: user.id,
          reason: finalReason
      });

      // Show toast and close immediately
      showToast('신고가 접수되었습니다. 관리자가 검토할 예정입니다.', 'SUCCESS');
      
      // Reset form
      setSelectedReason('');
      setCustomReason('');
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-[#2C2C2C] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-[#252525]">
            <h3 className="font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-goblin-red" size={20}/> 신고하기
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                <X size={20}/>
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
            <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg">
                <p className="text-xs text-red-200">
                    <span className="font-bold">신고 대상:</span> {targetName}
                </p>
            </div>

            <div className="space-y-3 mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">신고 사유 선택</label>
                {REPORT_REASONS.map((reason) => (
                    <label key={reason} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedReason === reason ? 'bg-treasure-gold/10 border-treasure-gold' : 'bg-[#333] border-gray-700 hover:border-gray-500'}`}>
                        <input 
                            type="radio" 
                            name="reportReason" 
                            className="accent-treasure-gold w-4 h-4"
                            checked={selectedReason === reason}
                            onChange={() => setSelectedReason(reason)}
                        />
                        <span className={`text-sm ${selectedReason === reason ? 'text-treasure-gold font-bold' : 'text-gray-300'}`}>{reason}</span>
                    </label>
                ))}
            </div>

            {selectedReason === '기타 사유' && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                    <textarea 
                        className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg p-3 text-sm text-white placeholder-gray-500 outline-none focus:border-treasure-gold min-h-[80px]"
                        placeholder="신고 사유를 자세히 적어주세요."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        required
                    ></textarea>
                </div>
            )}

            <div className="flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-[#333] hover:bg-[#444] text-gray-300 font-bold text-sm transition">
                    취소
                </button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-goblin-red hover:bg-red-700 text-white font-bold text-sm transition shadow-lg shadow-red-900/30">
                    신고 접수
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};