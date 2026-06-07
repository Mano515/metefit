interface Props {
  permission: NotificationPermission
  onRequest: () => void
}

export function NotificationBanner({ permission, onRequest }: Props) {
  if (typeof Notification === 'undefined' || permission !== 'default') return null

  return (
    <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
      <span className="text-xl">🔔</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-blue-800">Notifications matinales</p>
        <p className="text-xs text-blue-600">Reçois ta tenue du jour à l'ouverture de l'app le matin.</p>
      </div>
      <button
        onClick={onRequest}
        className="flex-shrink-0 bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Activer
      </button>
    </div>
  )
}
