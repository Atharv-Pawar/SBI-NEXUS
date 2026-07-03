import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, Wifi, Battery, ArrowRight, ShieldCheck, CreditCard, RefreshCw } from 'lucide-react';

export default function OnboardingGuide({ activeGuideType, onActivationComplete }) {
  const [activeGuide, setActiveGuide] = useState('yono_activation');
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [accountNumber, setAccountNumber] = useState('');
  const [dob, setDob] = useState('');
  const [otp, setOtp] = useState('');
  const [rights, setRights] = useState('full');
  const [mpin, setMpin] = useState('');
  const [selectedSim, setSelectedSim] = useState('sim1');
  const [cardDigits, setCardDigits] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [upiPin, setUpiPin] = useState('');
  const [mandateAmount, setMandateAmount] = useState('5000');

  useEffect(() => {
    if (activeGuideType) {
      setActiveGuide(activeGuideType);
      setCurrentStep(0);
      setSuccess(false);
    }
  }, [activeGuideType]);

  const resetFlow = () => {
    setCurrentStep(0);
    setSuccess(false);
    setAccountNumber('');
    setDob('');
    setOtp('');
    setMpin('');
    setCardDigits('');
    setCardExpiry('');
    setUpiPin('');
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const triggerActivationAPI = async (type) => {
    setLoading(true);
    let endpoint = '/api/mock-sbi/activate-yono';
    let payload = {};

    if (type === 'upi_setup') {
      endpoint = '/api/mock-sbi/activate-upi';
    } else if (type === 'autopay_setup') {
      endpoint = '/api/mock-sbi/activate-autopay';
      payload = { frequency: 'Monthly', amount: parseFloat(mandateAmount) };
    } else if (type === 'sip_open') {
      endpoint = '/api/mock-sbi/open-sip';
      payload = { amount: 5000.0 };
    } else if (type === 'fd_open') {
      endpoint = '/api/mock-sbi/open-fd';
      payload = { amount: 50000.0 };
    }

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setSuccess(true);
        onActivationComplete();
      }
    } catch (e) {
      console.error("Failed to connect to backend api", e);
      // Fallback local success for offline prototype
      setSuccess(true);
      onActivationComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Sidebar Selector */}
      <div className="lg:col-span-2 space-y-4">
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-lg font-bold text-white mb-2">Digital Adoption Center</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            New to SBI digital services? Select a service below, and follow the step-by-step interactive simulator inside the smartphone emulator on the right.
          </p>

          <div className="space-y-3">
            {[
              { id: 'yono_activation', name: 'Activate SBI YONO App', time: '5 mins', difficulty: 'Easy' },
              { id: 'upi_setup', name: 'Enable UPI Payments', time: '2 mins', difficulty: 'Simple' },
              { id: 'autopay_setup', name: 'Configure AutoPay Mandate', time: '3 mins', difficulty: 'Medium' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveGuide(item.id); resetFlow(); }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  activeGuide === item.id
                    ? 'bg-sbi-blue/40 border-sbi-light text-white shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold">{item.name}</h4>
                  <span className="text-[10px] text-slate-400 mt-1 block">Est. Time: {item.time}</span>
                </div>
                <span className="px-2.5 py-0.5 text-[10px] rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700">
                  {item.difficulty}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Informational Guidelines */}
        <div className="glass-panel rounded-2xl p-5 bg-gradient-to-br from-sbi-blue/10 to-slate-950">
          <h4 className="text-xs font-bold text-sbi-light uppercase tracking-wider mb-2">Why Adopt Digital Banking?</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-sbi-light mt-0.5">•</span>
              <span><strong>Instant transfers:</strong> Send money 24/7 via IMPS, NEFT, and RTGS without paperwork.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sbi-light mt-0.5">•</span>
              <span><strong>Zero Fees:</strong> Pay merchant stores directly using UPI with zero additional transaction charges.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sbi-light mt-0.5">•</span>
              <span><strong>Paperless FDs:</strong> Create and liquidate Fixed Deposits instantly in under a minute via YONO.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Smartphone Emulator Shell */}
      <div className="lg:col-span-3 flex justify-center items-center py-4">
        <div className="relative w-[310px] h-[610px] rounded-[40px] border-[10px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col ring-8 ring-slate-900/30">
          {/* Status Bar */}
          <div className="h-6 bg-slate-900 px-6 flex items-center justify-between text-[10px] text-slate-400 z-20">
            <span>23:05</span>
            <div className="w-20 h-4 bg-slate-900 rounded-b-xl absolute left-1/2 transform -translate-x-1/2 top-0" /> {/* Notch */}
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Simulator Screen */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-between relative bg-slate-900/90 z-10">
            {success ? (
              // Success Screen
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-emerald-400 animate-bounce" />
                <h4 className="text-lg font-bold text-white">Setup Successful!</h4>
                <p className="text-xs text-slate-400 px-2 leading-relaxed">
                  Excellent! The service is now enabled in your mock database. Your digital companion metrics will update instantly.
                </p>
                <button
                  onClick={resetFlow}
                  className="px-4 py-2 bg-sbi-blue border border-sbi-light rounded-xl text-xs font-semibold text-white hover:bg-sbi-light/20 transition-colors"
                >
                  Restart Simulation
                </button>
              </div>
            ) : (
              // Flow Screens
              <>
                {/* 1. YONO App Flow */}
                {activeGuide === 'yono_activation' && (
                  <div className="flex-grow flex flex-col justify-between">
                    {/* Header */}
                    <div className="text-center pb-4 border-b border-slate-800/60">
                      <span className="text-[9px] font-bold text-sbi-light uppercase tracking-widest">YONO SBI</span>
                      <h4 className="text-sm font-extrabold text-white mt-0.5">Activate Application</h4>
                      <div className="flex justify-center gap-1.5 mt-2">
                        {[0, 1, 2, 3, 4].map(idx => (
                          <div key={idx} className={`w-1.5 h-1.5 rounded-full ${currentStep === idx ? 'bg-sbi-light' : 'bg-slate-700'}`} />
                        ))}
                      </div>
                    </div>

                    {/* Content Steps */}
                    <div className="py-6 flex-1 flex flex-col justify-center">
                      {currentStep === 0 && (
                        <div className="space-y-4 text-center">
                          <div className="w-16 h-16 bg-sbi-blue border border-sbi-light rounded-2xl mx-auto flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-sbi-blue/40">
                            yono
                          </div>
                          <h5 className="font-bold text-xs text-white">Welcome to YONO SBI</h5>
                          <p className="text-[10px] text-slate-400 px-4 leading-relaxed">
                            You only need one app for banking, shopping, and investments. Let's register your account.
                          </p>
                          <button
                            onClick={handleNextStep}
                            className="w-full py-2.5 bg-sbi-blue hover:bg-sbi-light/30 border border-sbi-light/50 text-white rounded-xl text-[11px] font-bold transition-all mt-4"
                          >
                            Existing SBI Customer
                          </button>
                          <button className="w-full py-2 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl text-[10px] font-medium cursor-not-allowed">
                            New to SBI
                          </button>
                        </div>
                      )}

                      {currentStep === 1 && (
                        <div className="space-y-3">
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Enter Account Details</label>
                          <input
                            type="text"
                            placeholder="Savings Account Number (11 Digits)"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:border-sbi-light focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Date of Birth (DD-MM-YYYY)"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:border-sbi-light focus:outline-none"
                          />
                          <p className="text-[9px] text-slate-500 italic mt-1">Simulate with any placeholder values to proceed.</p>
                          <button
                            onClick={handleNextStep}
                            disabled={!accountNumber || !dob}
                            className="w-full py-2.5 bg-sbi-light text-white rounded-xl text-[11px] font-bold mt-4 hover:bg-sbi-hover disabled:opacity-50 transition-colors"
                          >
                            Submit Request
                          </button>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-4">
                          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-[10px] leading-relaxed">
                            <strong>Mock OTP Received via SMS:</strong> <span className="font-mono bg-amber-950 px-1.5 py-0.5 rounded font-bold text-white">482910</span>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">OTP Code</label>
                            <input
                              type="text"
                              maxLength="6"
                              placeholder="Enter 6-digit OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:border-sbi-light focus:outline-none tracking-widest text-center"
                            />
                            <button
                              onClick={() => setOtp('482910')}
                              className="text-[9px] text-sbi-light hover:underline font-semibold"
                            >
                              Auto-fill OTP
                            </button>
                          </div>
                          <button
                            onClick={handleNextStep}
                            disabled={otp.length !== 6}
                            className="w-full py-2.5 bg-sbi-light text-white rounded-xl text-[11px] font-bold mt-2 hover:bg-sbi-hover disabled:opacity-50 transition-colors"
                          >
                            Verify OTP
                          </button>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-4">
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Select Transaction Rights</label>
                          <div className="space-y-2">
                            {[
                              { id: 'view', title: 'View Rights Only', desc: 'Can inspect balances and request statements.' },
                              { id: 'limited', title: 'Limited Transaction Rights', desc: 'Can transfer funds to own accounts.' },
                              { id: 'full', title: 'Full Transaction Rights', desc: 'Can open FDs, SIPs, pay bills, and take loans (Recommended).' }
                            ].map(item => (
                              <label
                                key={item.id}
                                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                  rights === item.id ? 'bg-sbi-blue/20 border-sbi-light' : 'bg-slate-950 border-slate-800'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="rights"
                                  checked={rights === item.id}
                                  onChange={() => setRights(item.id)}
                                  className="mt-1 accent-sbi-light"
                                />
                                <div>
                                  <h6 className="text-[10px] font-bold text-white">{item.title}</h6>
                                  <p className="text-[8px] text-slate-400 mt-0.5">{item.desc}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                          <button
                            onClick={handleNextStep}
                            className="w-full py-2.5 bg-sbi-light text-white rounded-xl text-[11px] font-bold mt-2 hover:bg-sbi-hover transition-colors"
                          >
                            Confirm Rights Selection
                          </button>
                        </div>
                      )}

                      {currentStep === 4 && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Set 6-Digit Login MPIN</label>
                            <input
                              type="password"
                              maxLength="6"
                              placeholder="Enter 6-digit MPIN"
                              value={mpin}
                              onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:border-sbi-light focus:outline-none tracking-widest text-center"
                            />
                            <p className="text-[8px] text-slate-500 leading-normal">
                              Use this MPIN for fast login. Avoid sequential numbers like 123456.
                            </p>
                          </div>
                          <button
                            onClick={() => triggerActivationAPI('yono_activation')}
                            disabled={mpin.length !== 6 || loading}
                            className="w-full py-2.5 bg-sbi-light text-white rounded-xl text-[11px] font-bold mt-4 hover:bg-sbi-hover disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                          >
                            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                            Complete Registration
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Back Button Footer */}
                    {currentStep > 0 && (
                      <button
                        onClick={handleBackStep}
                        className="text-[10px] text-slate-500 hover:text-white transition-colors py-2 text-center"
                      >
                        Back to Previous Step
                      </button>
                    )}
                  </div>
                )}

                {/* 2. UPI Flow */}
                {activeGuide === 'upi_setup' && (
                  <div className="flex-grow flex flex-col justify-between">
                    {/* Header */}
                    <div className="text-center pb-4 border-b border-slate-800/60">
                      <span className="text-[9px] font-bold text-sbi-light uppercase tracking-widest">SBI PAY UPI</span>
                      <h4 className="text-sm font-extrabold text-white mt-0.5">UPI Quick Link</h4>
                      <div className="flex justify-center gap-1.5 mt-2">
                        {[0, 1, 2, 3].map(idx => (
                          <div key={idx} className={`w-1.5 h-1.5 rounded-full ${currentStep === idx ? 'bg-sbi-light' : 'bg-slate-700'}`} />
                        ))}
                      </div>
                    </div>

                    {/* Content Steps */}
                    <div className="py-6 flex-1 flex flex-col justify-center">
                      {currentStep === 0 && (
                        <div className="space-y-4">
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Select Registered SIM</label>
                          <div className="space-y-2">
                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${selectedSim === 'sim1' ? 'bg-sbi-blue/20 border-sbi-light' : 'bg-slate-950 border-slate-800'}`}>
                              <input type="radio" checked={selectedSim === 'sim1'} onChange={() => setSelectedSim('sim1')} className="accent-sbi-light" />
                              <div className="text-left">
                                <h6 className="text-[10px] font-bold text-white">SIM 1 (Jio Telecom)</h6>
                                <p className="text-[8px] text-slate-500">+91 98765 43210</p>
                              </div>
                            </label>
                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${selectedSim === 'sim2' ? 'bg-sbi-blue/20 border-sbi-light' : 'bg-slate-950 border-slate-800'}`}>
                              <input type="radio" checked={selectedSim === 'sim2'} onChange={() => setSelectedSim('sim2')} className="accent-sbi-light" />
                              <div className="text-left">
                                <h6 className="text-[10px] font-bold text-white">SIM 2 (Airtel Telecom)</h6>
                                <p className="text-[8px] text-slate-500">+91 90123 45678</p>
                              </div>
                            </label>
                          </div>
                          <button
                            onClick={handleNextStep}
                            className="w-full py-2.5 bg-sbi-light text-white rounded-xl text-[11px] font-bold mt-4 hover:bg-sbi-hover transition-colors"
                          >
                            Send Verification SMS
                          </button>
                        </div>
                      )}

                      {currentStep === 1 && (
                        <div className="space-y-4 text-center">
                          <Smartphone className="w-10 h-10 text-sbi-light mx-auto animate-pulse" />
                          <h5 className="font-bold text-xs text-white">Linking SBI Accounts</h5>
                          <p className="text-[10px] text-slate-400 px-2 leading-relaxed">
                            We auto-detected the following SBI account linked to +91 98765 43210:
                          </p>
                          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left flex justify-between items-center">
                            <div>
                              <span className="text-[8px] text-slate-500">STATE BANK OF INDIA</span>
                              <h6 className="text-[10px] font-bold text-white">Savings A/c - XX8943</h6>
                            </div>
                            <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Detected</span>
                          </div>
                          <button
                            onClick={handleNextStep}
                            className="w-full py-2.5 bg-sbi-light text-white rounded-xl text-[11px] font-bold mt-4 hover:bg-sbi-hover transition-colors"
                          >
                            Link Account & Proceed
                          </button>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-3">
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" /> ATM Card Verification
                          </label>
                          <input
                            type="text"
                            maxLength="6"
                            placeholder="Last 6 Digits of ATM Card"
                            value={cardDigits}
                            onChange={(e) => setCardDigits(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:border-sbi-light focus:outline-none text-center"
                          />
                          <input
                            type="text"
                            maxLength="5"
                            placeholder="Expiry Date (MM/YY)"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:border-sbi-light focus:outline-none text-center"
                          />
                          <button
                            onClick={handleNextStep}
                            disabled={cardDigits.length !== 6 || cardExpiry.length < 5}
                            className="w-full py-2.5 bg-sbi-light text-white rounded-xl text-[11px] font-bold mt-4 hover:bg-sbi-hover disabled:opacity-50 transition-colors"
                          >
                            Verify Card Details
                          </button>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Set 6-Digit Secure UPI PIN</label>
                            <input
                              type="password"
                              maxLength="6"
                              placeholder="Enter 6-Digit UPI PIN"
                              value={upiPin}
                              onChange={(e) => setUpiPin(e.target.value.replace(/\D/g, ''))}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:border-sbi-light focus:outline-none tracking-widest text-center"
                            />
                            <p className="text-[8px] text-slate-500 leading-normal">
                              This PIN authorizes bank transfers. Never share your UPI PIN.
                            </p>
                          </div>
                          <button
                            onClick={() => triggerActivationAPI('upi_setup')}
                            disabled={upiPin.length !== 6 || loading}
                            className="w-full py-2.5 bg-sbi-light text-white rounded-xl text-[11px] font-bold mt-4 hover:bg-sbi-hover disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                          >
                            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                            Create UPI PIN
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Back Button Footer */}
                    {currentStep > 0 && (
                      <button
                        onClick={handleBackStep}
                        className="text-[10px] text-slate-500 hover:text-white transition-colors py-2 text-center"
                      >
                        Back to Previous Step
                      </button>
                    )}
                  </div>
                )}

                {/* 3. AutoPay Flow */}
                {activeGuide === 'autopay_setup' && (
                  <div className="flex-grow flex flex-col justify-between">
                    {/* Header */}
                    <div className="text-center pb-4 border-b border-slate-800/60">
                      <span className="text-[9px] font-bold text-sbi-light uppercase tracking-widest">SBI AUTOPAY</span>
                      <h4 className="text-sm font-extrabold text-white mt-0.5">Recurring Mandates</h4>
                      <div className="flex justify-center gap-1.5 mt-2">
                        {[0, 1, 2].map(idx => (
                          <div key={idx} className={`w-1.5 h-1.5 rounded-full ${currentStep === idx ? 'bg-sbi-light' : 'bg-slate-700'}`} />
                        ))}
                      </div>
                    </div>

                    {/* Content Steps */}
                    <div className="py-6 flex-1 flex flex-col justify-center">
                      {currentStep === 0 && (
                        <div className="space-y-4 text-center">
                          <Smartphone className="w-10 h-10 text-sbi-light mx-auto" />
                          <h5 className="font-bold text-xs text-white">Create Mandate Instruction</h5>
                          <p className="text-[10px] text-slate-400 px-2 leading-relaxed">
                            Configure an e-mandate to auto-debit payments directly when utility bills are generated or salary gets credited.
                          </p>
                          <button
                            onClick={handleNextStep}
                            className="w-full py-2.5 bg-sbi-light text-white rounded-xl text-[11px] font-bold mt-4 hover:bg-sbi-hover transition-colors"
                          >
                            Set AutoPay Mandate
                          </button>
                        </div>
                      )}

                      {currentStep === 1 && (
                        <div className="space-y-3">
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Select Merchant Folio</label>
                          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left">
                            <span className="text-[8px] text-slate-500">SCHEME PROVIDER</span>
                            <h6 className="text-[10px] font-bold text-white">SBI Mutual Fund House</h6>
                          </div>

                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-2 block">Monthly SIP Amount Limit</label>
                          <input
                            type="text"
                            value={mandateAmount}
                            onChange={(e) => setMandateAmount(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-sbi-light focus:outline-none"
                          />
                          <p className="text-[8px] text-slate-500 italic mt-0.5">Maximum amount the merchant can debit monthly.</p>

                          <button
                            onClick={handleNextStep}
                            disabled={!mandateAmount}
                            className="w-full py-2.5 bg-sbi-light text-white rounded-xl text-[11px] font-bold mt-4 hover:bg-sbi-hover transition-colors"
                          >
                            Confirm Parameters
                          </button>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-4">
                          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                            <h6 className="font-bold text-white border-b border-slate-800 pb-1 text-[10px]">Verify Standing Order</h6>
                            <div className="flex justify-between text-[9px] text-slate-400">
                              <span>Creditor:</span>
                              <span className="text-white font-semibold">SBI Mutual Fund</span>
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-400">
                              <span>Max Amount:</span>
                              <span className="text-white font-semibold">₹{parseFloat(mandateAmount).toLocaleString()}/month</span>
                            </div>
                          </div>

                          <p className="text-[8px] text-slate-500 leading-normal">
                            Authorizing creates a Standing Instruction mandate linked to your Savings Account XX8943.
                          </p>

                          <button
                            onClick={() => triggerActivationAPI('autopay_setup')}
                            disabled={loading}
                            className="w-full py-2.5 bg-sbi-light text-white rounded-xl text-[11px] font-bold hover:bg-sbi-hover transition-colors flex items-center justify-center gap-1.5"
                          >
                            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                            Authenticate Mandate
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Back Button Footer */}
                    {currentStep > 0 && (
                      <button
                        onClick={handleBackStep}
                        className="text-[10px] text-slate-500 hover:text-white transition-colors py-2 text-center"
                      >
                        Back to Previous Step
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Home Indicator */}
          <div className="h-6 bg-slate-900 flex items-center justify-center z-20">
            <div className="w-28 h-1 bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
