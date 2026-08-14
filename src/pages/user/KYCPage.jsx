import React, { useState } from 'react';
import { ShieldCheck, Upload, CheckCircle2, FileText, Camera, Check } from 'lucide-react';

export default function KYCPage() {
  const [docType, setDocType] = useState('passport');
  const [idUploaded, setIdUploaded] = useState(false);
  const [addressUploaded, setAddressUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFinishKYC = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6">
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Personal Identity Verification</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Verify your identity to lift account deposit caps and activate live MT5 trading.</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center bg-emerald-50/90 rounded-3xl border border-emerald-200 space-y-3 animate-in zoom-in-95">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-black text-emerald-950">Verification Documents Uploaded!</h3>
            <p className="text-xs font-semibold text-emerald-800 leading-relaxed max-w-md mx-auto">
              Your government ID and proof of address have been submitted to our compliance review desk. Verification usually completes within 15–30 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFinishKYC} className="space-y-6">
            
            {/* Step 1: Select ID Document Type */}
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold text-slate-700 block uppercase tracking-wider">
                1. Select Government ID Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDocType('passport')}
                  className={`py-3.5 px-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                    docType === 'passport' ? 'border-emerald-600 bg-emerald-50/60 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                  }`}
                >
                  Passport
                </button>
                <button
                  type="button"
                  onClick={() => setDocType('id')}
                  className={`py-3.5 px-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                    docType === 'id' ? 'border-emerald-600 bg-emerald-50/60 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                  }`}
                >
                  National ID Card
                </button>
                <button
                  type="button"
                  onClick={() => setDocType('license')}
                  className={`py-3.5 px-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                    docType === 'license' ? 'border-emerald-600 bg-emerald-50/60 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                  }`}
                >
                  Driver License
                </button>
              </div>
            </div>

            {/* Step 2: Upload Document Photo */}
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold text-slate-700 block uppercase tracking-wider">
                2. Upload Front & Back Photos
              </label>
              <div 
                onClick={() => setIdUploaded(true)}
                className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                  idUploaded ? 'border-emerald-500 bg-emerald-50/60' : 'border-slate-300 hover:border-emerald-400 bg-slate-50'
                }`}
              >
                {idUploaded ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-xs">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Government ID Photo Attached ({docType.toUpperCase()}_ID.jpg)</span>
                  </div>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs font-extrabold text-slate-800">Click to upload document photo or take picture</p>
                    <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, PDF up to 10MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Step 3: Proof of Address */}
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold text-slate-700 block uppercase tracking-wider">
                3. Proof of Residence (Utility Bill / Bank Statement)
              </label>
              <div 
                onClick={() => setAddressUploaded(true)}
                className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                  addressUploaded ? 'border-emerald-500 bg-emerald-50/60' : 'border-slate-300 hover:border-emerald-400 bg-slate-50'
                }`}
              >
                {addressUploaded ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-xs">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Proof of Address Attached (utility_bill.pdf)</span>
                  </div>
                ) : (
                  <>
                    <FileText className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs font-extrabold text-slate-800">Upload document issued within last 3 months</p>
                    <p className="text-[10px] text-slate-400 mt-1">Supports PDF, PNG up to 10MB</p>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-full transition-all shadow-lg shadow-emerald-600/25 active:scale-98 cursor-pointer"
            >
              Submit Verification Documents
            </button>

          </form>
        )}

      </div>

    </div>
  );
}


