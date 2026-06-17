"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { parseCSV, parseLabText } from "@/lib/parser";
import { extractTextFromPDF } from "@/lib/pdf";
import { buildReviewFlags } from "@/lib/ranges";
import { calculateCategoryScores, calculateOverallScore } from "@/lib/scoring";
import { generateId, loadReports, saveReports } from "@/lib/storage";
import type {
  AppState,
  BloodworkReport,
  ExtractedMarker,
  MainTab,
  MarkerValue,
  RangeMode,
  SecondaryTab,
} from "@/lib/types";

interface AppContextValue extends AppState {
  setMainTab: (tab: MainTab) => void;
  setLogView: (view: AppState["logView"]) => void;
  setSecondaryTab: (tab: SecondaryTab) => void;
  setCycleMode: (mode: AppState["cycleMode"]) => void;
  setRangeMode: (mode: RangeMode) => void;
  setMarkerValue: (markerId: string, value: number | null, unit: string) => void;
  setCurrentValues: (values: Record<string, MarkerValue>) => void;
  parseAndExtract: (text: string, fileName?: string) => void;
  handleFileUpload: (file: File) => Promise<void>;
  toggleExtracted: (id: string) => void;
  selectAllCurrent: () => void;
  selectAbnormalOnly: () => void;
  selectConvertedOnly: () => void;
  deselectAll: () => void;
  applySelected: () => void;
  saveReport: (name?: string) => void;
  loadReport: (id: string) => void;
  deleteReport: (id: string) => void;
  resetAll: () => void;
  setCompareReports: (a: string | null, b: string | null) => void;
  setShowComparison: (show: boolean) => void;
  reviewFlags: ReturnType<typeof buildReviewFlags>;
  categoryScores: ReturnType<typeof calculateCategoryScores>;
  overallScore: ReturnType<typeof calculateOverallScore>;
  activeReport: BloodworkReport | null;
}

const AppContext = createContext<AppContextValue | null>(null);

