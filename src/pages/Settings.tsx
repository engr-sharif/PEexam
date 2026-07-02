import { useRef, useState } from 'react';
import { EXAMS } from '../data/exams';
import { useProgress } from '../store/progress';
import { buildStudyPlanIcs, downloadIcs } from '../lib/ics';
import { Card } from '../components/ui';

export function Settings() {
  const { settings, updateSettings, exportState, importState, resetAll } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [daysPerWeek, setDaysPerWeek] = useState(4);

  const downloadCalendar = () => {
    const ics = buildStudyPlanIcs({
      examDates: settings.examDates,
      examNames: Object.fromEntries(EXAMS.map((e) => [e.id, e.shortName])),
      weeklyHours,
      daysPerWeek,
    });
    downloadIcs('ca-pe-study-plan.ics', ics);
    setMsg('Calendar downloaded — import it into Google/Apple Calendar.');
  };

  const download = () => {
    const blob = new Blob([exportState()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ca-pe-prep-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importState(String(reader.result));
      setMsg(ok ? 'Progress imported ✓' : 'Import failed — invalid file.');
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-slate-400">Your progress is stored in this browser. Back it up to move devices.</p>
      </header>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-slate-200">Study preferences</h2>
        <label className="block text-sm text-slate-300">
          Primary exam (drives recommendations)
          <select
            value={settings.primaryExam}
            onChange={(e) => updateSettings({ primaryExam: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          >
            {EXAMS.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-sm text-slate-300">
          Daily goal: <span className="font-semibold text-brand-300">{settings.dailyGoalMinutes} min</span>
          <input
            type="range"
            min={15}
            max={180}
            step={15}
            value={settings.dailyGoalMinutes}
            onChange={(e) => updateSettings({ dailyGoalMinutes: Number(e.target.value) })}
            className="mt-1 w-full accent-brand-500"
          />
        </label>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={settings.showTimerWarnings}
            onChange={(e) => updateSettings({ showTimerWarnings: e.target.checked })}
            className="accent-brand-500"
          />
          Show low-time warnings during mock exams
        </label>
      </Card>

      <Card>
        <h2 className="mb-1 text-sm font-semibold text-slate-200">Exam dates</h2>
        <p className="mb-3 text-xs text-slate-400">Set your scheduled dates to get a countdown and pacing on the dashboard.</p>
        <div className="space-y-3">
          {EXAMS.map((e) => (
            <label key={e.id} className="flex items-center justify-between gap-3 text-sm text-slate-300">
              <span>{e.shortName}</span>
              <input
                type="date"
                value={settings.examDates[e.id] ?? ''}
                onChange={(ev) => updateSettings({ examDates: { ...settings.examDates, [e.id]: ev.target.value } })}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-100"
              />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 text-sm font-semibold text-slate-200">Study calendar (.ics)</h2>
        <p className="mb-3 text-xs text-slate-400">
          Generate a study schedule from your exam dates and import it into Google/Apple/Outlook Calendar.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-300">
            Hours per week: <span className="font-semibold text-brand-300">{weeklyHours} h</span>
            <input type="range" min={2} max={30} value={weeklyHours} onChange={(e) => setWeeklyHours(Number(e.target.value))} className="mt-1 w-full accent-brand-500" />
          </label>
          <label className="block text-sm text-slate-300">
            Days per week: <span className="font-semibold text-brand-300">{daysPerWeek}</span>
            <input type="range" min={1} max={7} value={daysPerWeek} onChange={(e) => setDaysPerWeek(Number(e.target.value))} className="mt-1 w-full accent-brand-500" />
          </label>
        </div>
        <button
          onClick={downloadCalendar}
          disabled={!Object.values(settings.examDates).some(Boolean)}
          className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          📅 Download study calendar
        </button>
        {!Object.values(settings.examDates).some(Boolean) && (
          <p className="mt-2 text-xs text-amber-400">Set at least one exam date above first.</p>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-slate-200">Backup & restore</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={download} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
            Export progress (.json)
          </button>
          <button onClick={() => fileRef.current?.click()} className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200">
            Import progress
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={onImport} className="hidden" />
        </div>
        {msg && <p className="mt-2 text-xs text-emerald-400">{msg}</p>}
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-semibold text-rose-300">Danger zone</h2>
        <button
          onClick={() => {
            if (confirm('Erase all progress? This cannot be undone.')) {
              resetAll();
              setMsg('All progress reset.');
            }
          }}
          className="rounded-lg border border-rose-700 px-4 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-600/10"
        >
          Reset all progress
        </button>
      </Card>
    </div>
  );
}
