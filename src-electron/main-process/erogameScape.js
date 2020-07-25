/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import axios from 'axios';
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

const getCookieString = async () => {
  const cookies = await session.defaultSession.cookies.get({ url: 'https://erogamescape.dyndns.org' })
  if (cookies.length < 3) {
    throw '右上から批評空間にログインしてください'
  }
  let cookieStr = ''
  for (const c of cookies) {
    cookieStr += `${c.name}=${c.value};`
  }
  return cookieStr
}

export const postReview = async (id, reviewForm) => {
  try {
    const config = axiosConfig(await getCookieString())
    const reviewPage = await axios.get(
      `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/contents_game.php?game_id=${id}`,
      config
    )
    const params = getFormData(reviewPage.data, reviewForm)
    const resClient = await axios.post(
      'https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/contents_game_insert.php',
      params,
      config
    )
  } catch (e) {
    console.log(e)
  }
  return
}

const getFormData = (data, reviewForm) => {
  const doms = getDocument(data)
  const params = new URLSearchParams();
  for (const selector of ['input', 'select', 'textarea']) {
    const formDOMs = doms.querySelectorAll(selector)
    for (const d of formDOMs) {
      const name = d.getAttribute('name')
      if (name) {
        if (name.includes('music') && name.includes('tokuten')) {
          params.append(name, '-')
          continue
        }
        const f = reviewForm.find(v => v.key === name)
        if (f) {
          params.append(f.key, f.value)
          continue
        }
        const value = d.getAttribute('value')
        if (value === 'on') {
          continue
        }
        params.append(name, value ? value : '')
      }
    }
  }
  return params
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
    for (const h of Object.entries(resClient.headers)) {
      if (h[0] === 'set-cookie' && Array.isArray(h[1])) {
        for (const c of h[1]) {
          if (typeof c === 'string') {
            await session.defaultSession.cookies.set({ url: 'https://erogamescape.dyndns.org', name: c.split(';')[0].split('=')[0], value: c.split(';')[0].split('=')[1] })
          }
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
  return
}
