import React, { useState } from 'react';
import { ShieldCheck, Upload, CheckCircle2, FileText, Camera } from 'lucide-react';

export default function KYCPage() {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('passport');
  const [submitted, setSubmitted] = useState(false);

  const handleFinishKYC = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6">
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Personal Details Verification</h2>
            <p className="text-xs text-slate-500 font-medium">Verify your identity to lift account deposit caps and activate live MT5 trading.</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3 animate-in zoom-in-95">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-extrabold text-emerald-900">Verification Documents Uploaded</h3>
            <p className="text-xs text-emerald-700 leading-relaxed max-w-md mx-auto">
              Your government ID and proof of address have been submitted for review. Verification usually completes within 15–30 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFinishKYC} className="space-y-6">
            
            {/* Step 1: Select ID Document Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">1. Government Identification Type</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDocType('passport')}
                  className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all ${
                    docType === 'passport' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-500/20' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Passport
                </button>
                <button
                  type="button"
                  onClick={() => setDocType('id')}
                  className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all ${
                    docType === 'id' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-500/20' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  National ID Card
                </button>
                <button
                  type="button"
                  onClick={() => setDocType('license')}
                  className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all ${
                    docType === 'license' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-500/20' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Driver License
                </button>
              </div>
            </div>

            {/* Step 2: Upload Document Photo */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">2. Upload Front & Back Photos</label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-indigo-50/40 hover:border-indigo-300 cursor-pointer transition-all">
                <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Click to upload document photo or take picture</p>
                <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, PDF up to 10MB</p>
              </div>
            </div>

            {/* Step 3: Proof of Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">3. Proof of Residence (Utility Bill / Bank Statement)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-indigo-50/40 hover:border-indigo-300 cursor-pointer transition-all">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Upload document issued within last 3 months</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-full transition-all shadow-md active:scale-98"
            >
              Submit Verification Documents
            </button>

          </form>
        )}

      </div>

    </div>
  );
}

