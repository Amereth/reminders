import { proxy, useSnapshot } from 'valtio'

type ControlsProxy = {
  isCreateEventFormOpen: boolean
}

export const controlsProxy = proxy<ControlsProxy>({
  isCreateEventFormOpen: false,
})

export const createEventFormControls = {
  open: (): void => {
    controlsProxy.isCreateEventFormOpen = true
  },

  close: (): void => {
    controlsProxy.isCreateEventFormOpen = false
  },

  toggle: (): void => {
    controlsProxy.isCreateEventFormOpen = !controlsProxy.isCreateEventFormOpen
  },
}

export const useControlsSnapshot = () => useSnapshot(controlsProxy)
