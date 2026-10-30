import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  Sparkles, 
  FastForward, 
  Info,
  Clock
} from 'lucide-react';

export const TimeLapseControl: React.FC = () => {
  const { 
    activeTimelapseDayIndex, 
    setActiveTimelapseDayIndex, 
    isTimelapsePlaying, 
    setIsTimelapsePlaying,
    timelapseDays,
    currentDayState
  } = useAppState();

  const handlePlayToggle = () => {
    if (activeTimelapseDayIndex >= timelapseDays.length && !isTimelapsePlaying) {
      setActiveTimelapseDayIndex(1);
      setIsTimelapsePlaying(true);
    } else {
      setIsTimelapsePlaying(!isTimelapsePlaying);
    }
  };

  const handleReset = () => {
    setIsTimelapsePlaying(false);
    setActiveTimelapseDayIndex(1);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-5 sm:p-7 rounded-3xl border border-teal-500/30 shadow-xl space-y-5">
      
      {/* Top Title & Judge Explainer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">
                Pillar 3 Demonstration Engine
              </span>
              <span className="text-[10px] font-mono bg-teal-400/20 text-teal-200 px-2 py-0.5 rounded font-bold">
                Time-Lapse Simulator
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Community Health Pressure Evolution (7-Day Replay)
            </h2>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-medium hidden sm:block">
          Watch early-warning alerts trigger as community symptoms aggregate over time.
        </span>
      </div>

      {/* Scrubber Days Row */}
      <div className="space-y-3">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {timelapseDays.map((day) => {
            const isActive = day.dayIndex === activeTimelapseDayIndex;
            const isSpikeDay = day.dayIndex === 5 || day.dayIndex === 6;
            
            return (
              <button
                type="button"
                key={day.dayIndex}
                onClick={() => {
                  setIsTimelapsePlaying(false);
                  setActiveTimelapseDayIndex(day.dayIndex);
                }}
                className={`p-2 sm:p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md scale-102 font-extrabold ring-2 ring-teal-300'
                    : isSpikeDay
                    ? 'bg-red-950/60 border-red-800/80 text-red-200 hover:bg-red-900/60 font-semibold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="block text-[10px] font-mono uppercase opacity-75">
                  Day {day.dayIndex}
                </span>
                <span className="text-xs sm:text-sm font-bold block truncate">
                  {day.dayIndex === 1 ? 'Base' : day.dayIndex === 5 ? 'Alert' : `D${day.dayIndex}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Playback Controls & Quick Milestones */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayToggle}
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              {isTimelapsePlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>Pause Time-Lapse</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{activeTimelapseDayIndex >= 7 ? 'Replay Simulation' : 'Play Time-Lapse'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs transition-all cursor-pointer"
              title="Reset to Day 1 Baseline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Jump Shortcuts for Judges */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Jump to:</span>
            
            <button
              type="button"
              onClick={() => { setIsTimelapsePlaying(false); setActiveTimelapseDayIndex(1); }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 font-mono text-[11px] font-semibold cursor-pointer"
            >
              Day 1 (Normal)
            </button>

            <button
              type="button"
              onClick={() => { setIsTimelapsePlaying(false); setActiveTimelapseDayIndex(5); }}
              className="px-2.5 py-1 rounded-lg bg-red-900/60 hover:bg-red-800/80 text-red-200 border border-red-700 font-mono text-[11px] font-bold cursor-pointer animate-pulse"
            >
              Day 5 (Alert Spike)
            </button>

            <button
              type="button"
              onClick={() => { setIsTimelapsePlaying(false); setActiveTimelapseDayIndex(7); }}
              className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700 font-mono text-[11px] font-semibold cursor-pointer"
            >
              Day 7 (Stabilized)
            </button>
          </div>

        </div>
      </div>

      {/* Current Day Narrative Event Box */}
      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-teal-300 font-bold uppercase flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {currentDayState.dateLabel} Telemetry
          </span>
          <span className="text-slate-300 font-mono">
            {currentDayState.screeningsCount} screenings processed across district
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          {currentDayState.eventDescription}
        </p>
      </div>

    </div>
  );
};
