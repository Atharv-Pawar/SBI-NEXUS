import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Smartphone, 
  ShieldAlert, 
  Bell, 
  CreditCard, 
  DollarSign, 
  Target, 
  CheckCircle,
  HelpCircle,
  Menu,
  X,
  Volume2,
  RefreshCw,
  Eye,
  EyeOff,
  Keyboard,
  MessageSquare,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info,
  Lock
} from 'lucide-react';

// Components
import AlertBanner from './components/AlertBanner';
import ChatBot from './components/ChatBot';
import DigitalTwin from './components/DigitalTwin';
import OnboardingGuide from './components/OnboardingGuide';
import FraudGuard from './components/FraudGuard';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('atharv_nexus');
  const [loginPassword, setLoginPassword] = useState('password');
  const [captchaInput, setCaptchaInput] = useState('');
  const [currentCaptcha, setCurrentCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Layout and dropdown navigation states
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [activeProducts, setActiveProducts] = useState({
    accounts: 'savings',
    loans: 'personal',
    investments: 'ppf'
  });
  
  // Carousel states
  const [carouselIndex, setCarouselIndex] = useState(0);

  // ChatBot Drawer Open
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // App core states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileData, setProfileData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  const [activeGuideType, setActiveGuideType] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch all user state from Backend
  const fetchUserData = async () => {
    try {
      const rootUrl = 'http://localhost:8000';
      
      // 1. Profile & Analysis
      const profRes = await fetch(`${rootUrl}/api/user/profile`);
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfileData(profData);
      }
      
      // 2. Transactions
      const txRes = await fetch(`${rootUrl}/api/user/transactions`);
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData);
      }

      // 3. Goals
      const goalsRes = await fetch(`${rootUrl}/api/user/goals`);
      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        setGoals(goalsData.goals);
      }

      // 4. Notifications
      const notifRes = await fetch(`${rootUrl}/api/user/notifications`);
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData);
      }

      // 5. Recommendations
      const recsRes = await fetch(`${rootUrl}/api/user/recommendations`);
      if (recsRes.ok) {
        const recsData = await recsRes.json();
        setRecommendations(recsData);
      }
    } catch (e) {
      console.error("Error communicating with FastAPI backend:", e);
      setupOfflineFallback();
    }
  };

  const setupOfflineFallback = () => {
    setProfileData({
      profile: {
        name: "Atharv Pawar (Offline)",
        age: 26,
        monthly_income: 75000,
        savings_balance: 150000,
        discretionary_spending: 25000,
        fixed_expenses: 35000,
        has_savings_account: true,
        has_yono: false,
        has_upi: false,
        has_sip: false,
        has_autopay: false,
        has_fd: false
      },
      analysis: {
        health_rating: "Good",
        health_color: "cyan",
        savings_ratio_percent: 20,
        monthly_surplus: 15000,
        top_spending_category: "Food",
        primary_behavioral_insight: "Offline mode active. Start backend to load live agent triggers.",
        warnings: []
      }
    });
    setTransactions([
      { id: "tx_001", date: "2026-07-10 10:00", description: "Salary Credited", amount: 75000, type: "credit", category: "salary", status: "cleared" },
      { id: "tx_002", date: "2026-07-10 12:00", description: "Auto-Debit: House Rent", amount: 18000, type: "debit", category: "rent", status: "cleared" },
      { id: "tx_003", date: "2026-07-07 19:30", description: "Swiggy Food Delivery", amount: 850, type: "debit", category: "food", status: "cleared" },
      { id: "tx_004", date: "2026-07-05 14:00", description: "Amazon.in Online Shopping", amount: 3200, type: "debit", category: "shopping", status: "cleared" },
      { id: "tx_005", date: "2026-07-01 11:00", description: "Suspicious OTP Attempt - Russia POS", amount: 45000, type: "debit", category: "transfer", status: "flagged" }
    ]);
    setGoals([
      { id: "emergency", title: "Emergency Fund (6 Months)", target_amount: 300000, target_years: 1, current_savings: 100000, monthly_contribution: 10000, category: "emergency" },
      { id: "house", title: "Buy a House Down Payment", target_amount: 1500000, target_years: 5, current_savings: 50000, monthly_contribution: 15000, category: "house" }
    ]);
    setNotifications([
      { id: "notif_001", title: "YONO App Activation Recommended", message: "Unlock 250+ digital services, instant paperless FD/RD, and pre-approved loans by activating SBI YONO.", type: "recommendation", timestamp: "1 hour ago", action_type: "yono_activation" },
      { id: "notif_002", title: "Suspicious Transaction Prevented", message: "SBI NEXUS Fraud Guard blocked a suspicious transaction attempt of ₹45,000 originating from a foreign POS.", type: "fraud", timestamp: "45 mins ago" }
    ]);
    setRecommendations([
      { id: "rec_001", product_name: "YONO SBI", tagline: "Quick Activation", description: "Activate mobile banking to get 10-year forecasts.", action_type: "yono_activation" },
      { id: "rec_002", product_name: "SBI AutoPay", tagline: "Automate Savings", description: "Set up auto-debits to save monthly surpluses.", action_type: "autopay_setup" }
    ]);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleMarkNotificationRead = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/user/notifications/${id}/read`, { method: 'POST' });
      fetchUserData();
    } catch (e) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const handleTriggerAction = (actionType) => {
    setActiveTab('onboarding');
    setActiveGuideType(actionType);
  };

  const handleLockCard = async () => {
    try {
      await fetch('http://localhost:8000/api/mock-sbi/lock-card', { method: 'POST' });
      fetchUserData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleOnboardingComplete = () => {
    fetchUserData();
  };

  const handleChatNavigation = (route) => {
    if (route === 'security_center') {
      setActiveTab('security');
    } else if (route === 'digital_twin') {
      setActiveTab('digital_twin');
    } else if (route === 'goals_panel') {
      setActiveTab('dashboard');
    } else if (route === 'recs_panel') {
      setActiveTab('dashboard');
    }
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const currentProfile = profileData?.profile || {};
  const currentAnalysis = profileData?.analysis || {};

  // Captcha management
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCurrentCaptcha(result);
    setCaptchaInput('');
    setCaptchaError('');
  };

  const speakCaptcha = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentCaptcha.split('').join(' '));
      utterance.rate = 0.75;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Login handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (captchaInput.trim().toUpperCase() !== currentCaptcha) {
      setCaptchaError('Invalid Captcha. Please check and try again.');
      generateCaptcha();
      return;
    }
    setIsLoggedIn(true);
    fetchUserData();
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginUsername('atharv_nexus');
    setLoginPassword('password');
    generateCaptcha();
  };

  // Hover Dropdown Action Routing
  const handleDropdownActionClick = (actionType) => {
    setHoveredMenu(null);
    if (!isLoggedIn) {
      // Auto log in as Atharv Pawar for demonstration
      setIsLoggedIn(true);
      fetchUserData();
    }
    
    if (actionType === 'yono_activation' || actionType === 'upi_setup' || actionType === 'autopay_setup') {
      setActiveTab('onboarding');
      setActiveGuideType(actionType);
    } else if (actionType === 'home_loan_focus') {
      setActiveTab('digital_twin');
    } else if (actionType === 'sip_open') {
      setActiveTab('onboarding');
      setActiveGuideType('autopay_setup');
    } else if (actionType === 'fd_open') {
      setActiveTab('onboarding');
      setActiveGuideType('yono_activation');
    }
  };

  // Security Carousel data
  const securityBestPractices = [
    {
      title: "Be Vigilant. Be Safe.",
      description: "While the bank will make every effort to protect your credentials, please ensure you do not share your OTP, PIN, or net-banking passwords with anyone. SBI will never ask for them."
    },
    {
      title: "Confidentiality.",
      description: "SBI never asks for confidential information like card numbers, PIN, CVV, or passwords over call, SMS, or email. Do not respond to suspicious requests."
    },
    {
      title: "Beware of Phishing.",
      description: "Phishing is a fraudulent attempt, usually made through email, SMS, or fake websites, to steal your personal banking information. Always verify the domain name in the address bar."
    }
  ];

  const handleNextCarousel = () => {
    setCarouselIndex(prev => (prev + 1) % securityBestPractices.length);
  };
  
  const handlePrevCarousel = () => {
    setCarouselIndex(prev => (prev - 1 + securityBestPractices.length) % securityBestPractices.length);
  };

  // Autoplay carousel on landing page
  useEffect(() => {
    if (!isLoggedIn) {
      const interval = setInterval(() => {
        handleNextCarousel();
      }, 5550);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Dropdown right pane content renderer
  const renderDropdownRightPane = () => {
    if (hoveredMenu === 'accounts') {
      const prod = activeProducts.accounts;
      if (prod === 'savings') {
        return (
          <div className="flex-1 flex flex-col justify-between text-slate-800">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <h4 className="font-bold text-[#30034a] text-xs uppercase tracking-wider">Savings Account</h4>
              </div>
              <div className="mt-3 space-y-3">
                <div 
                  onClick={() => handleDropdownActionClick('yono_activation')}
                  className="cursor-pointer group hover:bg-[#5c2784]/5 p-2 rounded-xl border border-transparent hover:border-[#5c2784]/20 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#5c2784] group-hover:underline">Digital Savings Account &gt;</span>
                    <span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">New</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Effortless, Paperless Account Opening with No Branch Visit Needed. Conveniently access and manage your account through YONO.</p>
                </div>
                <div 
                  onClick={() => handleDropdownActionClick('yono_activation')}
                  className="cursor-pointer group hover:bg-[#5c2784]/5 p-2 rounded-xl border border-transparent hover:border-[#5c2784]/20 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#5c2784] group-hover:underline">3-in-1 Account &gt;</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Simplify your financial journey with 3-in-1 account opening. All in one product that provides savings, demat and trading accounts.</p>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 mt-4 italic border-t border-slate-100 pt-2 text-center">Please register / login to explore more.</p>
          </div>
        );
      } else if (prod === 'current') {
        return (
          <div className="flex-1 flex flex-col justify-between text-slate-800">
            <div>
              <h4 className="font-bold text-[#30034a] text-xs uppercase tracking-wider pb-2 border-b border-slate-100">Current Account</h4>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">Designed for businesses, traders, and professionals to manage high transaction volumes. Features include flexible cash withdrawals and overdraft facilities.</p>
              <button 
                onClick={() => handleDropdownActionClick('yono_activation')}
                className="mt-4 text-xs font-bold text-[#5c2784] hover:underline flex items-center gap-1"
              >
                Open Now &gt;
              </button>
            </div>
            <p className="text-[9px] text-slate-400 mt-4 italic border-t border-slate-100 pt-2 text-center">Please register / login to explore more.</p>
          </div>
        );
      } else if (prod === 'term') {
        return (
          <div className="flex-1 flex flex-col justify-between text-slate-800">
            <div>
              <h4 className="font-bold text-[#30034a] text-xs uppercase tracking-wider pb-2 border-b border-slate-100">Term Deposits</h4>
              <p className="text-xs text-slate-650 mt-3 leading-relaxed">Earn high interest on your idle funds. Open fixed deposits (FD) or recurring deposits (RD) instantly with flexible payout options.</p>
              <button 
                onClick={() => handleDropdownActionClick('fd_open')}
                className="mt-4 text-xs font-bold text-[#5c2784] hover:underline flex items-center gap-1"
              >
                Open Now &gt;
              </button>
            </div>
            <p className="text-[9px] text-slate-400 mt-4 italic border-t border-slate-100 pt-2 text-center">Please register / login to explore more.</p>
          </div>
        );
      }
    }
    
    if (hoveredMenu === 'loans') {
      const prod = activeProducts.loans;
      const loanData = {
        personal: {
          title: "Personal Loan",
          bullets: ["Available for customers having Salary Account with us.", "Instant credit to your account.", "Flexible tenures and competitive interest rates."]
        },
        od_fd: {
          title: "OD against FD",
          bullets: ["Get overdraft facilities up to 90% of your FD value instantly.", "No processing charges and zero pre-payment penalties.", "Pay interest only on the amount you draw."]
        },
        home: {
          title: "Home Loan",
          bullets: ["Get attractive interest rates and flexible tenures for your dream home.", "Concession on interest rate for women borrowers.", "Zero pre-payment penalties."],
          action: "Explore More >",
          actionType: "home_loan_focus"
        },
        gold: {
          title: "Gold Loan",
          bullets: ["Avail instant loan against gold ornaments with minimal documentation.", "Flexible repayment options: Bullet repayment or monthly EMI.", "Low interest rates and charges."]
        },
        mutual_fund: {
          title: "Loan Against Mutual Fund",
          bullets: ["Get instant liquidity without selling your mutual fund units.", "Overdraft limit up to 50% for equity and 85% for debt schemes.", "Convenient paperless setup via net-banking."]
        },
        education: {
          title: "Education Loan",
          bullets: ["Fulfill your higher education dreams with student-friendly terms.", "Covers course fee, hostel charges, and travel expenses.", "Moratorium period of course duration + 1 year."]
        }
      }[prod];

      return (
        <div className="flex-grow flex flex-col justify-between text-slate-800">
          <div>
            <h4 className="font-bold text-[#30034a] text-xs uppercase tracking-wider pb-2 border-b border-slate-100">{loanData.title}</h4>
            <ul className="mt-3 space-y-2">
              {loanData.bullets.map((b, idx) => (
                <li key={idx} className="text-xs text-slate-650 flex items-start gap-1.5">
                  <span className="text-[#5c2784] font-bold mt-0.5">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {loanData.action && (
              <button 
                onClick={() => handleDropdownActionClick(loanData.actionType)}
                className="mt-4 text-xs font-bold text-[#5c2784] hover:underline flex items-center gap-1"
              >
                {loanData.action}
              </button>
            )}
          </div>
          <p className="text-[9px] text-slate-400 mt-4 italic border-t border-slate-100 pt-2 text-center">Please register / login to explore more.</p>
        </div>
      );
    }

    if (hoveredMenu === 'investments') {
      const prod = activeProducts.investments;
      const investData = {
        ppf: {
          title: "PPF Account",
          bullets: ["Flexible deposit options between ₹500 to ₹1.5 lakh in a financial year.", "Government-backed long term investment.", "15 year investment with easy extension of 5 years option."],
          action: "Open Now >",
          actionType: "sip_open"
        },
        demat: {
          title: "Demat & Securities",
          bullets: ["Direct equity trading, paperless Demat account opening.", "Real-time portfolio tracking and seamless fund transfers.", "Access to research reports and mutual fund investments."],
          action: "Open Now >",
          actionType: "sip_open"
        },
        '3in1': {
          title: "3-in-1 Account",
          bullets: ["Combines Savings, Demat, and Online Trading Accounts under one roof.", "Hassle-free settlement and transfer of funds.", "Zero physical paperwork for trading setup."],
          action: "Open Now >",
          actionType: "sip_open"
        }
      }[prod];

      return (
        <div className="flex-grow flex flex-col justify-between text-slate-800">
          <div>
            <h4 className="font-bold text-[#30034a] text-xs uppercase tracking-wider pb-2 border-b border-slate-100">{investData.title}</h4>
            <ul className="mt-3 space-y-2">
              {investData.bullets.map((b, idx) => (
                <li key={idx} className="text-xs text-slate-650 flex items-start gap-1.5">
                  <span className="text-[#5c2784] font-bold mt-0.5">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {investData.action && (
              <button 
                onClick={() => handleDropdownActionClick(investData.actionType)}
                className="mt-4 text-xs font-bold text-[#5c2784] hover:underline flex items-center gap-1"
              >
                {investData.action}
              </button>
            )}
          </div>
          <p className="text-[9px] text-slate-400 mt-4 italic border-t border-slate-100 pt-2 text-center">Please register / login to explore more.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative text-slate-100 selection:bg-yono-pink/30 font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yono-purple/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yono-pink/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* YONO Style Top Info Header */}
      <div className="bg-[#2d004d] text-[10px] text-slate-300 px-6 py-1.5 flex items-center justify-between border-b border-[#3b0b55] shrink-0 font-medium">
        <div className="flex items-center gap-2">
          <span className="bg-white text-[#2d004d] px-2 py-0.5 rounded-sm font-black text-[9px] uppercase">Personal Banking</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <a href="#skip" className="hover:text-white transition-colors">Skip to main content</a>
          <span className="text-slate-700">|</span>
          <a href="#corp" className="hover:text-white transition-colors">Corporate website</a>
          <span className="text-slate-700">|</span>
          <a href="#help" className="hover:text-white transition-colors">Get Help</a>
          <span className="text-slate-700">|</span>
          <a href="#whatsapp" className="hover:text-white transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> WhatsApp
          </a>
          <span className="text-slate-700">|</span>
          <select className="bg-transparent border-none text-[10px] text-slate-300 focus:outline-none cursor-pointer">
            <option className="bg-[#2d004d]">English</option>
            <option className="bg-[#2d004d]">Hindi</option>
          </select>
          <span className="text-slate-700">|</span>
          <div className="flex gap-1.5">
            <button className="hover:text-white font-bold">A-</button>
            <button className="hover:text-white font-bold">A</button>
            <button className="hover:text-white font-bold">A+</button>
          </div>
        </div>
      </div>

      {/* Stylized YONO SBI Header with Nav Dropdowns */}
      <header className="border-b border-[#3b0b55]/50 bg-[#30034a] sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tracking-tight text-white font-yono flex items-center">
              yono
              <span className="text-yono-pink font-black text-2xl -mt-1 select-none">.</span>
              <span className="text-sbi-light font-extrabold text-lg tracking-wider ml-1">SBI</span>
            </span>
            <span className="text-[9px] bg-yono-pink text-white px-1.5 py-0.5 rounded font-black tracking-widest leading-none ml-2">NET-BANKING</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-slate-300">
            <button 
              onClick={() => { if(isLoggedIn) { setActiveTab('dashboard'); setActiveGuideType(''); } }}
              className="hover:text-white py-1 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yono-pink transform scale-x-0 group-hover:scale-x-100 transition-transform" />
            </button>
            
            <div 
              className="relative py-1"
              onMouseEnter={() => setHoveredMenu('accounts')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <button className="hover:text-white flex items-center gap-1 focus:outline-none">
                Accounts & Deposits
              </button>
            </div>

            <div 
              className="relative py-1"
              onMouseEnter={() => setHoveredMenu('loans')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <button className="hover:text-white flex items-center gap-1 focus:outline-none">
                Loans
              </button>
            </div>

            <button className="hover:text-white py-1 relative cursor-not-allowed text-slate-500">Cards</button>
            
            <div 
              className="relative py-1"
              onMouseEnter={() => setHoveredMenu('investments')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <button className="hover:text-white flex items-center gap-1 focus:outline-none">
                Investments
              </button>
            </div>
          </nav>
        </div>

        {/* User tag or status */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2">
              <div className="text-right">
                <span className="text-xs font-bold text-white block">{currentProfile.name || 'Atharv Pawar'}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">SBI Savings: xx8943</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-yono-purple/40 border border-yono-pink/30 flex items-center justify-center font-bold text-yono-pink text-xs">
                AP
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-lg text-xs font-bold transition-colors ml-1"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide">NEXUS Security Portal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Hover Navigation Dropdown Overlay */}
      {hoveredMenu && (
        <div 
          className="absolute left-0 right-0 bg-white shadow-2xl border-b border-slate-200 z-50 grid grid-cols-5 animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ top: '89px' }} // Exact align below header (info top bar 29px + header 60px)
          onMouseEnter={() => setHoveredMenu(hoveredMenu)}
          onMouseLeave={() => setHoveredMenu(null)}
        >
          {/* Left menu pane - 2 columns */}
          <div className="col-span-2 border-r border-slate-100 bg-[#fbfafc] p-4 flex flex-col space-y-1">
            {hoveredMenu === 'accounts' && (
              <>
                <button 
                  onMouseEnter={() => setActiveProducts(prev => ({ ...prev, accounts: 'savings' }))}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                    activeProducts.accounts === 'savings' ? 'bg-[#5c2784] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Savings Account {activeProducts.accounts === 'savings' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                <button 
                  onMouseEnter={() => setActiveProducts(prev => ({ ...prev, accounts: 'current' }))}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                    activeProducts.accounts === 'current' ? 'bg-[#5c2784] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Current Account {activeProducts.accounts === 'current' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                <button 
                  onMouseEnter={() => setActiveProducts(prev => ({ ...prev, accounts: 'term' }))}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                    activeProducts.accounts === 'term' ? 'bg-[#5c2784] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Term Deposits {activeProducts.accounts === 'term' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </>
            )}
            {hoveredMenu === 'loans' && (
              [
                { id: 'personal', name: 'Personal Loan' },
                { id: 'od_fd', name: 'OD against FD' },
                { id: 'home', name: 'Home Loan' },
                { id: 'gold', name: 'Gold Loan' },
                { id: 'mutual_fund', name: 'Loan Against Mutual Fund' },
                { id: 'education', name: 'Education Loan' }
              ].map(item => (
                <button 
                  key={item.id}
                  onMouseEnter={() => setActiveProducts(prev => ({ ...prev, loans: item.id }))}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                    activeProducts.loans === item.id ? 'bg-[#5c2784] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.name} {activeProducts.loans === item.id && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ))
            )}
            {hoveredMenu === 'investments' && (
              [
                { id: 'ppf', name: 'PPF Account' },
                { id: 'demat', name: 'Demat & Securities' },
                { id: '3in1', name: '3-in-1 Account' }
              ].map(item => (
                <button 
                  key={item.id}
                  onMouseEnter={() => setActiveProducts(prev => ({ ...prev, investments: item.id }))}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                    activeProducts.investments === item.id ? 'bg-[#5c2784] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.name} {activeProducts.investments === item.id && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ))
            )}
          </div>

          {/* Right menu detail pane - 3 columns */}
          <div className="col-span-3 p-6 flex flex-col justify-between bg-white min-h-[220px]">
            {renderDropdownRightPane()}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {!isLoggedIn ? (
        // ----------------- WELCOME / LANDING PAGE -----------------
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Hero Welcome Row */}
          <section className="bg-gradient-to-br from-[#f2f0f7] to-[#e8e3f0] text-slate-800 px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-yono-purple/5 rounded-full blur-3xl" />
            <div className="absolute left-0 top-0 w-80 h-80 bg-yono-pink/5 rounded-full blur-3xl" />

            <div className="lg:col-span-3 space-y-6">
              <h1 className="text-6xl font-black text-[#5c2784] tracking-tight font-yono leading-none">
                Hello!
              </h1>
              <h2 className="text-xl font-extrabold text-slate-800 leading-tight">
                Welcome to the world of YONO SBI
              </h2>
              
              <div className="space-y-3 max-w-lg">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Are you a new user?</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Choose one of the following options if you are a new user to set up mobile credentials, secure transactions, or simulate portfolio roadmaps.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => handleDropdownActionClick('yono_activation')}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#5c2784] to-[#4c156c] hover:from-[#4c156c] hover:to-[#3b0b55] text-white rounded-full text-xs font-bold shadow-md shadow-[#5c2784]/20 transition-all flex items-center gap-1.5"
                >
                  Register Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleDropdownActionClick('yono_activation')}
                  className="px-6 py-2.5 bg-transparent border border-[#5c2784] text-[#5c2784] hover:bg-[#5c2784]/5 rounded-full text-xs font-bold transition-all"
                >
                  Activate Username
                </button>
              </div>

              <p className="text-xs pt-4 font-semibold text-slate-500">
                Don't have an account with SBI?{' '}
                <a 
                  href="#open" 
                  onClick={() => handleDropdownActionClick('yono_activation')}
                  className="text-[#5c2784] underline hover:text-[#3b0b55] transition-colors"
                >
                  Open Now
                </a>
              </p>
            </div>

            {/* Login Card */}
            <div className="lg:col-span-2">
              <form 
                onSubmit={handleLoginSubmit}
                className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 text-slate-800 space-y-4 max-w-md mx-auto"
              >
                <h3 className="text-center font-bold text-[#2d004d] text-xs uppercase tracking-widest pb-3 border-b border-slate-100">
                  Username / Password
                </h3>

                {/* Username Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Username</label>
                  <input 
                    type="text" 
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                    placeholder="Enter Username"
                    className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-[#5c2784] px-1 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
                  />
                  <div className="text-right">
                    <a href="#forgot-user" className="text-[9px] font-bold text-[#5c2784] hover:underline">Forgot Username?</a>
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      placeholder="Enter Password"
                      className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-[#5c2784] px-1 py-2 pr-16 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button 
                        type="button" 
                        className="p-1 hover:bg-slate-100 rounded text-slate-500"
                        title="Virtual Keyboard"
                      >
                        <Keyboard className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <a href="#forgot-pass" className="text-[9px] font-bold text-[#5c2784] hover:underline">Forgot Password?</a>
                  </div>
                </div>

                {/* Captcha Section */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Enter Captcha</label>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <input 
                      type="text" 
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      required
                      placeholder="Type Captcha"
                      className="flex-1 bg-slate-50 border-b-2 border-slate-200 focus:border-[#5c2784] px-1 py-2 text-xs font-mono text-slate-800 uppercase tracking-widest placeholder-slate-400 focus:outline-none transition-colors"
                    />
                    
                    {/* Visual Captcha Box */}
                    <div className="flex items-center gap-2">
                      <div className="captcha-bg select-none font-mono text-slate-800 text-sm font-black tracking-widest border border-slate-300 rounded px-3 py-1.5 w-24 text-center select-none skew-x-6">
                        {currentCaptcha}
                      </div>
                      <button 
                        type="button"
                        onClick={generateCaptcha}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-[#5c2784] rounded border border-slate-200 transition-colors"
                        title="Refresh Captcha"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={speakCaptcha}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-[#5c2784] rounded border border-slate-200 transition-colors"
                        title="Speak Captcha"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {captchaError && (
                    <p className="text-[10px] font-semibold text-rose-500">{captchaError}</p>
                  )}
                </div>

                {/* Submit button */}
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-[#5c2784] to-[#4c156c] hover:from-[#4c156c] hover:to-[#3b0b55] text-white rounded-full text-xs font-bold transition-all shadow-md shadow-[#5c2784]/20 flex items-center justify-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" /> Login
                </button>
                <div className="text-center pt-1">
                  <a href="#lock-user" className="text-[9px] font-bold text-[#5c2784] hover:underline">Lock/Unlock User</a>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl text-[9px] text-slate-500 leading-normal flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#5c2784] shrink-0 mt-0.5" />
                  <span>
                    💡 Try logging in with the default credentials: username <strong>atharv_nexus</strong> and password <strong>password</strong>. Ensure Captcha matches.
                  </span>
                </div>
              </form>
            </div>
          </section>

          {/* Bottom Wave Background and Quick Actions */}
          <section className="bg-[#3b0b55] relative py-8 px-6 text-center text-white select-none">
            {/* SVG wave representing bottom curves */}
            <div className="absolute top-0 left-0 right-0 transform -translate-y-full overflow-hidden leading-none z-10 select-none pointer-events-none">
              <svg viewBox="0 0 1440 74" fill="none" className="w-full h-12 text-[#3b0b55]" preserveAspectRatio="none">
                <path d="M0,0 C480,74 960,74 1440,0 L1440,74 L0,74 Z" fill="currentColor" />
              </svg>
            </div>

            <div className="max-w-6xl mx-auto space-y-6 relative z-20 mt-4">
              <h3 className="text-slate-350 font-bold text-xs uppercase tracking-wider">Quick Actions</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4 justify-items-center">
                {[
                  { name: "Complaints", icon: HelpCircle },
                  { name: "Report Unauthorized", icon: ShieldAlert, action: "security" },
                  { name: "Doorstep Banking", icon: Smartphone },
                  { name: "FAQ", icon: Info },
                  { name: "Cyber Fraud", icon: ShieldAlert, action: "security" },
                  { name: "Password Mgmt", icon: Lock },
                  { name: "Security Tips", icon: ShieldCheck },
                  { name: "Report Phishing", icon: ShieldAlert, action: "security" }
                ].map((act, idx) => {
                  const ActIcon = act.icon;
                  return (
                    <button 
                      key={idx}
                      onClick={() => handleDropdownActionClick(act.action === "security" ? 'yono_activation' : 'yono_activation')}
                      className="flex flex-col items-center gap-2 group focus:outline-none"
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#3b0b55] group-hover:scale-105 transition-transform shadow-md">
                        <ActIcon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-200 group-hover:text-white leading-tight max-w-[80px]">
                        {act.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Lower Fold: Notices, Carousel and Do's & Don'ts */}
          <section className="bg-[#f9f9fb] text-slate-800 px-6 py-10 space-y-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
              
              {/* Important Notices */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 md:col-span-2 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="font-extrabold text-[#30034a] text-xs uppercase tracking-wider">Important Notices</h4>
                  <a href="#notices" className="text-[10px] font-bold text-[#5c2784] hover:underline">View All</a>
                </div>
                <div className="space-y-3">
                  {[
                    "Customers can now deposit Income Tax/Corporate Taxes using all Bank Debit Cards and Credit Cards under State Bank Payment Gateway.",
                    "Call us toll free on 1800 1234 and 1800 2100 and get a wide range of services through SBI Contact Centre.",
                    "SBI never asks for your Card/PIN/OTP/CVV details on phone, message or email. Please do not click on links received on your email or mobile asking your Bank/Card details."
                  ].map((notice, nIdx) => (
                    <div key={nIdx} className="flex gap-2 text-[10px] text-slate-600 leading-relaxed items-start">
                      <ChevronRight className="w-3.5 h-3.5 text-[#5c2784] shrink-0 mt-0.5" />
                      <span>{notice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Best Practices Carousel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 md:col-span-3 shadow-sm flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h4 className="font-extrabold text-[#30034a] text-xs uppercase tracking-wider">Security Best Practices</h4>
                    <a href="#security" className="text-[10px] font-bold text-[#5c2784] hover:underline">View All</a>
                  </div>
                  
                  {/* Sliding Container */}
                  <div className="mt-4 min-h-[100px] flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yono-purple/5 text-[#5c2784] border border-[#5c2784]/20 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h5 className="font-extrabold text-[#2d004d] text-xs">
                        {securityBestPractices[carouselIndex].title}
                      </h5>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        {securityBestPractices[carouselIndex].description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                  <div className="flex gap-1">
                    {securityBestPractices.map((_, dotIdx) => (
                      <button 
                        key={dotIdx}
                        onClick={() => setCarouselIndex(dotIdx)}
                        className={`w-2 h-2 rounded-full transition-colors ${carouselIndex === dotIdx ? 'bg-[#5c2784]' : 'bg-slate-300'}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handlePrevCarousel}
                      className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#5c2784] transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={handleNextCarousel}
                      className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#5c2784] transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Do's & Don'ts Grid */}
            <div className="max-w-6xl mx-auto space-y-4">
              <h4 className="font-extrabold text-[#30034a] text-xs uppercase tracking-wider">Do's & Don'ts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { type: 'always', title: "Always", text: "keep your computer free of malware by scanning periodically", color: 'border-emerald-500/20 bg-emerald-50/5 text-emerald-800' },
                  { type: 'always', title: "Always", text: "change your net-banking passwords and PINs periodically", color: 'border-emerald-500/20 bg-emerald-50/5 text-emerald-800' },
                  { type: 'never', title: "Never", text: "respond to communication seeking your net-banking passwords", color: 'border-amber-500/20 bg-amber-50/5 text-amber-800' },
                  { type: 'never', title: "Never", text: "reveal your passwords, OTP or card details to anyone on call", color: 'border-amber-500/20 bg-amber-50/5 text-amber-800' }
                ].map((item, idx) => (
                  <div key={idx} className={`border rounded-xl p-4 flex gap-3 items-start ${item.color} shadow-sm`}>
                    <div className={`p-1.5 rounded-full shrink-0 ${item.type === 'always' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {item.type === 'always' ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs">{item.title}</h5>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer bar */}
          <footer className="bg-[#2d004d] border-t border-[#3b0b55] text-slate-405 py-6 px-6 text-center text-[10px] space-y-4 shrink-0 font-medium select-none">
            <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 text-slate-350">
              <a href="#liability" className="hover:text-white transition-colors">RBI Limited Liability Policy</a>
              <span className="text-slate-800">|</span>
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Statement</a>
              <span className="text-slate-800">|</span>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Service (Terms & Conditions)</a>
              <span className="text-slate-800">|</span>
              <a href="#disclosure" className="hover:text-white transition-colors">Disclosure</a>
            </div>
            <div className="space-y-1">
              <p>© State Bank of India (APM Id: APPD5140)</p>
              <p className="text-slate-500">Site best viewed at 1024 x 768 resolution in Microsoft Edge 79+, Mozilla 96+, Google Chrome 97+</p>
            </div>
          </footer>

          {/* Floating chatbot bubble for unauthenticated users */}
          <div className="fixed bottom-6 right-6 z-50">
            <button 
              onClick={() => setChatbotOpen(!chatbotOpen)}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#5c2784] to-yono-pink text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all ring-4 ring-[#5c2784]/20 animate-pulse"
              title="Ask NEXUS AI Companion"
            >
              {chatbotOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
            </button>
            
            {chatbotOpen && (
              <div className="absolute bottom-16 right-0 w-80 sm:w-96 shadow-2xl rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-200">
                <ChatBot 
                  onNavigate={(route) => {
                    setIsLoggedIn(true);
                    setChatbotOpen(false);
                    fetchUserData();
                    handleChatNavigation(route);
                  }} 
                  onTriggerOnboarding={(type) => {
                    setIsLoggedIn(true);
                    setChatbotOpen(false);
                    fetchUserData();
                    handleTriggerAction(type);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        // ----------------- AUTHENTICATED DASHBOARD -----------------
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          {/* Left Side: Tabs System (Overview, Digital Twin, Adoption Simulator, Fraud Guard) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Navigation Tabs (Nexus dashboard sub-menus) */}
            <div className="flex bg-[#30034a]/30 border border-[#3b0b55]/20 p-1.5 rounded-2xl w-full gap-1 overflow-x-auto">
              {[
                { id: 'dashboard', name: 'Overview', icon: LayoutDashboard },
                { id: 'digital_twin', name: 'Digital Twin', icon: TrendingUp },
                { id: 'onboarding', name: 'Adoption Guide', icon: Smartphone },
                { id: 'security', name: 'Fraud Guard', icon: ShieldAlert }
              ].map(tab => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); if(tab.id !== 'onboarding') setActiveGuideType(''); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-yono-purple border border-yono-pink/30 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Alert Notifications Area */}
            <AlertBanner 
              notifications={notifications} 
              onMarkRead={handleMarkNotificationRead}
              onTriggerAction={handleTriggerAction}
            />

            {/* Active Tab View */}
            <div className="transition-all duration-300">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats Summary Panel */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { title: 'Savings Balance', val: formatINR(currentProfile.savings_balance || 150000), icon: DollarSign, color: 'text-yono-pink' },
                      { title: 'Monthly Income', val: formatINR(currentProfile.monthly_income || 75000), icon: DollarSign, color: 'text-white' },
                      { title: 'Active Goals', val: goals.length, icon: Target, color: 'text-indigo-400' },
                      { title: 'Security Status', val: currentProfile.has_upi ? 'Protected' : 'Action Needed', icon: ShieldCheck, color: currentProfile.has_upi ? 'text-emerald-400' : 'text-amber-400' }
                    ].map((stat, sIdx) => {
                      const StatIcon = stat.icon;
                      return (
                        <div key={sIdx} className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</span>
                          <div className="flex items-center justify-between mt-2">
                            <h4 className={`text-md font-extrabold ${stat.color}`}>{stat.val}</h4>
                            <StatIcon className={`w-4 h-4 ${stat.color} opacity-80`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Main Health & Recommendation Split */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    
                    {/* Financial Health Rating */}
                    <div className="glass-panel rounded-2xl p-5 md:col-span-2 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#30034a]/30 to-slate-950">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-yono-purple/5 rounded-full blur-3xl pointer-events-none" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financial Profiler</span>
                        <h4 className="text-md font-bold text-white mt-1">Health Score</h4>
                        <div className="mt-4 flex items-baseline gap-2">
                          <span className={`text-4xl font-extrabold text-${currentAnalysis.health_color === 'cyan' ? 'emerald' : currentAnalysis.health_color}-400`}>
                            {currentAnalysis.health_rating || 'Good'}
                          </span>
                          <span className="text-xs text-slate-400">({currentAnalysis.savings_ratio_percent || 20}% Saved)</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                          {currentAnalysis.primary_behavioral_insight || 'Evaluating spending habits...'}
                        </p>
                      </div>
                      {currentAnalysis.warnings && currentAnalysis.warnings.length > 0 && (
                        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-[10px]">
                          ⚠️ {currentAnalysis.warnings[0]}
                        </div>
                      )}
                    </div>

                    {/* Pending Recommendations */}
                    <div className="glass-panel rounded-2xl p-5 md:col-span-3 space-y-4">
                      <h4 className="font-bold text-white text-xs uppercase tracking-widest">Adoption Action Items</h4>
                      <div className="space-y-3">
                        {recommendations.length > 0 ? (
                          recommendations.slice(0, 2).map((rec) => (
                            <div key={rec.id} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white">{rec.product_name}</span>
                                  <span className="px-1.5 py-0.5 text-[8px] bg-yono-pink/20 text-yono-pink font-bold rounded">{rec.tagline}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 leading-normal line-clamp-1">{rec.description}</p>
                              </div>
                              <button
                                onClick={() => handleTriggerAction(rec.action_type)}
                                className="px-3 py-1.5 bg-yono-purple border border-yono-pink text-white rounded-lg text-[10px] font-bold shrink-0 hover:bg-yono-pink/20 transition-colors"
                              >
                                Setup
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                            🎉 All core digital products activated! You have achieved 100% digital adoption.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Goals Timeline Section */}
                  <div className="glass-panel rounded-2xl p-5">
                    <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-4">Financial Goal Roadmaps</h4>
                    <div className="space-y-4">
                      {goals.map((goal, index) => {
                        const roadmap = profileData?.analysis?.roadmaps?.find(rm => rm.goal_id === goal.id) || {};
                        const progress = Math.min(100, (goal.current_savings / goal.target_amount) * 100);
                        
                        return (
                          <div key={goal.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-bold text-xs text-white">{goal.title}</h5>
                                <span className="text-[10px] text-slate-500 mt-0.5 block">
                                  Target: {formatINR(goal.target_amount)} in {goal.target_years} yrs
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-yono-pink">
                                  {roadmap.timeline_str || `${goal.target_years} yrs`}
                                </span>
                                <span className="text-[9px] text-slate-500 block mt-0.5">
                                  at {formatINR(goal.monthly_contribution)}/mo
                                </span>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                                <span>Progress: {progress.toFixed(0)}%</span>
                                <span>{formatINR(goal.current_savings)} saved</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-yono-pink transition-all duration-500" 
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Transaction Log */}
                  <div className="glass-panel rounded-2xl p-5">
                    <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-4">Recent Digital Logs</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="pb-3 font-semibold">Date</th>
                            <th className="pb-3 font-semibold">Description</th>
                            <th className="pb-3 font-semibold">Category</th>
                            <th className="pb-3 font-semibold text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                          {transactions.slice(0, 4).map((tx) => (
                            <tr key={tx.id} className="text-slate-300">
                              <td className="py-3 text-[10px] text-slate-400">{tx.date}</td>
                              <td className="py-3 font-medium text-white flex items-center gap-1.5">
                                {tx.description}
                                {tx.status === 'flagged' && (
                                  <span className="px-1.5 py-0.5 text-[8px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/20 rounded animate-pulse">FLAGGED</span>
                                )}
                              </td>
                              <td className="py-3"><span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-md text-[10px]">{tx.category}</span></td>
                              <td className={`py-3 text-right font-extrabold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-100'}`}>
                                {tx.type === 'credit' ? '+' : '-'} {formatINR(tx.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'digital_twin' && (
                <DigitalTwin 
                  profile={currentProfile} 
                  goals={goals} 
                  onActionTriggered={fetchUserData}
                />
              )}

              {activeTab === 'onboarding' && (
                <OnboardingGuide 
                  activeGuideType={activeGuideType} 
                  onActivationComplete={handleOnboardingComplete}
                />
              )}

              {activeTab === 'security' && (
                <FraudGuard 
                  analysis={currentAnalysis}
                  transactions={transactions} 
                  onLockCard={handleLockCard}
                />
              )}
            </div>
          </div>

          {/* Right Side: Chatbot Panel */}
          <div className="lg:col-span-1 h-full flex flex-col">
            <ChatBot 
              onNavigate={handleChatNavigation} 
              onTriggerOnboarding={handleTriggerAction}
            />
          </div>
        </main>
      )}

      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#2d004d]/95 backdrop-blur-md z-40 p-6 flex flex-col justify-between md:hidden">
          <div>
            <div className="flex justify-between items-center border-b border-[#3b0b55] pb-4">
              <span className="text-xl font-bold tracking-tight text-white font-yono">
                yono<span className="text-yono-pink font-black text-2xl -mt-1">.</span>SBI
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mt-6">
              {isLoggedIn ? (
                <>
                  {[
                    { id: 'dashboard', name: 'Overview', icon: LayoutDashboard },
                    { id: 'digital_twin', name: 'Digital Twin', icon: TrendingUp },
                    { id: 'onboarding', name: 'Adoption Guide', icon: Smartphone },
                    { id: 'security', name: 'Fraud Guard', icon: ShieldAlert }
                  ].map(tab => {
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); if(tab.id !== 'onboarding') setActiveGuideType(''); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${
                          activeTab === tab.id ? 'bg-yono-purple border border-yono-pink/30 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <TabIcon className="w-4 h-4" />
                        {tab.name}
                      </button>
                    );
                  })}
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-all border border-dashed border-rose-500/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-3 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400">Please enter credentials on the landing page screen to enter the SBI-Nexus agent workspace.</p>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-[#3b0b55] pt-4 text-center text-xs text-slate-500 font-semibold">
            SBI Hackathon © GFF 2026
          </div>
        </div>
      )}
    </div>
  );
}
