import React from 'react';
import { motion } from 'motion/react';

interface ScoreGaugeProps {
  score: number; // 0 - 100
  size?: number; // width/height in px
  strokeWidth?: number;
  showLabel?: boolean;
  sublabel?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 180,
  strokeWidth = 14,
  showLabel = true,
  sublabel
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 85) return { stroke: '#10B981', gradientFrom: '#10B981', gradientTo: '#3B82F6', label: 'Exceptional', textClass: 'text-emerald-500' };
    if (val >= 70) return { stroke: '#3B82F6', gradientFrom: '#3B82F6', gradientTo: '#8B5CF6', label: 'Fluent', textClass: 'text-blue-500' };
    if (val >= 55) return { stroke: '#F59E0B', gradientFrom: '#F59E0B', gradientTo: '#EF4444', label: 'Understandable', textClass: 'text-amber-500' };
    return { stroke: '#EF4444', gradientFrom: '#EF4444', gradientTo: '#F97316', label: 'Needs Practice', textClass: 'text-rose-500' };
  };

  const colorConfig = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={`gaugeGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorConfig.gradientFrom} />
              <stop offset="100%" stopColor={colorConfig.gradientTo} />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />

          {/* Animated active track */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gaugeGradient-${score})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-baseline"
          >
            <span className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {score}
            </span>
            <span className="text-lg font-semibold text-slate-400 dark:text-slate-500 ml-0.5">%</span>
          </motion.div>
          {showLabel && (
            <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${colorConfig.textClass}`}>
              {colorConfig.label}
            </span>
          )}
        </div>
      </div>

      {sublabel && (
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium text-center">
          {sublabel}
        </span>
      )}
    </div>
  );
};
