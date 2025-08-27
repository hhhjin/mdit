import { relaunch } from '@tauri-apps/plugin-process'
import {
  check,
  type DownloadEvent,
  type Update,
} from '@tauri-apps/plugin-updater'
import { useCallback, useEffect } from 'react'
import { toast } from 'sonner'

export function Updater() {
  const isDev = import.meta.env.DEV

  const downloadAndInstall = useCallback(async (update: Update) => {
    try {
      await update.downloadAndInstall((event: DownloadEvent) => {
        switch (event.event) {
          case 'Started':
          case 'Progress':
          case 'Finished':
            break
          default:
            break
        }
      })

      toast.success('New version available', {
        position: 'bottom-left',
        action: {
          label: 'Restart',
          onClick: () => relaunch(),
        },
        duration: 10_000,
      })
    } catch (err) {
      console.error('Failed to download and install update:', err)
    }
  }, [])

  const checkForUpdates = useCallback(async () => {
    if (isDev) return

    try {
      const update = await check()

      if (update) {
        downloadAndInstall(update)
      }
    } catch (err) {
      console.error('Failed to check for updates:', err)
    }
  }, [downloadAndInstall])

  useEffect(() => {
    checkForUpdates()
  }, [checkForUpdates])

  return null
}