const initialState: AppState = {
  mainTab: "log",
  logView: "landing",
  secondaryTab: null,
  cycleMode: null,
  rangeMode: "optimized",
  currentValues: {},
  extractedMarkers: [],
  extractionFileName: "",
  reports: [],
  activeReportId: null,
  compareReportIds: [null, null],
  showComparison: false,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    const reports = loadReports();
    setState((s) => ({ ...s, reports }));
  }, []);

  const setMainTab = useCallback((tab: MainTab) => {
    setState((s) => ({ ...s, mainTab: tab, showComparison: false }));
  }, []);

  const setLogView = useCallback((view: AppState["logView"]) => {
    setState((s) => ({ ...s, logView: view }));
  }, []);

  const setSecondaryTab = useCallback((tab: SecondaryTab) => {
    setState((s) => ({ ...s, secondaryTab: tab }));
  }, []);

  const setCycleMode = useCallback((mode: AppState["cycleMode"]) => {
    setState((s) => ({ ...s, cycleMode: mode }));
  }, []);

  const setRangeMode = useCallback((mode: RangeMode) => {
    setState((s) => ({ ...s, rangeMode: mode }));
  }, []);

  const setMarkerValue = useCallback((markerId: string, value: number | null, unit: string) => {
    setState((s) => {
      const next = { ...s.currentValues };
      if (value === null || isNaN(value)) {
        delete next[markerId];
      } else {
        next[markerId] = { markerId, value, unit };
      }
      return { ...s, currentValues: next };
    });
  }, []);

  const setCurrentValues = useCallback((values: Record<string, MarkerValue>) => {
    setState((s) => ({ ...s, currentValues: values }));
  }, []);

  const parseAndExtract = useCallback((text: string, fileName = "Pasted Results") => {
    const extracted = parseLabText(text);
    setState((s) => ({
      ...s,
      extractedMarkers: extracted,
      extractionFileName: fileName,
      logView: "extraction",
      mainTab: "log",
    }));
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    let text = "";
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "pdf") {
      text = await extractTextFromPDF(file);
    } else if (ext === "csv") {
      text = await file.text();
      const extracted = parseCSV(text);
      setState((s) => ({
        ...s,
        extractedMarkers: extracted,
        extractionFileName: file.name,
        logView: "extraction",
        mainTab: "log",
      }));
      return;
    } else {
      text = await file.text();
    }

    const extracted = parseLabText(text);
    setState((s) => ({
      ...s,
      extractedMarkers: extracted,
      extractionFileName: file.name,
      logView: "extraction",
      mainTab: "log",
    }));
  }, []);

  const toggleExtracted = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      extractedMarkers: s.extractedMarkers.map((m) =>
        m.id === id ? { ...m, selected: !m.selected } : m
      ),
    }));
  }, []);

  const selectAllCurrent = useCallback(() => {
    setState((s) => ({
      ...s,
      extractedMarkers: s.extractedMarkers.map((m) => ({ ...m, selected: !m.isHistorical })),
    }));
  }, []);

  const selectAbnormalOnly = useCallback(() => {
    setState((s) => ({
      ...s,
      extractedMarkers: s.extractedMarkers.map((m) => ({
        ...m,
        selected: m.labStatus !== "lab-normal",
      })),
    }));
  }, []);

  const selectConvertedOnly = useCallback(() => {
    setState((s) => ({
      ...s,
      extractedMarkers: s.extractedMarkers.map((m) => ({
        ...m,
        selected: !!m.converted,
      })),
    }));
  }, []);

  const deselectAll = useCallback(() => {
    setState((s) => ({
      ...s,
      extractedMarkers: s.extractedMarkers.map((m) => ({ ...m, selected: false })),
    }));
  }, []);

  const applySelected = useCallback(() => {
    setState((s) => {
      const next = { ...s.currentValues };
      for (const m of s.extractedMarkers) {
        if (m.selected) {
          next[m.markerId] = {
            markerId: m.markerId,
            value: m.value,
            unit: m.unit,
            sourceValue: m.sourceValue,
            sourceUnit: m.sourceUnit,
            converted: m.converted,
          };
        }
      }
      return { ...s, currentValues: next, logView: "flags" };
    });
  }, []);

  const saveReport = useCallback((name?: string) => {
    setState((s) => {
      const values = Object.values(s.currentValues);
      if (values.length === 0) return s;

      const report: BloodworkReport = {
        id: generateId(),
        name: name || s.extractionFileName || `Report ${s.reports.length + 1}`,
        date: new Date().toLocaleDateString("en-GB"),
        createdAt: new Date().toISOString(),
        values,
        source: s.extractionFileName,
      };

      const reports = [report, ...s.reports];
      saveReports(reports);
      return { ...s, reports, activeReportId: report.id };
    });
  }, []);

  const loadReport = useCallback((id: string) => {
    setState((s) => {
      const report = s.reports.find((r) => r.id === id);
      if (!report) return s;
      const currentValues: Record<string, MarkerValue> = {};
      for (const v of report.values) {
        currentValues[v.markerId] = v;
      }
      return { ...s, currentValues, activeReportId: id, mainTab: "insights" };
    });
  }, []);

  const deleteReport = useCallback((id: string) => {
    setState((s) => {
      const reports = s.reports.filter((r) => r.id !== id);
      saveReports(reports);
      return { ...s, reports, activeReportId: s.activeReportId === id ? null : s.activeReportId };
    });
  }, []);

  const resetAll = useCallback(() => {
    setState({ ...initialState, reports: loadReports() });
  }, []);

  const setCompareReports = useCallback((a: string | null, b: string | null) => {
    setState((s) => ({ ...s, compareReportIds: [a, b] }));
  }, []);

  const setShowComparison = useCallback((show: boolean) => {
    setState((s) => ({ ...s, showComparison: show }));
  }, []);

  const reviewFlags = useMemo(
    () =>
      buildReviewFlags(
        Object.values(state.currentValues),
        new Date().toLocaleDateString("en-GB"),
        state.rangeMode
      ),
    [state.currentValues, state.rangeMode]
  );

  const categoryScores = useMemo(
    () => calculateCategoryScores(state.currentValues, state.rangeMode),
    [state.currentValues, state.rangeMode]
  );

  const overallScore = useMemo(
    () => calculateOverallScore(categoryScores),
    [categoryScores]
  );

  const activeReport = useMemo(
    () => state.reports.find((r) => r.id === state.activeReportId) ?? null,
    [state.reports, state.activeReportId]
  );

  const value: AppContextValue = {
    ...state,
    setMainTab,
    setLogView,
    setSecondaryTab,
    setCycleMode,
    setRangeMode,
    setMarkerValue,
    setCurrentValues,
    parseAndExtract,
    handleFileUpload,
    toggleExtracted,
    selectAllCurrent,
    selectAbnormalOnly,
    selectConvertedOnly,
    deselectAll,
    applySelected,
    saveReport,
    loadReport,
    deleteReport,
    resetAll,
    setCompareReports,
    setShowComparison,
    reviewFlags,
    categoryScores,
    overallScore,
    activeReport,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}