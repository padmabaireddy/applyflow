export const STATUSES = [
  'Saved',
  'Applied',
  'Assessment',
  'Interview',
  'Final Interview',
  'Offer',
  'Rejected',
] as const

export type ApplicationStatus = (typeof STATUSES)[number]

export interface Application {
  id: number
  company: string
  position: string
  location: string | null
  salary: number | null
  job_link: string | null
  date_applied: string | null
  status: ApplicationStatus
  notes: string | null
  recruiter_contact: string | null
  next_action: string | null
  follow_up_date: string | null
  created_at: string
  updated_at: string
}

export interface ApplicationInput {
  company: string
  position: string
  location?: string | null
  salary?: number | null
  job_link?: string | null
  date_applied?: string | null
  status?: ApplicationStatus
  notes?: string | null
  recruiter_contact?: string | null
  next_action?: string | null
  follow_up_date?: string | null
}

export interface DashboardStats {
  total_applications: number
  this_month: number
  interviews: number
  response_rate: number
  by_status: Record<string, number>
  follow_ups_due: number
  follow_ups_overdue: number
}

const BASE = '/api/applications'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export function fetchApplications(params?: { q?: string; status?: string }) {
  const qs = new URLSearchParams()
  if (params?.q) qs.set('q', params.q)
  if (params?.status) qs.set('status', params.status)
  const query = qs.toString()
  return request<Application[]>(`${BASE}${query ? `?${query}` : ''}`)
}

export function fetchStats() {
  return request<DashboardStats>(`${BASE}/stats`)
}

export function fetchFollowUps() {
  return request<Application[]>(`${BASE}/follow-ups`)
}

export function createApplication(data: ApplicationInput) {
  return request<Application>(BASE, { method: 'POST', body: JSON.stringify(data) })
}

export function updateApplication(id: number, data: Partial<ApplicationInput>) {
  return request<Application>(`${BASE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteApplication(id: number) {
  return request<void>(`${BASE}/${id}`, { method: 'DELETE' })
}
