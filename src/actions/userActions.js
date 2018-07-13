export function setUSER(user) {
  return {
    type: 'SET_USER',
    payload: user
  }
}

export function setUserName (name) {
  return {
    type: 'SET_USER_NAME',
    payload: name

  }
}

export function setUserAge (age) {
  return {
    type: 'SET_USER_AGE',
    payload: age
  }
}

export function setUserCallSign (callSign) {
  return {
    type: 'SET_USER_CALL_SIGN',
    payload: callSign
  }
}