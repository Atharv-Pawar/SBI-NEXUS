import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, TrendingUp, HelpCircle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function DigitalTwin({ profile, goals, onActionTriggered }) {
  const [spendingCut, setSpendingCut] = useState(10);
  const [sipIncrease, setSipIncrease] = useState(2500);
  const [targetYear, setTargetYear] = useState(5);
  
  const [simulationData, setSimulationData] = useState(null);
  const [loadingSim, setLoadingSim] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch simulation results from backend API
  const runSimulation = async () => {
    setLoadingSim(true);
    try {
      const response = await fetch('http://localhost:8000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sip_increase: parseFloat(sipIncrease),
          spending_cut_percent: parseFloat(spendingCut),
          home_loan_target_year: parseInt(targetYear)
        })
      });
      if (response.ok) {
        const data = await response.json();
        setSimulationData(data);
      }
    } catch (e) {
      console.error("Simulation request failed", e);
      // Fallback local calculations if offline
      simulateOffline();
    } finally {
      setLoadingSim(false);
    }
  };

  const simulateOffline = () => {
    // Basic local simulation in case backend is loading
    const income = profile.monthly_income || 75000.0;
    const current_savings = profile.savings_balance || 150000.0;
    const discretionary = profile.discretionary_spending || 25000.0;
    const fixed_expenses = profile.fixed_expenses || 35000.0;
    
    const baseline_monthly_savings = Math.max(0, income - fixed_expenses - discretionary);
    const saved_discretionary = discretionary * (spendingCut / 100.0);
    const simulated_monthly_surplus = baseline_monthly_savings + saved_discretionary;
    const actual_sip = Math.min(sipIncrease, simulated_monthly_surplus);
    const simulated_savings = simulated_monthly_surplus - actual_sip;

    const projections = [];
    let b_wealth = current_savings;
    let s_wealth = current_savings;
    
    for (let month = 1; month <= 120; month++) {
      b_wealth += baseline_monthly_savings;
      b_wealth *= (1 + 0.03 / 12);
      
      s_wealth += simulated_savings;
      s_wealth *= (1 + 0.03 / 12);
      
      const s_sip_contrib = (profile.has_sip ? 2000 : 0) + actual_sip;
      const s_sip_wealth = s_sip_contrib * month * (1 + 0.12 / 12); // simple linear compounding estimate
      
      if (month % 3 === 0 || month === 120) {
        projections.append({
          month,
          year: parseFloat((month / 12).toFixed(1)),
          baseline_wealth: Math.round(b_wealth),
          simulated_wealth: Math.round(s_wealth + s_sip_wealth)
        });
      }
    }

    setSimulationData({
      projections,
      summary: {
        baseline_wealth_10yr: projections[projections.length - 1].baseline_wealth,
        simulated_wealth_10yr: projections[projections.length - 1].simulated_wealth,
        wealth_difference_10yr: projections[projections.length - 1].simulated_wealth - projections[projections.length - 1].baseline_wealth,
        baseline_house_met_years: 5.0,
        simulated_house_met_years: 3.5,
        monthly_savings_baseline: baseline_monthly_savings,
        monthly_savings_simulated: simulated_savings,
        monthly_sip_simulated: actual_sip
      },
      recommendations: [
        { product: "SBI Mutual Fund SIP", reason: "Allocating simulated surplus.", action: "sip_open" }
      ]
    });
  };

  useEffect(() => {
    runSimulation();
  }, [spendingCut, sipIncrease, targetYear, profile]);

  const handleAction = async (actionType, productAmount) => {
    setActionLoading(actionType);
    let endpoint = '/api/mock-sbi/activate-yono';
    let payload = {};

    if (actionType === 'sip_open') {
      endpoint = '/api/mock-sbi/open-sip';
      payload = { amount: productAmount || sipIncrease };
    } else if (actionType === 'fd_open') {
      endpoint = '/api/mock-sbi/open-fd';
      payload = { amount: 50000.0 };
    } else if (actionType === 'autopay_setup') {
      endpoint = '/api/mock-sbi/activate-autopay';
      payload = { frequency: 'Monthly', amount: sipIncrease };
    } else if (actionType === 'loan_apply') {
      // Simulate loan application
      alert(`SBI Home Loan Pre-Approval submitted! An agent will review your income of ₹${profile.monthly_income?.toLocaleString()} and contact you shortly.`);
      setActionLoading(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        onActionTriggered();
      }
    } catch (e) {
      console.error("Action triggers failed", e);
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl">
          <p className="text-[10px] font-bold text-slate-400">Year {payload[0].payload.year} (Month {payload[0].payload.month})</p>
          <p className="text-xs text-white mt-1">
            Simulated (Twin): <span className="font-extrabold text-sbi-light">{formatCurrency(payload[0].value)}</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Baseline: <span className="font-semibold">{formatCurrency(payload[1].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-5 md:col-span-2 space-y-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Financial Twin Controls</span>
          
          {/* Slider 1: Spending Reduction */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Curb Discretionary Spending</span>
              <span className="font-bold text-sbi-light">{spendingCut}% cut (saves {formatCurrency(profile.discretionary_spending * (spendingCut / 100))}/mo)</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={spendingCut}
              onChange={(e) => setSpendingCut(parseInt(e.target.value))}
              className="w-full accent-sbi-light bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
            />
          </div>

          {/* Slider 2: SIP Scaling */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Add to SBI Mutual Fund SIP</span>
              <span className="font-bold text-sbi-light">+{formatCurrency(sipIncrease)}/mo</span>
            </div>
            <input
              type="range"
              min="500"
              max="20000"
              step="500"
              value={sipIncrease}
              onChange={(e) => setSipIncrease(parseInt(e.target.value))}
              className="w-full accent-sbi-light bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
            />
          </div>

          {/* Selector 3: Home Loan Target */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                Target Home Downpayment Year
              </span>
              <span className="font-bold text-sbi-light">{targetYear} Years</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[3, 4, 5, 7, 10].map(y => (
                <button
                  key={y}
                  onClick={() => setTargetYear(y)}
                  className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                    targetYear === y
                      ? 'bg-sbi-blue/40 border-sbi-light text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {y} Yrs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projections Summary Card */}
        {simulationData && (
          <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-950">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sbi-light/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <span className="text-[10px] bg-sbi-light/20 text-sbi-light font-bold px-2 py-0.5 rounded-full border border-sbi-light/20">TWIN SIMULATION SUCCESS</span>
              <h4 className="text-white font-bold mt-3 text-sm">10-Year Wealth Difference</h4>
              <p className="text-2xl font-extrabold text-white mt-1.5 tracking-tight flex items-baseline gap-1">
                {formatCurrency(simulationData.summary.wealth_difference_10yr)}
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5"><TrendingUp className="w-3.5 h-3.5" /> Growth</span>
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-normal">
                By investing your discretionary spending cuts into a mutual fund SIP (estimated 12%), your net wealth projections grow significantly.
              </p>
            </div>

            <div className="border-t border-slate-800/80 pt-3 mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Baseline Wealth:</span>
                <span className="text-slate-300 font-semibold">{formatCurrency(simulationData.summary.baseline_wealth_10yr)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Simulated Wealth:</span>
                <span className="text-white font-extrabold">{formatCurrency(simulationData.summary.simulated_wealth_10yr)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 10-Year Area Chart */}
      <div className="glass-panel rounded-2xl p-5">
        <h4 className="font-bold text-white text-sm mb-4">10-Year Cumulative Net Wealth Forecast</h4>
        <div className="h-64 w-full">
          {simulationData && simulationData.projections ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulationData.projections} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a4e4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00a4e4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} label={{ value: 'Years', position: 'insideBottomRight', offset: -5, fill: '#475569' }} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="simulated_wealth" stroke="#00a4e4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSimulated)" />
                <Area type="monotone" dataKey="baseline_wealth" stroke="#475569" strokeWidth={1.5} fillOpacity={1} fill="url(#colorBaseline)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Calculating Twin projections...
            </div>
          )}
        </div>
      </div>

      {/* Recommended Action Calls */}
      {simulationData && simulationData.recommendations && simulationData.recommendations.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-sbi-light">
          <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sbi-light" /> Digital Twin Recommendations
          </h4>
          <div className="space-y-3">
            {simulationData.recommendations.map((rec, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white">{rec.product}</span>
                  <p className="text-[11px] text-slate-400 leading-normal">{rec.reason}</p>
                </div>
                <button
                  onClick={() => handleAction(rec.action)}
                  disabled={actionLoading === rec.action}
                  className="px-4 py-2 bg-sbi-blue border border-sbi-light hover:bg-sbi-light/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 self-start sm:self-center"
                >
                  {actionLoading === rec.action ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>Apply Recommendation <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
