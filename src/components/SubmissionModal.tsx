import React, { useState } from 'react';
import { X, UploadCloud, Film, CheckCircle2, AlertCircle, Loader2, Link2, Check } from 'lucide-react';
import { ICompetition, ISubmission, IUser } from '../types/index.ts';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  competition: ICompetition;
  currentUser: IUser;
  existingSubmission: ISubmission | null;
  onSuccess: (submission: ISubmission) => void;
  language: 'ENG' | 'HIN';
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  competition,
  currentUser,
  existingSubmission,
  onSuccess,
  language,
}) => {
  const [title, setTitle] = useState(existingSubmission?.title || `${currentUser.name} - Classical Kathak Performance`);
  const [submissionUrl, setSubmissionUrl] = useState(
    existingSubmission?.submissionUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  );
  const [performanceNotes, setPerformanceNotes] = useState(
    existingSubmission?.performanceNotes || 'Teental 16 Matra choreography in Lucknow Gharana style with Tatkar and Chakkars.'
  );
  const [danceStyle, setDanceStyle] = useState('Kathak');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          competitionId: competition._id,
          title,
          submissionUrl,
          performanceNotes: `[Style: ${danceStyle}] ${performanceNotes}`,
          fileType: 'video/link',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setSubmitted(true);
      onSuccess(data.data);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to upload entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-150 animate-scale-up">
        {/* Header */}
        <div className="bg-[#007080] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <UploadCloud className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {existingSubmission
                  ? language === 'ENG'
                    ? 'Update Your Submission'
                    : 'अपनी प्रविष्टि अपडेट करें'
                  : language === 'ENG'
                  ? 'Upload Competition Entry'
                  : 'प्रतियोगिता प्रविष्टि अपलोड करें'}
              </h3>
              <p className="text-[10px] text-cyan-100">{competition.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-base font-bold text-gray-900">
              {language === 'ENG' ? 'Submission Received!' : 'प्रविष्टि प्राप्त हुई!'}
            </h4>
            <p className="text-xs text-gray-600">
              {language === 'ENG'
                ? 'Your video has been recorded and submitted for jury evaluation.'
                : 'आपका वीडियो दर्ज कर लिया गया है और जूरी मूल्यांकन के लिए भेज दिया गया है।'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                {language === 'ENG' ? 'Performance Title' : 'प्रस्तुति का शीर्षक'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kathak Tarana in Teentaal"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#007080]"
              />
            </div>

            {/* Dance Form Selector */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                {language === 'ENG' ? 'Classical Form' : 'शास्त्रीय नृत्य शैली'}
              </label>
              <select
                value={danceStyle}
                onChange={(e) => setDanceStyle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#007080]"
              >
                <option value="Kathak">Kathak (कथक)</option>
                <option value="Bharatanatyam">Bharatanatyam (भरतनाट्यम)</option>
                <option value="Odissi">Odissi (ओडिसी)</option>
                <option value="Kuchipudi">Kuchipudi (कुचिपुड़ी)</option>
                <option value="Mohiniyattam">Mohiniyattam (मोहिनीअट्टम)</option>
                <option value="Kathakali">Kathakali (कथकली)</option>
              </select>
            </div>

            {/* Video URL */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center justify-between">
                <span>{language === 'ENG' ? 'Video Link' : 'वीडियो लिंक'}</span>
                <span className="text-[10px] text-gray-400 font-normal">YouTube / Google Drive / MP4</span>
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-2.5 py-1.5 focus-within:border-[#007080]">
                <Link2 className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="url"
                  required
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full text-xs text-gray-800 outline-none"
                />
              </div>
            </div>

            {/* Performance Notes */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                {language === 'ENG' ? 'Choreography Notes (Optional)' : 'कोरियोग्राफी विवरण (वैकल्पिक)'}
              </label>
              <textarea
                rows={2}
                value={performanceNotes}
                onChange={(e) => setPerformanceNotes(e.target.value)}
                placeholder="Mention Tala, Laya, Composer, or Guru dedication..."
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#007080]"
              />
            </div>

            {/* Rules Check */}
            <div className="p-2.5 bg-gray-50 border border-gray-150 rounded-xl text-[11px] text-gray-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#007080]" />
                <span>{language === 'ENG' ? 'Submission Checklist:' : 'प्रविष्टि चेकलिस्ट:'}</span>
              </div>
              <p className="text-[10px] pl-5">• Duration must be 2 to 5 minutes</p>
              <p className="text-[10px] pl-5">• Continuous single shot with clear audio</p>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#007080] hover:bg-[#005c69] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'ENG' ? 'Submitting...' : 'जमा कर रहे हैं...'}</span>
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  <span>
                    {existingSubmission
                      ? language === 'ENG'
                        ? 'Save Changes'
                        : 'परिवर्तन सहेजें'
                      : language === 'ENG'
                      ? 'Submit Entry'
                      : 'प्रविष्टि जमा करें'}
                  </span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
