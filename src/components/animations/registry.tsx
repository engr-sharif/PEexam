import { lazy, Suspense, type ComponentType } from 'react';

// Map lesson `animation.component` names to interactive components.
const registry: Record<string, ComponentType> = {
  MohrsCircle: lazy(() => import('./MohrsCircle')),
  HorizontalCurve: lazy(() => import('./HorizontalCurve')),
  BaseShearSpectrum: lazy(() => import('./BaseShearSpectrum')),
  StressProfile: lazy(() => import('./StressProfile')),
  ConsolidationCurve: lazy(() => import('./ConsolidationCurve')),
  VerticalCurveViz: lazy(() => import('./VerticalCurveViz')),
};

export function Animation({ name }: { name: string }) {
  const Cmp = registry[name];
  if (!Cmp) {
    return (
      <div className="rounded-lg border border-dashed border-slate-600 p-4 text-sm text-slate-400">
        Interactive “{name}” coming soon.
      </div>
    );
  }
  return (
    <Suspense fallback={<div className="p-4 text-sm text-slate-400">Loading interactive…</div>}>
      <Cmp />
    </Suspense>
  );
}
