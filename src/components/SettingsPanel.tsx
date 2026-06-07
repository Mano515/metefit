import { useEffect, useRef } from 'react'
import type { ThermalProfile } from '../types'
import { ThermalSelector } from './ThermalSelector'
import { ThermalAutoNotice } from './ThermalAutoNotice'
import { NotificationBanner } from './NotificationBanner'

interface Props {
  open: boolean
  onClose: () => void
  profile: ThermalProfile
  onProfileChange: (p: ThermalProfile) => void
  autoAdjust: number
  onDismissAutoAdjust: () => void
  notifPermission: NotificationPermission
  onRequestNotif: () => void
  dark: boolean
  onToggleDark: () => void
}

export function SettingsPanel({
  open, onClose,
  profile, onProfileChange,
  autoAdjust, onDismissAutoAdjust,
  notifPermission, onRequestNotif,
  dark, onToggleDark,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Focus le bouton fermer à l'ouverture
  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  // Fermer sur Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Focus trap : ramener le focus dans le panel si on sort par Tab
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

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        id="settings-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        aria-hidden={!open}
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white dark:bg-gray-900 shadow-xl z-30 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 id="settings-title" className="text-base font-semibold text-gray-800 dark:text-gray-100">Paramètres</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fermer les paramètres"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Dark mode */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-lg">{dark ? '🌙' : '☀️'}</span>
              <span id="dark-mode-label" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {dark ? 'Mode sombre' : 'Mode clair'}
              </span>
            </div>
            <button
              role="switch"
              aria-checked={dark}
              aria-labelledby="dark-mode-label"
              onClick={onToggleDark}
              className={`relative w-11 h-6 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${dark ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${dark ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

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
    </>
  )
}
