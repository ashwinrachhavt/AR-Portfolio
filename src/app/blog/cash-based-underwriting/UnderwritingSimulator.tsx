"use client";

import React, { useState, useMemo } from "react";
import styles from "./underwriting.module.css";

export default function UnderwritingSimulator() {
  const [avgDailyBalance, setAvgDailyBalance] = useState<number>(150000);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(85000);
  const [monthlyBurn, setMonthlyBurn] = useState<number>(55000);
  const [volatility, setVolatility] = useState<"low" | "medium" | "high">("low");
  const [overdraftCount, setOverdraftCount] = useState<number>(0);

  // Underwriting calculations
  const calculations = useMemo(() => {
    // Net cash flow
    const netCashFlow = monthlyRevenue - monthlyBurn;

    // Volatility multiplier
    const volMultiplier = volatility === "low" ? 0.28 : volatility === "medium" ? 0.20 : 0.12;

    // Overdraft penalty
    const overdraftPenalty = Math.max(0, 1 - overdraftCount * 0.35);

    // Raw calculated limit
    let computedLimit = Math.round(avgDailyBalance * volMultiplier * overdraftPenalty);

    // Minimum balance floor requirement (e.g. $10,000)
    if (avgDailyBalance < 15000 || overdraftCount >= 3) {
      computedLimit = 0;
    }

    // Cap limit at 3x monthly revenue
    computedLimit = Math.min(computedLimit, monthlyRevenue * 3);

    // Round to nearest $500
    computedLimit = Math.round(computedLimit / 500) * 500;

    // Risk Tier Assignment
    let riskTier = "Tier 1: Prime Liquidity";
    let riskColor = "#22c55e";
    let auditAction = "Auto-approved for instant card issuance";

    if (computedLimit === 0) {
      riskTier = "Declined / High Ineligibility";
      riskColor = "#ef4444";
      auditAction = "Route to human credit committee with risk notice";
    } else if (volatility === "high" || overdraftCount >= 1 || netCashFlow < -30000) {
      riskTier = "Tier 3: Guarded / Manual Review";
      riskColor = "#f59e0b";
      auditAction = "Requires underwriter verification and balance monitoring";
    } else if (volatility === "medium" || netCashFlow < 0) {
      riskTier = "Tier 2: Standard Risk";
      riskColor = "#3b82f6";
      auditAction = "Approved with weekly automated recalculation";
    }

    // Runway estimation in months
    const runwayMonths = netCashFlow >= 0 ? "Infinite (Positive Cashflow)" : (avgDailyBalance / Math.abs(netCashFlow)).toFixed(1) + " months";

    return {
      netCashFlow,
      computedLimit,
      riskTier,
      riskColor,
      auditAction,
      runwayMonths,
    };
  }, [avgDailyBalance, monthlyRevenue, monthlyBurn, volatility, overdraftCount]);

  return (
    <div className={styles.simulatorCard}>
      <div className={styles.simulatorHeader}>
        <div>
          <span className={styles.simBadge}>FINALLY CREDIT ENGINE SIMULATION</span>
          <h3 className={styles.simTitle}>90-Day Transactional Solvency Model</h3>
        </div>
        <div className={styles.statusIndicator}>
          <span className={styles.simDot} style={{ background: calculations.riskColor }} />
          <span>{calculations.riskTier.split(":")[0]}</span>
        </div>
      </div>

      <div className={styles.simulatorBody}>
        {/* Controls Column */}
        <div className={styles.controlsCol}>
          <div className={styles.controlGroup}>
            <div className={styles.controlLabelRow}>
              <label htmlFor="adb-slider">90-Day Average Daily Balance (ADB)</label>
              <span className={styles.controlValue}>${avgDailyBalance.toLocaleString()}</span>
            </div>
            <input
              id="adb-slider"
              type="range"
              min={10000}
              max={1000000}
              step={5000}
              value={avgDailyBalance}
              onChange={(e) => setAvgDailyBalance(Number(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.sliderRange}>
              <span>$10k</span>
              <span>$500k</span>
              <span>$1M</span>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlLabelRow}>
              <label htmlFor="rev-slider">Monthly Gross Inflows / Revenue</label>
              <span className={styles.controlValue}>${monthlyRevenue.toLocaleString()}</span>
            </div>
            <input
              id="rev-slider"
              type="range"
              min={10000}
              max={500000}
              step={5000}
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              className={styles.rangeInput}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlLabelRow}>
              <label htmlFor="burn-slider">Monthly Net Outflows / Operating Burn</label>
              <span className={styles.controlValue}>${monthlyBurn.toLocaleString()}</span>
            </div>
            <input
              id="burn-slider"
              type="range"
              min={5000}
              max={400000}
              step={5000}
              value={monthlyBurn}
              onChange={(e) => setMonthlyBurn(Number(e.target.value))}
              className={styles.rangeInput}
            />
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.subhead}>Cash Volatility & Variance</label>
            <div className={styles.pillGroup}>
              {(["low", "medium", "high"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`${styles.pillBtn} ${volatility === level ? styles.pillBtnActive : ""}`}
                  onClick={() => setVolatility(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)} Variance
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.subhead}>Overdraft / Liquidity Breach Incidents (90 Days)</label>
            <div className={styles.pillGroup}>
              {[0, 1, 2, 3].map((count) => (
                <button
                  key={count}
                  type="button"
                  className={`${styles.pillBtn} ${overdraftCount === count ? styles.pillBtnActive : ""}`}
                  onClick={() => setOverdraftCount(count)}
                >
                  {count === 3 ? "3+ incidents" : `${count} incidents`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Output Column */}
        <div className={styles.resultsCol}>
          <div className={styles.resultBox}>
            <span className={styles.resultEyebrow}>RECOMMENDED CREDIT LIMIT</span>
            <div className={styles.limitValue}>
              ${calculations.computedLimit.toLocaleString()}
            </div>
            <span className={styles.limitSub}>
              {calculations.computedLimit > 0
                ? `${((calculations.computedLimit / avgDailyBalance) * 100).toFixed(0)}% of 90-day Average Daily Balance`
                : "No credit line extended due to risk thresholds"}
            </span>
          </div>

          <div className={styles.metricsList}>
            <div className={styles.metricRow}>
              <span className={styles.metricName}>Risk Classification</span>
              <span className={styles.metricVal} style={{ color: calculations.riskColor }}>
                {calculations.riskTier}
              </span>
            </div>

            <div className={styles.metricRow}>
              <span className={styles.metricName}>Monthly Net Cash Flow</span>
              <span className={styles.metricVal} style={{ color: calculations.netCashFlow >= 0 ? "#22c55e" : "#ef4444" }}>
                {calculations.netCashFlow >= 0 ? "+" : ""}${calculations.netCashFlow.toLocaleString()}
              </span>
            </div>

            <div className={styles.metricRow}>
              <span className={styles.metricName}>Liquidity Runway</span>
              <span className={styles.metricVal}>{calculations.runwayMonths}</span>
            </div>

            <div className={styles.metricRow}>
              <span className={styles.metricName}>Weekly Recalculation Cadence</span>
              <span className={styles.metricVal}>Active (Sunday 23:59 UTC)</span>
            </div>
          </div>

          <div className={styles.decisionBanner}>
            <span className={styles.decisionLabel}>AUTOMATED AUDIT DECISION</span>
            <p className={styles.decisionText}>{calculations.auditAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
