/**
 * Stores user data in sessionStorage.
 *
 * @param {object} userData - The user data to store.
 */
export function storeUserData(userData) {
  sessionStorage.setItem('userData', JSON.stringify(userData))
}

/**
 * Deletes user data from sessionStorage.
 */
export function deleteUserData() {
  sessionStorage.removeItem('userData')
}

export function isLogIn() {
  return !!sessionStorage.getItem('userData')
}

export function getToken() {
  const userData = JSON.parse(sessionStorage.getItem('userData'))
  return userData ? userData.token : null
}
