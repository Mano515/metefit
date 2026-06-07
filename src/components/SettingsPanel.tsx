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
}

export function SettingsPanel({
  open, onClose,
  profile, onProfileChange,
  autoAdjust, onDismissAutoAdjust,
  notifPermission, onRequestNotif,
}: Props) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-20"
          onClick={onClose}
        />
      )}

      {/* Panneau */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-xl z-30 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Paramètres</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <ThermalAutoNotice adjust={autoAdjust} onDismiss={onDismissAutoAdjust} />
          <ThermalSelector profile={profile} onChange={onProfileChange} />
          <NotificationBanner permission={notifPermission} onRequest={onRequestNotif} />

          {notifPermission === 'granted' && (
            <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
              🔔 Notifications activées — tu recevras ta tenue chaque matin à l'ouverture de l'app.
            </p>
          )}
          {notifPermission === 'denied' && (
            <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2">
              Notifications bloquées par le navigateur. Autorise-les dans les paramètres de ton navigateur pour les activer.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
