import axios from 'axios';
import AxiosCookiejarSupport from 'axios-cookiejar-support'
import tough from 'tough-cookie'

// Axiosにプラグイン注入
AxiosCookiejarSupport(axios);
const cookieJar = new tough.CookieJar();

const client = axios.create({
  jar: cookieJar, // cookiejarを有効化する
  withCredentials: true, // 依然として必要
});

const getESToken = async () => {
  const loginClient = await client.get<string>('https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/login.php')
  console.log(loginClient)
  const parser = new DOMParser()
  const wrapped = parser.parseFromString(loginClient.data, 'text/html')
  for (const input of wrapped.querySelectorAll('input')) {
    if (input.name === '_token') {
      return input.value
    }
  }
  console.log(cookieJar)
  return ''
}

export const esLogin = async (userId: string, password: string): Promise<string> => {
  const token = await getESToken()
  // return ''
  console.log(token)

  const params = new URLSearchParams();
  params.append('fLoginID', userId);
  params.append('fPassword', password);
  params.append('_token', token);
  params.append('sorce_url', '/~ap2/ero/toukei_kaiseki/');

  const resClient = await client.post<string>(
    'https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/loginExe_ver2.php',
    params,
  )
  console.log('resClient')
  console.log(resClient)
  let header_str = ''
  let setCookieIndex = 0
  for (const h of Object.entries(resClient.headers)) {
    if (h.length < 2 || typeof h[0] !== 'string' || typeof h[1] !== 'string') {
      continue
    }
    if (h[0] === 'set-cookie') {
      setCookieIndex += 1
      if (typeof h[1] === 'string') {
        header_str += h[1].split(';')[0] ?? ''
      }
    }
  }
  // if (setCookieIndex !== 3) {
  //   throw 'ユーザーIDかパスワードが間違っています'
  // }
  return header_str
}

export const google = async () => {
  await axios.get('https://www.google.com/webhp?hl=ja&sa=X&ved=0ahUKEwir44ykpNzqAhVvx4sBHQluA60QPAgH')
}