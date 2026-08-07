import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  Application,
  ApplicationInput,
  ApplicationStatus,
  DashboardStats,
  STATUSES,
  createApplication,
  deleteApplication,
  fetchApplications,
  fetchStats,
  updateApplication,
} from './api'

type View = 'dashboard' | 'kanban' | 'list'

const emptyForm: ApplicationInput = {
  company: '',
  position: '',
  location: '',
  salary: null,
  job_link: '',
  date_applied: '',
  status: 'Saved',
  notes: '',
  recruiter_contact: '',
  next_action: '',
  follow_up_date: '',
}

function cleanPayload(data: ApplicationInput): ApplicationInput {
  return {
    ...data,
    location: data.location || null,
    salary: data.salary === null || data.salary === undefined || Number.isNaN(Number(data.salary))
      ? null
      : Number(data.salary),
    job_link: data.job_link || null,
    date_applied: data.date_applied || null,
    notes: data.notes || null,
    recruiter_contact: data.recruiter_contact || null,
    next_action: data.next_action || null,
    follow_up_date: data.follow_up_date || null,
  }
}

function statusClass(status: ApplicationStatus) {
  const map: Record<ApplicationStatus, string> = {
    Saved: 'bg-slate-100 text-slate-700',
    Applied: 'bg-sky-100 text-sky-800',
    Assessment: 'bg-amber-100 text-amber-800',
    Interview: 'bg-indigo-100 text-indigo-800',
    'Final Interview': 'bg-violet-100 text-violet-800',
    Offer: 'bg-emerald-100 text-emerald-800',
    Rejected: 'bg-rose-100 text-rose-800',
  }
  return map[status]
}

