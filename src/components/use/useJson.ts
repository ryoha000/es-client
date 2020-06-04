import * as fs from "fs";
import * as iconv from 'iconv-lite'
import { List, ListGame } from "src/types/root";

const useJson = () => {
  const jsonSetup = () => {
    fs.exists('setting', (exist => {
      if (!exist) {
        fs.mkdir('setting', (err) => {
          if (err) throw(err)
          console.log('create setting folder')
        })
      } 
    }))
  }
  const override = async (path: string, data: string) => {
    try {
      await fs.promises.writeFile(path, data, 'utf8')
      console.log(`success override ${path}`)
    } catch (e) {
      console.log(e)
    }
  }
  const readFileConsoleErr = async (path: string) => {
    try {
      return await fs.promises.readFile(path, 'utf8')
    } catch (e) {
      console.error(e)
      throw e
    }
  }
  const updateOrInsertList = async (list: List) => {
    const prevLists = JSON.parse(await readFileConsoleErr('setting/lists.json'))
    if (!Array.isArray(prevLists)) await override('setting/lists.json', JSON.stringify([list]))
    else {
      let exist = false
      const newList: List[] = []
      for (const prevList of prevLists) {
        if (prevList.name === list.name) {
          newList.push(list)
          exist = true
        } else {
          newList.push(prevList)
        }
      }
      if (!exist) {
        newList.push(list)
      }
      await override('setting/lists.json', JSON.stringify(newList))
    }
  }
  const getHaveGame = (lists: List[]) => {
    const haveGame: Record<number, ListGame> = {}
    lists.forEach((element: List) => {
      if (element.id === 0) {
        element.games.forEach(ele => {
          haveGame[ele.id] = ele
        })
        console.log(element.games.length)
      }
    })
    return haveGame
  }
  return { jsonSetup, updateOrInsertList, readFileConsoleErr, getHaveGame, override }
}

export default useJson