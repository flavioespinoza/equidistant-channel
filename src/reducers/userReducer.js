const log = require('ololog').configure({
  locate: false
})

export default function reducer(state={
  fetching: false,
  fetched: false,
  id: null,
  name: null,
  age: null,
  call_sign: null,
  error: null,
  authentication_status: false,
  exchange_name: null,
}, action) {

  switch (action.type) {

    case 'SET_USER': {
      // console.log('SET_USER', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        id: action.payload.id,
        name: action.payload.name,
        age: action.payload.age,
        call_sign: action.payload.call_sign,
      }
    }
    case 'SET_AUTHENTICATION_STATUS': {
      // log.yellow('SET_AUTHENTICATION_STATUS', JSON.stringify(action.payload, null, 2))
      return {
        ...state,
        fetching: false,
        fetched: true,
        authentication_status: action.payload,
      }
    }
    case 'SET_EXCHANGE_NAME': {
      // log.yellow('SET_EXCHANGE_NAME', JSON.stringify(action.payload, null, 2))
      return {
        ...state,
        fetching: false,
        fetched: true,
        exchange_name: action.payload,
      }
    }
    case 'SET_USER_NAME': {
      // console.log('SET_USER_NAME', action.payload)
      return {
        ...state,
        fetching: false,
        fetched: true,
        name: action.payload
      }
    }
    case 'SET_USER_AGE': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        age: action.payload
      }
    }
    case 'SET_USER_CALL_SIGN': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        callSign: action.payload
      }
    }
  }

  return state

}