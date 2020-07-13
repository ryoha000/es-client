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
  const toIdArrFromCSV = async (path: string) => {
    const str = await fs.promises.readFile(path)
    const res: Promise<{ ids: number[], unknownTitles: string[] }> = new Promise((resolve) => {
      parse(str,{}, (error, data: string[][]) => {
        const titles: string[] = [];
        for (const row of data) {
          for (const col of row) {
            titles.push(col)
          }
        }
        const ret = toIdArrFromTitle(titles)
        resolve(ret)
      })
    })
    return await res
  }
  return { toNumArrFromNumStr, toIdArrFromTitle, toIdArrFromCSV }
}

export default useGameIds