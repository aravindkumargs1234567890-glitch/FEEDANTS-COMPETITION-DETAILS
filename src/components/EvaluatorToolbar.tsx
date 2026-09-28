import React, { useState } from 'react';
import { Users, Sparkles, RefreshCw, Zap, Sliders, ChevronDown, Check } from 'lucide-react';
import { IUser } from '../types/index.ts';

interface EvaluatorToolbarProps {
  users: IUser[];
  currentUser: IUser | null;
  onSelectUser: (user: IUser) => void;
  onScenarioChange: (scenario: string) => void;
  onOpenConcurrencyTest: () => void;
  onResetDatabase: () => void;
  language: 'ENG' | 'HIN';
}

export const EvaluatorToolbar: React.FC<EvaluatorToolbarProps> = ({
  users,
  currentUser,
  onSelectUser,
  onScenarioChange,
  onOpenConcurrencyTest,
  onResetDatabase,
  language,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800">
      {/* Top Banner / Switcher */}
      <div className="px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded text-[10px] tracking-wide uppercase border border-emerald-500/30">
            Evaluator Mode
          </span>

          {/* Active User Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-200 transition cursor-pointer border border-slate-700"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate max-w-[120px]">{currentUser?.name || 'Select User'}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute left-0 top-full mt-1.5 w-60 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 text-xs">
                <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Test User Profiles
                </div>
                {users.map((u) => {
                  const isSelected = currentUser?._id === u._id;
                  let note = '';
                  if (u._id === 'user_riya_001') note = '(Registered)';
                  if (u._id === 'user_arjun_002') note = '(Not Registered)';
                  if (u._id === 'user_priya_003') note = '(Uploaded Entry)';

                  return (
                    <button
                      key={u._id}
                      type="button"
                      onClick={() => {
                        onSelectUser(u);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#007080] text-white font-bold'
                          : 'text-gray-200 hover:bg-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <span className="block leading-none truncate">{u.name}</span>
                        <span className="text-[10px] opacity-75 font-normal">{note || u.email}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Concurrency Stress Test */}
          <button
            type="button"
            onClick={onOpenConcurrencyTest}
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Test Concurrency</span>
          </button>

          {/* Quick Scenario Toggle Dropdown */}
          <select
            onChange={(e) => onScenarioChange(e.target.value)}
            defaultValue="NORMAL"
            className="bg-slate-800 border border-slate-700 text-gray-200 px-2 py-1 rounded-lg text-xs font-medium cursor-pointer outline-none hover:bg-slate-700"
          >
            <option value="NORMAL">Scenario: Normal (19 Spots Left)</option>
            <option value="FULL">Scenario: Full / Sold Out (20/20)</option>
            <option value="REG_CLOSED">Scenario: Registration Closed</option>
            <option value="SUBMISSION_CLOSED">Scenario: Submission Closed</option>
            <option value="COMPLETED">Scenario: Completed</option>
          </select>

          {/* Reset DB */}
          <button
            type="button"
            onClick={onResetDatabase}
            title="Reset database to initial design state"
            className="p-1 text-gray-400 hover:text-white hover:bg-slate-800 rounded-md transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
