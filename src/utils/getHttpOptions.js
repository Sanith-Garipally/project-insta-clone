/* eslint-disable import/prefer-default-export */
import Cookies from 'js-cookie'

export const httpOptions = (method = 'GET') => {
  const jwtToken = Cookies.get('jwt_token')
  let options
  if (method === 'GET') {
    options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  } else {
    options = {
      method,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  }
  return options
}
