import CocoClass from 'core/CocoClass'
import { me } from 'core/auth'
import storage from 'core/storage'
import authUtils from '../../lib/auth-util'
import _ from 'lodash'

const GPLUS_TOKEN_KEY = 'gplusToken'
const clientID = '800329290710-j9sivplv2gpcdgkrsis9rff3o417mlfa.apps.googleusercontent.com'
const API_KEY = 'AIzaSyDW8CsHHJbAREZw8uXg0Hix8dtlJnuutls'

class GPlusHandler extends CocoClass {
  constructor () {
    super()
    if (!me.useSocialSignOn()) {
      throw new Error('Social single sign on not supported')
    }
    this.accessToken = storage.load(GPLUS_TOKEN_KEY, true)
    this.startedLoading = false
    this.apiLoaded = false
    this.connected = false
    this.person = null
  }

  token () {
    return this.accessToken?.access_token
  }

  fakeAPI () {
    window.gapi = {
      client: {
        init () {},
        load (api, version, cb) { return cb() },
        people: {
          people: {
            get () {
              return {
                execute (cb) {
                  return cb({
                    resourceName: 'people/abcd',
                    names: [{
                      givenName: 'Mr',
                      familyName: 'Bean'
                    }],
                    emailAddresses: [{value: 'some@email.com'}]
                  })
                }
              }
            }
          }
        },

        auth2: {
          authorize (opts, cb) {
            return cb({
              access_token: '1234'
            })
          }
        }
      }
    }

    window.google = {
      accounts: {
        id: {
          initialize () {},
          renderButton () {},
          prompt () {}
        }
      }
    }

    this.startedLoading = true
    this.apiLoaded = true
  }

  fakeConnect () {
    this.accessToken = { access_token: '1234' }
    return this.trigger('connect')
  }

  loadAPI (options) {
    if (options == null) { options = {} }
    if (options.success == null) { options.success = _.noop }
    if (options.context == null) { options.context = options }
    if (this.apiLoaded) {
      options.success.bind(options.context)()
    } else {
      this.once('load-api', options.success, options.context)
    }

    if (!this.startedLoading) {
      window.init = () => {
        this.apiLoaded = true
        return this.trigger('load-api')
      }
      const po = document.createElement('script')
      po.type = 'text/javascript'
      po.async = true
      po.defer = true
      po.src = 'https://accounts.google.com/gsi/client'
      const s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(po, s)
      po.addEventListener('load', window.init)

      window.initGapi = () => {
        return window.gapi.load('client', () => window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        }))
      }
      const po1 = document.createElement('script')
      po1.type = 'text/javascript'
      po1.async = true
      po1.defer = true
      po1.src = 'https://apis.google.com/js/api.js'
      const s1 = document.getElementsByTagName('script')[0]
      s1.parentNode.insertBefore(po1, s1)
      po1.addEventListener('load', window.initGapi)

      this.startedLoading = true
    }
  }

  connect (options) {
    if (options == null) { options = {} }
    if (options.success == null) { options.success = _.noop }
    if (options.context == null) { options.context = options }
    window.google.accounts.id.initialize({
      client_id: clientID,
      callback: resp => {
        this.trigger('connect')
        return options.success.bind(options.context)(resp)
      }
    })
    const elementId = options.elementId || 'google-login-button'
    if (document.getElementById(elementId)) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'outline',
          size: 'large'
        }
      )
    }
    window.google.accounts.id.prompt()
  }

  loadPerson (options) {
    if (options == null) { options = {} }
    if (options.success == null) { options.success = _.noop }
    if (options.context == null) { options.context = options }
    if (options.resp == null) { options.resp = null }
    if (options.resp) {
      const attrs = authUtils.parseGoogleJwtResponse(options.resp.credential)
      this.trigger('load-person', attrs)
      options.success.bind(options.context)(attrs)
    } else {
      console.error('gplus login failed', options)
    }
  }

  renderButtons () {
    if ((typeof gapi !== 'undefined' && gapi !== null ? gapi.plusone : undefined) == null) { return false }
    return (typeof gapi.plusone.go === 'function' ? gapi.plusone.go() : undefined) // Handles +1 button
  }

  requestGoogleAuthorization (scope, callbackFn) {
    const authClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientID,
      scope,
      callback: resp => {
        this.accessToken = resp
        storage.save(GPLUS_TOKEN_KEY, this.accessToken, 30)
        setTimeout(() => {
          this.accessToken = null
        }, this.accessToken.expires_in * 1000)
        if (callbackFn) {
          callbackFn()
        }
      }
    })
    return authClient.requestAccessToken({ prompt: 'consent' })
  }

  loadFriends (friendsCallback) {
    if (!this.loggedIn) { return friendsCallback() }
    const expiresIn = this.accessToken ? parseInt(this.accessToken.expires_at) - (new Date().getTime() / 1000) : -1
    const onReauthorized = () => gapi.client.request({
      path: '/plus/v1/people/me/people/visible',
      callback: friendsCallback
    })
    if (expiresIn < 0) {
      // TODO: this tries to open a popup window, which might not ever finish or work, so the callback may never be called.
      this.reauthorize()
      return this.listenToOnce(this, 'logged-in', onReauthorized)
    } else {
      return onReauthorized()
    }
  }

  reauthorize (scope) {
    const params = {
      client_id: clientID,
      scope
    }
    return gapi.auth.authorize(params, this.onGPlusLogin)
  }
}

module.exports = GPlusHandler
