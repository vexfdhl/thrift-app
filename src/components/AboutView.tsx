import React, { useState } from 'react';
import {
  Leaf,
  DollarSign,
  ArrowRight,
  TrendingDown,
  Droplets,
  CheckCircle2,
  Sparkles,
  School,
  Compass
} from 'lucide-react';

interface AboutViewProps {
  onStartSearch: () => void;
  onExploreDirectory: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartSearch, onExploreDirectory }) => {
  const [thriftGarmentsCount, setThriftGarmentsCount] = useState<number>(4);

  // Environmental impact calculations based on EPA & textile research:
  const waterSavedGallons = thriftGarmentsCount * 700;
  const co2PreventedLbs = (thriftGarmentsCount * 8.2).toFixed(1);
  const moneySavedDollars = thriftGarmentsCount * 24.5;

  return (
    <div className="w-full text-[#2E1F16] font-['Nunito',sans-serif]">
      {/* 1. EDITORIAL HERO MISSION */}
      <section className="w-full bg-[#FBEFD9] py-14 sm:py-20 px-4 sm:px-6 border-b border-[#2E1F16]/10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C1D7C2]/50 border border-[#2E1F16]/10 shadow-2xs">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16]">
              DUVAL COUNTY STUDENT INITIATIVE · EST. 2026
            </span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl font-normal text-[#2E1F16] leading-[1.1]">
            Why we built <span className="font-editorial-italic font-normal text-[#EFAE6E]">thriftit</span>
          </h1>

          <p className="text-[#2E1F16]/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            A student-engineered community network connecting Duval County high schoolers to verified, affordable secondhand clothing — encouraging sustainable closets over disposable fast fashion.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={onStartSearch}
              className="btn-clevr-brown text-sm"
            >
              <span>Search Your High School</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreDirectory}
              className="btn-clevr-outline text-sm"
            >
              <span>Browse Directory</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM VS THE SOLUTION */}
      <section className="w-full bg-[#FBEFD9] py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16] bg-[#C1D7C2]/50 px-2 py-0.5 rounded-full inline-block mb-2">
              THE LOCAL REALITY
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#2E1F16]">
              The Crisis of <span className="font-editorial-italic text-[#EFAE6E]">Fast Fashion</span> in Duval
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Problem Card */}
            <div className="clevr-card p-8 bg-[#F7E09A]/20 border border-[#2E1F16]/10 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-[#2E1F16]/10 text-[#2E1F16] rounded-full text-xs font-bold uppercase tracking-wider">
                  The Problem
                </div>
                <h3 className="font-editorial text-2xl text-[#2E1F16]">
                  Discarded Clothes &amp; Student Budgets
                </h3>
                <ul className="space-y-3.5 text-xs sm:text-sm text-[#2E1F16]/80 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#EFAE6E] mt-2 shrink-0" />
                    <span>
                      <strong className="text-[#2E1F16]">85% of textiles end up in landfills:</strong> Over 17 million tons of municipal textile waste are trashed annually in the U.S., shedding microfibers into the St. Johns River basin and coastal estuaries.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#EFAE6E] mt-2 shrink-0" />
                    <span>
                      <strong className="text-[#2E1F16]">Hidden local racks:</strong> Duval County hosts over 15 incredible charitable and independent thrift stores (City Thrift, Hope's Closet, BEAM, St. Vincent de Paul), yet students frequently don't know where they are or whether fitting rooms are open.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#EFAE6E] mt-2 shrink-0" />
                    <span>
                      <strong className="text-[#2E1F16]">Event outfit markups:</strong> Prom dresses, homecoming outfits, and seasonal updates cost hundreds of dollars when purchased new from retail malls.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2E1F16]/10 text-[11px] text-[#2E1F16]/60 font-medium">
                EPA Municipal Solid Waste &amp; St. Johns Riverkeeper Reports
              </div>
            </div>

            {/* The Solution Card */}
            <div className="clevr-card p-8 bg-white border border-[#2E1F16]/15 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-[#C1D7C2] text-[#2E1F16] rounded-full text-xs font-bold uppercase tracking-wider">
                  Our Community Solution
                </div>
                <h3 className="font-editorial text-2xl text-[#2E1F16]">
                  ThriftFit DuvALL
                </h3>
                <ul className="space-y-3.5 text-xs sm:text-sm text-[#2E1F16]/80 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#C1D7C2] mt-2 shrink-0" />
                    <span>
                      <strong className="text-[#2E1F16]">Campus Proximity Engine:</strong> Real driving distances calculated for all 24 Duval County high schools with instant top 3 closest store recommendations.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#C1D7C2] mt-2 shrink-0" />
                    <span>
                      <strong className="text-[#2E1F16]">Verified Fitting Rooms &amp; Formalwear:</strong> Never guess in parking lots. Filter stores with guaranteed open dressing rooms and banquet racks.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#C1D7C2] mt-2 shrink-0" />
                    <span>
                      <strong className="text-[#2E1F16]">Peer Reviews &amp; Eco Calculator:</strong> Real student ratings on rack organization, cleanliness, and live water/carbon impact metrics.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2E1F16]/10 flex items-center justify-between">
                <button
                  onClick={onStartSearch}
                  className="btn-clevr-brown text-xs py-2 px-4"
                >
                  <span>Locate Stores</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-[#2E1F16] bg-[#F7E09A] px-2.5 py-1 rounded-full">
                  24 Duval High Schools
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUSTAINABILITY CALCULATOR SECTION */}
      <section className="w-full bg-[#F7E09A]/20 py-16 px-4 sm:px-6 border-y border-[#2E1F16]/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#2E1F16] bg-[#C1D7C2]/50 px-2 py-0.5 rounded-full inline-block mb-1">
                MEASURABLE ECOLOGICAL IMPACT
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#2E1F16]">
                Secondhand <span className="font-editorial-italic text-[#EFAE6E]">Impact Calculator</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#2E1F16]/70 mt-1">
                See the tangible water, emissions, and cash saved when students choose local racks over fast fashion.
              </p>
            </div>

            <div className="bg-[#FBEFD9] border border-[#2E1F16]/20 px-4 py-2 rounded-2xl text-center shrink-0 shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#2E1F16]/60 block">
                Secondhand Garments
              </span>
              <span className="font-editorial text-2xl font-bold text-[#2E1F16]">
                {thriftGarmentsCount} items / month
              </span>
            </div>
          </div>

          {/* Slider */}
          <div className="bg-[#FBEFD9] p-6 rounded-2xl border border-[#2E1F16]/15 space-y-3">
            <div className="flex justify-between text-xs font-semibold text-[#2E1F16]/70">
              <span>1 item / mo</span>
              <span>10 items / mo</span>
              <span>20 items / mo</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={thriftGarmentsCount}
              onChange={e => setThriftGarmentsCount(Number(e.target.value))}
              className="w-full accent-[#EFAE6E] cursor-pointer h-2 bg-[#2E1F16]/20 rounded-lg"
            />
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-[#2E1F16]/10 text-center space-y-2 shadow-xs">
              <Droplets className="w-6 h-6 text-[#EFAE6E] mx-auto" />
              <div className="font-editorial text-3xl sm:text-4xl font-bold text-[#2E1F16]">
                {waterSavedGallons.toLocaleString()} <span className="text-lg font-normal">gal</span>
              </div>
              <div className="text-xs font-bold text-[#2E1F16]">Clean Water Preserved</div>
              <div className="text-[11px] text-[#2E1F16]/60">~700 gal per cotton shirt (USGS)</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#2E1F16]/10 text-center space-y-2 shadow-xs">
              <TrendingDown className="w-6 h-6 text-[#C1D7C2] mx-auto" />
              <div className="font-editorial text-3xl sm:text-4xl font-bold text-[#2E1F16]">
                {co2PreventedLbs} <span className="text-lg font-normal">lbs</span>
              </div>
              <div className="text-xs font-bold text-[#2E1F16]">CO₂ Prevented</div>
              <div className="text-[11px] text-[#2E1F16]/60">Factory emissions averted</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#2E1F16]/10 text-center space-y-2 shadow-xs">
              <DollarSign className="w-6 h-6 text-[#EFAE6E] mx-auto" />
              <div className="font-editorial text-3xl sm:text-4xl font-bold text-[#2E1F16]">
                ${moneySavedDollars.toFixed(0)}
              </div>
              <div className="text-xs font-bold text-[#2E1F16]">Student Savings</div>
              <div className="text-[11px] text-[#2E1F16]/60">Compared to mall retail avg</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATEMENT BANNER */}
      <section className="w-full bg-[#2E1F16] py-16 sm:py-20 px-4 text-center">
        <h2 className="font-editorial-italic text-4xl sm:text-6xl text-[#EFAE6E] font-normal leading-tight">
          Do it daily.
        </h2>
        <p className="text-[#FBEFD9]/80 text-sm mt-3 max-w-md mx-auto">
          Better for your budget, better for Duval, better for the planet.
        </p>
        <button
          onClick={onStartSearch}
          className="mt-6 btn-clevr-clay text-sm"
        >
          Explore Your High School Radius
        </button>
      </section>
    </div>
  );
};