export default function App() {
  const [view, setView] = useState<View>('dashboard')
  const [apps, setApps] = useState<Application[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [form, setForm] = useState<ApplicationInput>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [list, dash] = await Promise.all([
        fetchApplications({
          q: q || undefined,
          status: statusFilter || undefined,
        }),
        fetchStats(),
      ])
      setApps(list)
      setStats(dash)
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 200)
    return () => clearTimeout(t)
  }, [q, statusFilter])

  const recent = useMemo(() => apps.slice(0, 5), [apps])
  const byStatus = useMemo(() => {
    const groups: Record<ApplicationStatus, Application[]> = {
      Saved: [],
      Applied: [],
      Assessment: [],
      Interview: [],
      'Final Interview': [],
      Offer: [],
      Rejected: [],
    }
    for (const app of apps) groups[app.status].push(app)
    return groups
  }, [apps])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(app: Application) {
    setEditingId(app.id)
    setForm({
      company: app.company,
      position: app.position,
      location: app.location || '',
      salary: app.salary,
      job_link: app.job_link || '',
      date_applied: app.date_applied || '',
      status: app.status,
      notes: app.notes || '',
      recruiter_contact: app.recruiter_contact || '',
      next_action: app.next_action || '',
      follow_up_date: app.follow_up_date || '',
    })
    setShowForm(true)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const payload = cleanPayload(form)
      if (editingId) await updateApplication(editingId, payload)
      else await createApplication(payload)
      setShowForm(false)
      setForm(emptyForm)
      setEditingId(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  async function onDelete(id: number) {
    if (!confirm('确定删除？')) return
    await deleteApplication(id)
    await load()
  }

  async function onStatusChange(id: number, status: ApplicationStatus) {
    await updateApplication(id, { status })
    await load()
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--accent)]">JOB TRACKER</p>
          <h1 className="mt-1 text-4xl font-bold text-[var(--ink)] sm:text-5xl">APPLYFLOW</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['dashboard', 'kanban', 'list'] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                view === v
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-white/80 text-[var(--muted)] ring-1 ring-[var(--line)]'
              }`}
            >
              {v === 'dashboard' ? 'Dashboard' : v === 'kanban' ? 'Kanban' : 'List'}
            </button>
          ))}
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-[var(--ink)] px-3 py-2 text-sm font-medium text-white"
          >
            + Add
          </button>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search company, position..."
          className="min-w-[220px] flex-1 rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      {view === 'dashboard' && stats && (
        <section className="mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Applications', stats.total_applications],
              ['This Month', stats.this_month],
              ['Interviews', stats.interviews],
              ['Response Rate', `${stats.response_rate}%`],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[var(--line)]">
                <p className="text-sm text-[var(--muted)]">{label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-[var(--line)]">
            <h2 className="mb-4 text-lg font-semibold">Recent Applications</h2>
            <ul className="divide-y divide-[var(--line)]">
              {recent.map((app) => (
                <li key={app.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="font-medium">{app.company}</p>
                    <p className="text-sm text-[var(--muted)]">{app.position}</p>
                  </div>
                  <span className={`rounded-md px-2 py-1 text-xs font-medium ${statusClass(app.status)}`}>
                    {app.status}
                  </span>
                </li>
              ))}
              {!recent.length && <li className="py-6 text-sm text-[var(--muted)]">暂无申请</li>}
            </ul>
          </div>
        </section>
      )}

      {view === 'kanban' && (
        <section className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {STATUSES.map((status) => (
            <div
              key={status}
              className="w-64 shrink-0 rounded-2xl bg-white/80 p-3 ring-1 ring-[var(--line)]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                const id = Number(e.dataTransfer.getData('text/plain'))
                if (id) await onStatusChange(id, status)
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">{status}</h3>
                <span className="text-xs text-[var(--muted)]">{byStatus[status].length}</span>
              </div>
              <div className="space-y-2">
                {byStatus[status].map((app) => (
                  <article
                    key={app.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', String(app.id))}
                    className="cursor-grab rounded-xl bg-[var(--accent-soft)] p-3 active:cursor-grabbing"
                    onClick={() => openEdit(app)}
                  >
                    <p className="font-medium">{app.company}</p>
                    <p className="text-xs text-[var(--muted)]">{app.position}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {view === 'list' && (
        <section className="mb-8 overflow-hidden rounded-2xl bg-white/90 shadow-sm ring-1 ring-[var(--line)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Position</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Applied</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3 font-medium">{app.company}</td>
                  <td className="px-4 py-3">{app.position}</td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => onStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className="rounded border border-[var(--line)] bg-white px-2 py-1"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{app.date_applied || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="mr-2 text-[var(--accent)]" onClick={() => openEdit(app)}>
                      Edit
                    </button>
                    <button type="button" className="text-[var(--danger)]" onClick={() => onDelete(app.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!apps.length && !loading && (
            <p className="px-4 py-8 text-center text-sm text-[var(--muted)]">暂无申请，点击 Add 开始</p>
          )}
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={onSubmit}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="mb-4 text-xl font-semibold">{editingId ? 'Edit Application' : 'Add Application'}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ['company', 'Company', 'text', true],
                  ['position', 'Position', 'text', true],
                  ['location', 'Location', 'text', false],
                  ['salary', 'Salary', 'number', false],
                  ['job_link', 'Job Link', 'url', false],
                  ['date_applied', 'Date Applied', 'date', false],
                  ['recruiter_contact', 'Recruiter/Contact', 'text', false],
                  ['next_action', 'Next Action', 'text', false],
                  ['follow_up_date', 'Follow-up Date', 'date', false],
                ] as const
              ).map(([key, label, type, required]) => (
                <label key={key} className="block text-sm">
                  <span className="mb-1 block text-[var(--muted)]">{label}</span>
                  <input
                    required={required}
                    type={type}
                    value={
                      key === 'salary'
                        ? form.salary ?? ''
                        : String(form[key] ?? '')
                    }
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        [key]:
                          key === 'salary'
                            ? e.target.value === ''
                              ? null
                              : Number(e.target.value)
                            : e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
                  />
                </label>
              ))}
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block text-[var(--muted)]">Status</span>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as ApplicationStatus }))
                  }
                  className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block text-[var(--muted)]">Notes</span>
                <textarea
                  value={form.notes || ''}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg px-4 py-2 text-sm text-[var(--muted)] ring-1 ring-[var(--line)]"
              >
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
