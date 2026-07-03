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
  X
} from 'lucide-react';

// Components
import AlertBanner from './components/AlertBanner';
import ChatBot from './components/ChatBot';
import DigitalTwin from './components/DigitalTwin';
import OnboardingGuide from './components/OnboardingGuide';
import FraudGuard from './components/FraudGuard';

export default function App() {
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
      // Setup minimal offline state if server is not yet running
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
    setTransactions([]);
    setGoals([]);
    setNotifications([]);
    setRecommendations([]);
  };

  useEffect(() => {
    fetchUserData();
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

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative text-slate-100 selection:bg-sbi-light/30">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-sbi-blue/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sbi-light/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* SBI stylized logo */}
          <div className="w-9 h-9 rounded-full bg-sbi-light flex items-center justify-center relative shadow-lg shadow-sbi-light/20">
            <div className="w-5 h-5 rounded-full bg-sbi-blue border-[2.5px] border-sbi-light flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-sbi-light" />
            </div>
            {/* Cutout line resembling SBI logo */}
            <div className="absolute bottom-0 w-1 h-3 bg-sbi-light left-1/2 transform -translate-x-1/2" />
          </div>
          <div>
            <h1 className="text-md font-extrabold tracking-wide text-white flex items-center gap-1.5">
              STATE BANK OF INDIA
              <span className="text-[10px] bg-sbi-light text-sbi-dark px-1.5 py-0.5 rounded font-black tracking-widest">NEXUS</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-semibold tracking-wider">Agentic AI Digital Companion</p>
          </div>
        </div>

        {/* User profile tag */}
        <div className="hidden sm:flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2">
          <div className="text-right">
            <span className="text-xs font-bold text-white block">{currentProfile.name || 'Atharv Pawar'}</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">SBI Savings: xx8943</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sbi-blue/40 border border-sbi-light/40 flex items-center justify-center font-bold text-sbi-light text-xs">
            AP
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Tabs System (Overview, Digital Twin, Adoption Simulator, Fraud Guard) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Navigation Tabs */}
          <div className="flex bg-slate-900/40 border border-slate-850 p-1.5 rounded-2xl w-full gap-1 overflow-x-auto">
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
                      ? 'bg-sbi-blue border border-sbi-light/30 text-white shadow-md'
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
                    { title: 'Savings Balance', val: formatINR(currentProfile.savings_balance || 150000), icon: DollarSign, color: 'text-sbi-light' },
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
                  <div className="glass-panel rounded-2xl p-5 md:col-span-2 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-950">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financial Profiler</span>
                      <h4 className="text-md font-bold text-white mt-1">Health Score</h4>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className={`text-4xl font-extrabold text-${currentAnalysis.health_color}-400`}>
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
                                <span className="px-1.5 py-0.5 text-[8px] bg-sbi-light/20 text-sbi-light font-bold rounded">{rec.tagline}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 leading-normal line-clamp-1">{rec.description}</p>
                            </div>
                            <button
                              onClick={() => handleTriggerAction(rec.action_type)}
                              className="px-3 py-1.5 bg-sbi-blue border border-sbi-light text-white rounded-lg text-[10px] font-bold shrink-0 hover:bg-sbi-light/20 transition-colors"
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
                              <span className="text-xs font-bold text-sbi-light">
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
                                className="h-full bg-sbi-light transition-all duration-500" 
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
                                <span className="px-1.5 py-0.5 text-[8px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/20 rounded">FLAGGED</span>
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

      {/* Mobile Drawer (optional overlay for sidebar settings) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/90 z-40 p-6 flex flex-col justify-between sm:hidden">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <span className="font-bold text-white">Menu Navigation</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4 mt-6">
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
                    onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold ${
                      activeTab === tab.id ? 'bg-sbi-blue border border-sbi-light text-white' : 'text-slate-400'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
            SBI Hackathon © GFF 2026
          </div>
        </div>
      )}
    </div>
  );
}
