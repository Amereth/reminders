export default {
  events: {
    _: '/events',
    base() {
      return [this._] as const
    },
    paginated() {
      return [`${this._}/paginated`] as const
    },
  },
  eventLabels: ['/events/labels'],
} as const
