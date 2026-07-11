import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, ToggleLeft, ToggleRight, Lock, Key, Smartphone, Globe } from 'lucide-react';

export default function FraudGuard({ analysis, transactions, onLockCard }) {
  const [intlUsage, setIntlUsage] = useState(false);
  const [onlineUsage, setOnlineUsage] = useState(true);
  const [loading, setLoading] = useState(false);

  const flaggedTx = transactions.filter(t => t.status === 'flagged');
  const hasThreat = flaggedTx.length > 0;
  const securityScore = hasThreat ? 65 : 95;

  const handleBlockCard = async () => {
    setLoading(true);
    await onLockCard();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-5 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Security Overview</span>
              <h3 className="text-xl font-bold text-white mt-1">SBI NEXUS Fraud Guard</h3>
            </div>
            {hasThreat ? (
              <span className="px-3 py-1 text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full flex items-center gap-1.5 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" /> High Threat Alert
              </span>
            ) : (
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Protected
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            Our autonomous Fraud Awareness Agent scans your transaction signatures in real-time. We check for suspicious locations, unusual spending velocity, and OTP hijacking attempts.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => setOnlineUsage(!onlineUsage)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors text-xs font-medium text-slate-300"
            >
              {onlineUsage ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
              Online Domestic Payments
            </button>
            <button
              onClick={() => setIntlUsage(!intlUsage)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors text-xs font-medium text-slate-300"
            >
              {intlUsage ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
              International Usage
            </button>
          </div>
        </div>

        {/* Security Score Widget */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sbi-light/5 rounded-full blur-3xl" />
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Simple circular chart */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-slate-800 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                className={`fill-none transition-all duration-1000 ${hasThreat ? 'stroke-rose-500' : 'stroke-sbi-light'}`}
                strokeWidth="8"
                strokeDasharray="301.6"
                strokeDashoffset={301.6 - (301.6 * securityScore) / 100}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-3xl font-extrabold ${hasThreat ? 'text-rose-400' : 'text-sbi-light'}`}>{securityScore}%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Safety Score</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 max-w-[200px]">
            {hasThreat ? 'Unresolved security flags detected. Action needed immediately.' : 'No active vulnerabilities or suspicious locks found.'}
          </p>
        </div>
      </div>

      {/* Threats Section */}
      {hasThreat && (
        <div className="border border-rose-900/50 bg-rose-950/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-900/40 text-rose-400 rounded-xl border border-rose-500/20">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="font-bold text-white text-lg">Active Security Incident</h4>
                <p className="text-sm text-slate-300 mt-1">
                  We intercepted a transaction attempting to debit your account without proper authorization parameters.
                </p>
              </div>

              {flaggedTx.map(tx => (
                <div key={tx.id} className="bg-slate-950/80 border border-rose-900/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] bg-rose-500/20 text-rose-400 font-semibold px-2 py-0.5 rounded-full border border-rose-500/20">UNAUTHORIZED POS</span>
                    <h5 className="font-bold text-sm text-white mt-2">{tx.description}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Timestamp: {tx.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-rose-400">-₹{tx.amount.toLocaleString()}</span>
                    <p className="text-[10px] text-slate-400">Blocked & Flagged</p>
                  </div>
                </div>
              ))}

              <div className="flex gap-4">
                <button
                  onClick={handleBlockCard}
                  disabled={loading}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-950/40 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" /> {loading ? 'Securing Account...' : 'Block Credit Card & Reissue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Best Practices */}
      <div className="glass-panel rounded-2xl p-6">
        <h4 className="font-bold text-white text-md mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldCheck className="w-5 h-5 text-sbi-light" /> SBI Safe Digital Banking Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-3.5 items-start">
            <div className="p-2 bg-slate-900 rounded-lg text-sbi-light border border-slate-800">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-white">Never Share Credentials</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                SBI officers, customer service reps, or automation systems will never call, SMS, or email you asking for ATM PINs, CVV, OTP, or passwords.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="p-2 bg-slate-900 rounded-lg text-sbi-light border border-slate-800">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-white">Official App Installation</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Only download the SBI YONO app from official application stores (Google Play Store or Apple App Store). Never sideload via APK links.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="p-2 bg-slate-900 rounded-lg text-sbi-light border border-slate-800">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-white">Check URLs Before Login</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Always ensure the website domain name is exactly <span className="text-sbi-light">https://www.onlinesbi.sbi</span> before logging into retail banking.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="p-2 bg-slate-900 rounded-lg text-sbi-light border border-slate-800">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-white">Beware of QR Scans to Receive Money</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Scanning a QR code and entering a UPI PIN is only used to PAY money. Receiving funds requires absolutely no PIN verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
