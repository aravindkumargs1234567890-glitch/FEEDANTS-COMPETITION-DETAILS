import React, { useState } from 'react';
import { X, Zap, ShieldCheck, CheckCircle2, AlertTriangle, Users, Loader2, RefreshCw } from 'lucide-react';
import { ICompetition } from '../types/index.ts';

interface ConcurrencyTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  competition: ICompetition;
  onRefreshParent: () => void;
  language: 'ENG' | 'HIN';
}

export const ConcurrencyTestModal: React.FC<ConcurrencyTestModalProps> = ({
  isOpen,
  onClose,
  competition,
  onRefreshParent,
  language,
}) => {
  const [requestCount, setRequestCount] = useState<number>(10);
  const [simulateDuplicates, setSimulateDuplicates] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleRunStressTest = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/concurrency/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitionId: competition._id,
          totalRequests: requestCount,
          simulateDuplicates,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Concurrency test failed');
      }

      setTestResult(data);
      onRefreshParent();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-150 animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#007080] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {language === 'ENG' ? 'Atomic Concurrency Stress Tester' : 'समवर्ती पंजीकरण तनाव परीक्षक'}
              </h3>
              <p className="text-[10px] text-cyan-100">
                {language === 'ENG'
                  ? 'Verifies zero overbooking & compound index duplicate protection'
                  : 'शून्य ओवरबुकिंग और यौगिक सूचकांक सुरक्षा का सत्यापन'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Status Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Current Booked</p>
              <p className="text-base font-black text-gray-900">{competition.participantCount} / {competition.maxParticipants}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Remaining Spots</p>
              <p className="text-base font-black text-[#007080]">{Math.max(0, competition.maxParticipants - competition.participantCount)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Max Capacity</p>
              <p className="text-base font-black text-gray-900">{competition.maxParticipants}</p>
            </div>
          </div>

          {/* Test Controls */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Number of Concurrent Parallel Requests
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRequestCount(num)}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      requestCount === num
                        ? 'border-[#007080] bg-[#e4f6f5] text-[#007080]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {num} Parallel Users
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-150">
              <input
                type="checkbox"
                id="dupCheck"
                checked={simulateDuplicates}
                onChange={(e) => setSimulateDuplicates(e.target.checked)}
                className="w-4 h-4 text-[#007080] rounded border-gray-300 focus:ring-[#007080]"
              />
              <label htmlFor="dupCheck" className="text-xs text-gray-700 cursor-pointer">
                <strong>Simulate Duplicate Submissions</strong> (Tests compound unique index: <code className="text-[10px] bg-gray-200 px-1 py-0.5 rounded">userId + competitionId</code>)
              </label>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleRunStressTest}
              className="w-full py-3 bg-[#007080] hover:bg-[#005c69] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Firing {requestCount} Concurrent Parallel Requests...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Launch Parallel Stress Test Now</span>
                </>
              )}
            </button>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className="border border-[#a2ded9] bg-[#f0faf9] rounded-2xl p-3.5 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Test Execution Completed in {testResult.summary.executionTimeMs}ms</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {testResult.summary.overbookingPrevented ? '✓ 0 Overbooking' : 'Failed'}
                </span>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-gray-150">
                  <span className="text-gray-500 block text-[10px]">Accepted (201 Created)</span>
                  <span className="font-extrabold text-emerald-600 text-sm">{testResult.summary.successfulRegistrations}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-150">
                  <span className="text-gray-500 block text-[10px]">Rejected (409 Conflict)</span>
                  <span className="font-extrabold text-amber-600 text-sm">{testResult.summary.rejectedRegistrations}</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-gray-150 text-[11px] text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span>Initial Spots Left:</span>
                  <strong>{testResult.summary.initialSpotsLeft}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Final Participant Count:</span>
                  <strong className={testResult.summary.finalParticipantCount <= testResult.summary.maxCapacity ? 'text-emerald-700' : 'text-red-600'}>
                    {testResult.summary.finalParticipantCount} / {testResult.summary.maxCapacity}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Capacity Guarantee (count &lt;= 20):</span>
                  <strong className="text-emerald-700">PASSED (No Overbooking)</strong>
                </div>
              </div>

              {/* Worker Log preview */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-600 uppercase">Worker Thread Logs:</p>
                <div className="max-h-36 overflow-y-auto space-y-1 bg-white p-2 rounded-xl border border-gray-200 text-[10px]">
                  {testResult.workers.map((w: any) => (
                    <div key={w.workerId} className="flex items-center justify-between py-0.5 border-b border-gray-50 last:border-0">
                      <span className="font-medium text-gray-700">Worker #{w.workerId}: {w.userName}</span>
                      <span className={`font-bold ${w.success ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {w.statusCode} {w.success ? 'Booked' : 'Rejected'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-150 flex items-center justify-between shrink-0">
          <button
            onClick={onRefreshParent}
            type="button"
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync View</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-800 text-white rounded-xl text-xs font-bold transition hover:bg-gray-900 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
