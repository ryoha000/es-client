import axios from 'axios';
// import * as Charset from 'chardet';
// import * as iconv   from 'iconv-lite';
import { parse } from 'node-html-parser';
import { session } from 'electron'

const axiosConfig = (c) => ({
  headers: {
  'content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'text/html',
  'Cache-Control': 'no-cache',
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  'Cookie': `${c}`
  },
})

const getDocument = (str) => {
  // HTMLパース
  return parse(str)
}

const getESToken = async () => {
  const loginClient = await axios.get('https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/login.php')
  const wrapped = getDocument(loginClient.data)
  let sess = ''
  for (const h of Object.entries(loginClient.headers)) {
    if (h[0] === 'set-cookie') {
      if (Array.isArray(h[1])) {
        for (const c of h[1]) {
          if (typeof c === 'string') {
            sess = c.split(';')[0]
          }
        }
      }
    }
  }
  for (const input of wrapped.querySelectorAll('input')) {
    if (input.getAttribute('name') === '_token') {
      return [sess, input.getAttribute('value')]
    }
  }
  return [sess, '']
}

export const esLogin = async (userId, password) => {
  const token = await getESToken()

  const params = new URLSearchParams();
  params.append('fLoginID', userId);
  params.append('fPassword', password);
  params.append('_token', token[1]);
  params.append('sorce_url', '/~ap2/ero/toukei_kaiseki/');

  try {
    const resClient = await axios.post(
      'https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/loginExe_ver2.php',
      params,
      axiosConfig(token[0]),
    )
    let setCookieIndex = 0
    for (const h of Object.entries(resClient.headers)) {
      if (h[0] === 'set-cookie' && Array.isArray(h[1])) {
        for (const c of h[1]) {
          if (typeof c === 'string') {
            setCookieIndex += 1
            await session.defaultSession.cookies.set({ url: 'https://erogamescape.dyndns.org', name: c.split(';')[0].split('=')[0], value: c.split(';')[0].split('=')[1] })
          }
        }
      }
    }
    console.log(setCookieIndex)
  } catch (e) {
    console.log(e)
  }
  return
}
