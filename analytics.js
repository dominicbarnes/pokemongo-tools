// global

export function load (writeKey) {
  window.analytics.load(writeKey)
}

// users

export function signUp (username) {
  window.analytics.identify(username)
}

export function signIn (username) {
  window.analytics.identify(username)
}

export function signOut () {
  window.analytics.reset()
}

// pages (via router)

export function page (route) {
  const { meta } = route
  if (meta) {
    const { title } = meta
    window.analytics.page(title, { url: window.location.href })
  }
}

// events
