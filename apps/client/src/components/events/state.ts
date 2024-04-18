import { proxy, useSnapshot } from 'valtio'

type ControlsProxy = {
  createEventFormOpen: boolean
}

export const controlsProxy = proxy<ControlsProxy>({
  createEventFormOpen: false,
})

export const createEventFormControls = {
  open: (): void => {
    controlsProxy.createEventFormOpen = true
  },

  close: (): void => {
    controlsProxy.createEventFormOpen = false
  },

  toggle: (): void => {
    controlsProxy.createEventFormOpen = !controlsProxy.createEventFormOpen
  },
}

export const useControlsSnapshot = () => useSnapshot(controlsProxy)
