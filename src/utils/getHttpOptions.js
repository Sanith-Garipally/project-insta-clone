/* eslint-disable import/prefer-default-export */
import Cookies from 'js-cookie'

export const httpOptions = (method = 'GET') => {
  const jwtToken = Cookies.get('jwt_token')
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  }
  return options
}
