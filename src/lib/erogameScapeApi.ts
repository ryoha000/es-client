import axios from 'axios';
import { parse } from 'node-html-parser';
import { remote } from 'electron'

export interface PostReviewForm {
  key: string
  value: string
}

const axiosConfig = (c: string) => ({
  headers: {
    'content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html',
    'Cache-Control': 'no-cache',
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    'Cookie': `${c}`
  },
})

const getDocument = (str: string) => {
  // HTMLパース
  return parse(str)
}

const getFormData = (data: string, reviewForm: PostReviewForm[]): URLSearchParams => {
  const doms = getDocument(data)
  const formDOMs = doms.querySelectorAll('input select textarea')
  const params = new URLSearchParams();
  for (const d of formDOMs) {
    const name = d.getAttribute('name')
    console.log(d)
    if (name) {
      const f = reviewForm.find(v => v.key === name)
      if (f) {
        params.append(f.key, f.value)
        continue
      }
      const value = d.getAttribute('value')
      if (value === 'on') {
        continue
      }
      params.append(name, value ?? '')
    }
  }
  return params
}

const getCookieString = async () => {
  const cookies = await remote.session.defaultSession.cookies.get({ url: 'https://erogamescape.dyndns.org' })
  if (cookies.length < 3) {
    throw '右上から批評空間にログインしてください'
  }
  let cookieStr = ''
  for (const c of cookies) {
    cookieStr += `${c.name}=${c.value};`
  }
  return cookieStr
}

export const postReview = async (id: number, reviewForm: PostReviewForm[]) => {
  try {
    const config = axiosConfig(await getCookieString())
    const reviewPage = await axios.get<string>(
      `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/contents_game.php?game_id=${id}`,
      config
    )
    const params = getFormData(reviewPage.data, reviewForm)
    console.log(params)
    // const resClient = await axios.post(
    //   'https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/contents_game_insert.php',
    //   params,
    //   axiosConfig(await getCookieString()),
    // )
  } catch (e) {
    console.log(e)
  }
  return
}