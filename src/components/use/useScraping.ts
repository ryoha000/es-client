import * as Request from 'request-promise-native';
import * as Charset from 'chardet';
import * as iconv   from 'iconv-lite';
import { JSDOM }    from 'jsdom';
import { Game, Creator, Seiyu } from '../../types/root'

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
  const getCreator = (elm: HTMLElement) => {
    const creators: Creator[] = []
    const aTags = elm.getElementsByTagName('a');
    for (let i = 0; i < aTags.length; i++) {
      const aTag = aTags[i]
      const creator: Creator = {
        id: +(aTag.getAttribute('href')?.replace('creater.php?creater=', '') ?? '0'),
        name: aTag.innerHTML,
        furigana: '',
        createdAt: new Date()
      }
      creators.push(creator)
    }
    return creators
  }
  const getSeiyu = (elm: HTMLElement) => {
    const creators: Seiyu[] = []
    const aTags = elm.getElementsByTagName('a');
    const spanTags = elm.getElementsByTagName('span');
    for (let i = 0; i < aTags.length; i++) {
      const aTag = aTags[i]
      const creator: Creator = {
        id: +(aTag.getAttribute('href')?.replace('creater.php?creater=', '') ?? '0'),
        name: aTag.innerHTML,
        furigana: '',
        createdAt: new Date()
      }
      if (spanTags.length > i) {
        const color = spanTags[i].getAttribute('style')
        const seiyu: Seiyu = {
          ...creator,
          role: spanTags[i].innerHTML,
          importance: color?.includes('bold') ? 0 : color?.includes('black') ? 1 : 2
        }
        creators.push(seiyu)
      }
    }
    return creators
  }
  const getTitle = async () => {
    const document = await getDocument(baseURL)
    return document.title
  }
  const getGameDetail = async (id: number) => {
    const url = baseURL + `/game.php?game=${id}`
    const doc = await getDocument(url)
    const gameTitle = doc.getElementById('game_title');
    const softTitle = doc.getElementById('soft-title');
    const gengas = doc.getElementById('genga')?.getElementsByTagName('td')[0]
    const sinarios = doc.getElementById('shinario')?.getElementsByTagName('td')[0]
    const seiyus = doc.getElementById('seiyu')?.getElementsByTagName('td')[0]
    const game: Game = {
      id: id,
      name: gameTitle?.getElementsByTagName('a')[0].innerHTML ?? '',
      furigana: '',
      brandId: +(softTitle?.getElementsByTagName('a')[0]?.getAttribute('href')?.replace('brand.php?brand=', '') ?? '0'),
      brandName: softTitle?.getElementsByTagName('a')[0].innerHTML ?? '',
      sellday: softTitle?.getElementsByTagName('a')[1].innerHTML ?? '2030-01-01',
      officialHomePage: gameTitle?.getElementsByTagName('a')[0].getAttribute('href') ?? '',
      median: +(doc.getElementById('median')?.getElementsByTagName('td')[0].innerHTML ?? '0'),
      count: +(doc.getElementById('count')?.getElementsByTagName('td')[0].innerHTML ?? '0'),
      average: +(doc.getElementById('average')?.getElementsByTagName('td')[0].innerHTML ?? '0'),
      imgUrl: doc.getElementById('main_image')?.getElementsByTagName('img')[0]?.getAttribute('src') ?? '',
      gengas: gengas ? getCreator(gengas) : [],
      sinarios: sinarios ? getCreator(sinarios) : [],
      seiyus: seiyus ? getSeiyu(seiyus) : [],
      createdAt: new Date()
    }
    return game
  }
  
  return { getTitle, getGameDetail }
}

export default useScraping