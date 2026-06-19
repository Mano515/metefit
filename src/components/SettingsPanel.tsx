import { useEffect, useRef } from 'react'
import type { ThermalProfile } from '../types'
import { ThermalSelector } from './ThermalSelector'
import { ThermalAutoNotice } from './ThermalAutoNotice'
import { NotificationBanner } from './NotificationBanner'

type View = 'wardrobe' | 'historique'

interface NavItem {
  view: View
  emoji: string
  label: string
  desc: string
}

const NAV_ITEMS: NavItem[] = [
  { view: 'wardrobe',   emoji: '👕', label: 'Garde-robe', desc: 'Mes vêtements & tenues' },
  { view: 'historique', emoji: '📅', label: 'Historique',  desc: 'Tenues portées & retours' },
]

interface Props {
  open: boolean
  onClose: () => void
  profile: ThermalProfile
  onProfileChange: (p: ThermalProfile) => void
  autoAdjust: number
  onDismissAutoAdjust: () => void
  notifPermission: NotificationPermission
  onRequestNotif: () => void
  onNavigate: (view: View) => void
}

export function SettingsPanel({
  open, onClose,
  profile, onProfileChange,
  autoAdjust, onDismissAutoAdjust,
  notifPermission, onRequestNotif,
  onNavigate,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function handleNavigate(view: View) {
    onNavigate(view)
    onClose()
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-20" onClick={onClose} aria-hidden="true" />
      )}

      <div
        id="settings-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        aria-hidden={!open}
        className={`fixed top-0 right-0 h-full w-96 max-w-full bg-white dark:bg-gray-900 shadow-xl z-30 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 id="settings-title" className="text-base font-semibold text-gray-800 dark:text-gray-100">Menu</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fermer le menu"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Navigation : Garde-robe & Historique */}
          <nav aria-label="Sections de l'application">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
              Sections
            </p>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.view}>
                  <button
                    onClick={() => handleNavigate(item.view)}
                    className="w-full flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 text-left hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <span aria-hidden="true" className="text-xl">{item.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.label}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{item.desc}</p>
                    </div>
                    <span aria-hidden="true" className="ml-auto text-gray-300 dark:text-gray-600">›</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Paramètres */}
          <div className="space-y-4">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Paramètres
            </p>

            <ThermalAutoNotice adjust={autoAdjust} onDismiss={onDismissAutoAdjust} />
            <ThermalSelector profile={profile} onChange={onProfileChange} />
            <NotificationBanner permission={notifPermission} onRequest={onRequestNotif} />

            {notifPermission === 'granted' && (
              <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-xl px-3 py-2" role="status">
                <span aria-hidden="true">🔔</span> Notifications activées — tu recevras ta tenue chaque matin à l'ouverture de l'app.
              </p>
            )}
            {notifPermission === 'denied' && (
              <p className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2" role="status">
                Notifications bloquées par le navigateur. Autorise-les dans les paramètres de ton navigateur.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
