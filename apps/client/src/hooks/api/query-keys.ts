export default {
  events: {
    _: '/events',

    get base() {
      const url = this._
      return { url, key: [url] } as const
    },

    withId(id: string) {
      const url = `${this._}/${id}` as const
      return { url, key: [url, id] } as const
    },

    get paginated() {
      const url = `${this._}/paginated` as const
      return { url, key: [...this.base.key] } as const
    },
  },

  eventLabels: {
    _: '/events/labels',

    get base() {
      const url = this._
      return { url, key: [url] } as const
    },
  },
} as const
