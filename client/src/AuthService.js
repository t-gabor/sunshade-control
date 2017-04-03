import Auth0Lock from 'auth0-lock'
import decode from 'jwt-decode';

function getTokenExpirationDate(token){
  const decoded = decode(token)
  if(!decoded.exp) {
    return null
  }

  const date = new Date(0) // The 0 here is the key, which sets the date to the epoch
  date.setUTCSeconds(decoded.exp)
  return date
}

function isTokenExpired(token){
  const date = getTokenExpirationDate(token)
  if (date === null) {
    return false
  }
  return !(date.valueOf() > new Date().valueOf())
}

export default class AuthService {
    constructor(clientId, domain, reload) {
        // Configure Auth0
        this.lock = new Auth0Lock(clientId, domain, {
            auth: {
                responseType: 'token'
            }
        })
        // Add callback for lock `authenticated` event
        this.lock.on('authenticated', this._doAuthentication.bind(this))
        // binds login functions to keep this context
        this.login = this.login.bind(this)
        this.reload = reload;
    }

    _doAuthentication(authResult) {
        // Saves the user token
        this.setToken(authResult.idToken)
        this.reload();
    }

    login() {
        // Call the show method to display the widget.
        this.lock.show()
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        return !!token && !isTokenExpired(token);
    }

    setToken(idToken) {
        // Saves user token to local storage
        localStorage.setItem('id_token', idToken)
    }

    getToken() {
        // Retrieves the user token from local storage
        return localStorage.getItem('id_token')
    }

    logout() {
        // Clear user token and profile data from local storage
        localStorage.removeItem('id_token');
        this.reload();
    }

    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        // if logged in, includes the authorization header
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus) // to raise errors for wrong status
    }
}