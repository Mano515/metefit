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
        className={`fixed top-0 right-0 h-full w-96 max-w-full bg-white/10 backdrop-blur-2xl border-l border-white/20 shadow-2xl z-30 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/15">
          <h2 id="settings-title" className="text-base font-semibold text-white">Menu</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fermer le menu"
            className="text-white/50 hover:text-white text-xl leading-none p-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Navigation : Garde-robe & Historique */}
          <nav aria-label="Sections de l'application">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
              Sections
            </p>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.view}>
                  <button
                    onClick={() => handleNavigate(item.view)}
                    className="w-full flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-left hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    <span aria-hidden="true" className="text-xl">{item.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-white/50">{item.desc}</p>
                    </div>
                    <span aria-hidden="true" className="ml-auto text-white/30">›</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-white/15" />

          {/* Paramètres */}
          <div className="space-y-4">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wide">
              Paramètres
            </p>

            <ThermalAutoNotice adjust={autoAdjust} onDismiss={onDismissAutoAdjust} />
            <ThermalSelector profile={profile} onChange={onProfileChange} />
            <NotificationBanner permission={notifPermission} onRequest={onRequestNotif} />

            {notifPermission === 'granted' && (
              <p className="text-xs text-white/80 bg-white/15 border border-white/20 rounded-xl px-3 py-2" role="status">
                <span aria-hidden="true">🔔</span> Notifications activées — tu recevras ta tenue chaque matin à l'ouverture de l'app.
              </p>
            )}
            {notifPermission === 'denied' && (
              <p className="text-xs text-white/50 bg-white/10 border border-white/15 rounded-xl px-3 py-2" role="status">
                Notifications bloquées par le navigateur. Autorise-les dans les paramètres de ton navigateur.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
