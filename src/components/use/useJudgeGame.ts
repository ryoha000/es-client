import useGetFiles from './useGetFiles'
import getEXEPath from './useGetEXEPath'
import useGetFileIcon from './useGetFileIcon'
import { ListGame } from '../../types/root'


const useJudgeGame = () => {
  const getEXE = async () => {
    const start = (new Date()).getTime()
    const { showFiles } = useGetFiles()
    const linkPaths: string[] = await showFiles('C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs')
    const paths: ListGame[] = []
    
    const { getPath } = getEXEPath()
    const promises: Promise<string[]>[] = []
    let batch: string[] = []
    let i = 0
    console.log(linkPaths.length)
    for (const linkPath of linkPaths) {
      i++
      batch.push(linkPath)
      if (i > 20) {
        i = 0
        promises.push(getPath(batch))
        batch = []
      }
    }
    console.log('finish prepare promise')
    console.log(`finish: ${(new Date()).getTime() - start}`)
    
    const { getIcon } = useGetFileIcon()
    let promisesI: Promise<{ filePath: string, icon: string}[]>[] = []
    const promiseResultPath = await Promise.allSettled(promises)
    
    const filePaths: string[] = []
    const icons: string[] = []
    promiseResultPath.forEach((element, i: number) => {
      if (i === 0) console.log(element)
      if (element.value !== undefined) {
        // TODO: ゲームかどうかの判定
        const game: string[] = []
        for (const val of element.value) {
          //promises.push(getIcon([val]))
          if (val.startsWith('file://')) {
            game.push(val.replace('file://', ''))
            continue
          }
          if (val.startsWith('http')) {
            continue
          }
          game.push(val)
        }
        promisesI.push(getIcon(game))
      } else {
        console.log(element.status)
        console.log(element.value)
      }
    });
    
    let promiseResultIcon = await Promise.allSettled(promisesI)
    promisesI = []
    promiseResultIcon.forEach((element, i: number) => {
      if (i === 4) console.log(element)
      if (element.value?.[0].icon) {
        console.log('success')
        paths.push(...element.value.map(v => ({ id: 0, path: v.filePath, icon: v.icon})))
      } else if (element.value) {
        for (const p of element.value) {
          promisesI.push(getIcon([p.filePath]))
        }
      } else {
        console.log(element.status)
        console.log(element.value)
      }
    });

    promiseResultIcon = await Promise.allSettled(promisesI)
    promiseResultIcon.forEach((element, i: number) => {
      if (i === 4) console.log(element)
      if (element.value?.[0].icon) {
        console.log('success')
        paths.push(...element.value.map(v => ({ id: 0, path: v.filePath, icon: v.icon})))
      } else if (element.value) {
        console.log('結局ダメ＞＜', element.value)
      } else {

        console.log(element.status)
        console.log(element.value)
      }
    });

    i = 0
    for (const a of paths) {
      i++
      if (i>50 && i<70) console.log(a)
      if (!a.icon) console.log('icon nothing', a)
    }

    console.log('paths.length=', paths.length)
    console.log(`finish: ${(new Date()).getTime() - start}`)
    return paths
  }
  return { getEXE }
}

export default useJudgeGame