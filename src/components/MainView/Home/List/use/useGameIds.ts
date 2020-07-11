import { MinimalGame } from 'src/types/root'
import useJudgeGame from 'src/components/use/useJudgeGame'
import parse from 'csv-parse';
import fs from 'fs'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useGameIds = (allMinimalGame: Record<string, MinimalGame>) => {
  const { isLinkAsGame } = useJudgeGame(allMinimalGame)
  const toNumArrFromNumStr = (strs: string[]) => {
    return strs.map(v => {
      const num = Number(v)
      if (isNaN(num)) throw '入力されたIDが数字でありません'
      return num
    })
  }
  const toIdArrFromTitle = (strs: string[]) => {
    const unknownTitles: string[] = []
    const ids: number[] = []
    for (const title of strs) {
      const id = isLinkAsGame(title)
      if (id === 0) {
        unknownTitles.push(title)
        continue
      }
      ids.push(id)
    }
    return { ids: ids, unknownTitles: unknownTitles }
  }
  const toIdArrFromCSV = (path: string) => {
    let res: { ids: number[], unknownTitles: string[] } = { ids: [], unknownTitles: [] }
    //処理（跡でpipeに食べさせる
    const parser = parse((error, data: string[][]) => {

      //内容出力
      console.log('初期データ');
      console.log(data);

      const titles: string[] = [];
      for (const row of data) {
        for (const col of row) {
          titles.push(col)
        }
      }

      console.log('処理データ');
      console.log(titles);

      res = toIdArrFromTitle(titles)
    })
    fs.createReadStream(path).pipe(parser);
    return res
  }
  return { toNumArrFromNumStr, toIdArrFromTitle, toIdArrFromCSV }
}

export default useGameIds