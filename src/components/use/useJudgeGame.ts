import useGetFiles from './useGetFiles'
import getEXEPath from './useGetEXEPath'
import useGetFileIcon from './useGetFileIcon'
import { ListGame, DMM } from '../../types/root'
import { editONP } from './useEditDistance'
import useJson from './useJson'
import { Ref } from '@vue/composition-api'


const useJudgeGame = (allDMM: Ref<Record<number, DMM>>) => {
  const toLowerAndHankaku = (str: string) => {
    const retStr = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    })
    return retStr.toLowerCase()
  }
  const isLinkAsGame = (linkName: string) => {
    let id = 0
    let cleanLinkName = toLowerAndHankaku(linkName)
    const notGameString: string[] = ['マニュアル', '詳細設定', 'はじめに', 'サポート', 'セーブデータ', 'アンインストール', '体験版', 'uninstall', '削除']
    for (const str of notGameString) {
      if (cleanLinkName.includes(str)) {
        return 0
      }
    }
    const validateString = ['を起動', 'の起動', '_単独動作版', '「', '」', ' ', '　']
    validateString.forEach(v => {
      cleanLinkName = cleanLinkName.replace(v, '')
    })
    for (const dmm of Object.entries(allDMM.value)) {
      const gameTitle = toLowerAndHankaku(dmm[1].name)
      if (cleanLinkName.length > 5 && gameTitle.includes(cleanLinkName)) {
        id = dmm[1].id
        break
      }
      if (editONP(cleanLinkName, gameTitle) > 0.8) {
        id = dmm[1].id
        break
      }
    }
    return id
  }
  const getEXE = async (linkPaths: string[]) => {
    // 計測開始
    const start = (new Date()).getTime()
    console.log('start')

    const paths: ListGame[] = []
    
    // .lnkの先のファイルをとってくる関数
    const { getPath } = getEXEPath()

    // 紐づいたファイルの探索Promise
    const promises: Promise<{id: number, path: string}[]>[] = []
    let batch: {id: number, path: string}[] = []
    let i = 0
    for (const linkPath of linkPaths) {
      const linkName = linkPath.split('\\').pop()
      if (!linkName) continue
      if(linkName.includes('美少女')) console.log(linkName)
      const id = isLinkAsGame(linkName.replace(/\.[^/.]+$/, ''))
      if(linkName.includes('美少女')) console.log(id)
      // 拡張子を取り除いてGameかどうか判別
      if (id !== 0) {
        i++
        //batch.push({id: id, path: linkPath})
        promises.push(getPath([{id: id, path: linkPath}]))
      }

      // batch上限は21個
      if (i > 20) {
        i = 0
        console.log(batch)
        promises.push(getPath(batch))
        batch = []
      }

      // 最後が切れないように
      if (linkPaths[linkPaths.length] === linkPath) {
        promises.push(getPath(batch))
      }
    }

    // とりあえず、ゲーム起動と紐づいてると思われる .lnk のPathをあつめたときの処理時間を出力
    console.log('finish prepare promise')
    console.log(`finish: ${(new Date()).getTime() - start}`)

    // .lnkに紐づいたファイルの探索関数
    const { getIcon } = useGetFileIcon()

    // IconをとってくるPromiseの配列を準備
    const promisesI: Promise<{id: number, path: string, icon: string}[]>[] = []

    // つくってた、 .lnk に紐づいてるファイルの Path をとってくるPromiseの解決
    const promiseResultPath = await Promise.allSettled(promises)

    // とってきた .lnk の先のファイルPathを入れていく配列の準備
    const games: {id: number, path: string}[] = []

    // 何故かここでいくつかのObjectのidとpathが入れ替わる。()はバッチでのインデックス
    // いつも入れ替わってるからランダムではなさそう
    // バッチの後ろの方が入れ替わってる気がするけど入れ替わってないのもある
    // 例) {id: 27418, path: 'E:\\Program Files (x86)\\Aonatsu\\Launcher.exe'}(20) と {id: 20228, path: "C:\Users\ユウヤ\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\feng\彼女のセイイキ.lnk"}(18 or 19)
    // 例) {id: 23425, path: "C:\Users\ユウヤ\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\ゆずソフト\千恋＊万花.lnk"}(20) と {id: 27319, path: "C:\Users\ユウヤ\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\インサルトオーダー\インサルトオーダー.lnk"}(19)

    promiseResultPath.forEach((element, i) => {
      // ちゃんとPathをとれてたとき
      if (element.value !== undefined) {
        console.log('batch')
        for (const val of element.value) {
          if (val.path === 'E:\\Program Files (x86)\\Aonatsu\\Launcher.exe') console.log(val) // 変わってる
          if (val.path.startsWith('file://')) {
            games.push({id: val.id, path: val.path.replace('file://', '')})
            continue
          }
          if (val.path.startsWith('http')) {
            continue
          }
          games.push(val)
        }
      } else {
        // Pathが取れてなかったとき
        console.log(element.status)
        console.log(element.value)
      }
    })

    games.forEach((v) => {
      // 複数やるとバグるからとりあえずひとつずつPromise解決
      promisesI.push(getIcon([v]))
    })
    // // 全てのファイルPathからアイコンの探索Promiseを作って、バッチに分けてPromise配列に追加
    // batch = []
    // games.forEach((v, i, arr) => {
    //   batch.push(v)

    //   // 失敗する要素が多いため最大バッチ数は10に
    //   if (i % 10 === 9) {
    //     promisesI.push(getIcon(batch))
    //     batch = []
    //   }

    //   // 最後が切れないように
    //   if (i === arr.length - 1) {
    //     promisesI.push(getIcon(batch))
    //   }
    // })

    // つくってた、ファイルのアイコンをとってくるPromise配列の解決
    const promiseResultIcon = await Promise.allSettled(promisesI)

    // // バッチで失敗したものは、今度は個別でとってくるためPromise配列を初期化
    // promisesI = []

    // // アイコンをとってきた結果から、returnの配列か、個別にとってくるPromise配列に追加
    // promiseResultIcon.forEach((element) => {
    //   // うまく取れたものはreturnの配列に
    //   if (element.value?.[0].icon) {
    //     console.log('success')
    //     paths.push(...element.value.map(v => ({ id: v.id, path: v.path, icon: v.icon})))
    //   } else if (element.value) {
    //     // うまく取れなかったのは個別に取ってくるPromise配列に
    //     for (const p of element.value) {
    //       promisesI.push(getIcon([{id: p.id, path: p.path}]))
    //     }
    //   } else {
    //     console.log(element.status)
    //     console.log(element.value)
    //   }
    // });

    // promiseResultIcon = []
    // promiseResultIcon = await Promise.allSettled(promisesI)
    promiseResultIcon.forEach((element) => {
      if (!element.value) {
        console.log(element.status)
        console.log(element.value)
      } else {
        if (element.value.length > 0) {
          if (element.value[0].icon) {
            console.log('success')
            paths.push(...element.value.map(v => ({ id: v.id, path: v.path, icon: v.icon})))
          } else if (element.value) {
            console.log('結局ダメ＞＜', element.value)
            paths.push(...element.value.map(v => ({ id: v.id, path: v.path, icon: v.icon})))
          } else {
            console.log(element.status)
            console.log(element.value)
          }
        }
      }
    });

    console.log('paths.length=', paths.length)
    console.log(`finish: ${(new Date()).getTime() - start}`)
    return paths
  }
  const searchAll = async() => {
    // .lnkの探索のための関数
    const { showFiles, getUserInstallFile } = useGetFiles()

    // .lnkの探索
    const linkPaths: string[] = await showFiles('C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs')

    const { override, updateOrInsertList } = useJson()
    linkPaths.push(...await getUserInstallFile('C:\\Users'))
    await override('setting/memory.json', JSON.stringify(linkPaths))
    const paths = await getEXE(linkPaths)
    await updateOrInsertList({id: 0, name: '所持ゲーム', games: paths})
    return paths
  }
  const searchDifference = async () => {
    // .lnkの探索のための関数
    const { showFiles, getUserInstallFile } = useGetFiles()

    // .lnkの探索
    const linkPaths: string[] = await showFiles('C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs')

    const { override, readFileConsoleErr, updateOrInsertList, readListGames } = useJson()
    linkPaths.push(...await getUserInstallFile('C:\\Users'))
    try {
      const prevPaths = JSON.parse(await readFileConsoleErr('setting/memory.json'))
      let differencePaths: string[] = []
      if (Array.isArray(prevPaths)) {
        for (const linkPath of linkPaths) {
          if (!prevPaths.includes(linkPath)) {
            differencePaths.push(linkPath)
          }
        }
      } else {
        differencePaths = linkPaths
      }
      await override('setting/memory.json', JSON.stringify(linkPaths))
      const paths = await getEXE(differencePaths)
      const games = await readListGames(0)
      games.push(...paths)
      await updateOrInsertList({id: 0, name: '所持ゲーム', games: games})
      return games
    } catch (e) {
      console.error(e)
      await override('setting/memory.json', JSON.stringify(linkPaths))
      const paths = await getEXE(linkPaths)
      await updateOrInsertList({id: 0, name: '所持ゲーム', games: paths})
      return paths
    }
  }
  return { searchAll, searchDifference }
}

export default useJudgeGame