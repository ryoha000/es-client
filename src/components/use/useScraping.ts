import * as Request from 'request-promise-native';
import * as Charset from 'chardet';
import * as iconv   from 'iconv-lite';
import { JSDOM }    from 'jsdom';

const baseURL = 'https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki'

const useScraping = () => {
  const getDocument = async (url: string) => {
    const option = {
      url: url,
      encoding: null
    };
    const response = await Request.get(option);
  
    // 文字コード判別
    const encoding = Charset.detect(response)?.toString();
    if(!encoding) throw new Error();
  
    // 文字コード変換
    const html: string = iconv.decode(response, encoding);
  
    // HTMLパース
    const jsdom = new JSDOM(html);
    return jsdom.window.document;
  }
  const getTitle = async () => {
    const document = await getDocument(baseURL)
    return document.title
  }
  const getGameDetail = async (id: number) => {
    const url = baseURL + `/game.php?game=${id}`
    const document = await getDocument(url)
    const elm = document.querySelector('hogehoge');
    return elm
  }
  return { getTitle, getGameDetail }
}

export default useScraping