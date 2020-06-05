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
    const prevLists: List[] = []
    try {
      const jsonLists = JSON.parse(await readFileConsoleErr('setting/lists.json'))
      if (!Array.isArray(jsonLists)) await override('setting/lists.json', JSON.stringify([list]))
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
    } catch(e) {
      console.error(e)
      await override('setting/lists.json', JSON.stringify([list]))
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
  const readListGames = async (id: number) => {
    const listGames: Record<number, ListGame> = {}
    try {
      const jsonLists: List[] = JSON.parse(await readFileConsoleErr('setting/lists.json'))
      if (!Array.isArray(jsonLists)) throw new Error()
      for (const jsonList of jsonLists) {
        if (jsonList.id === id) {
          for (const g of jsonList.games) {
            listGames[g.id] = g
          }
          break
        }
      }
    } catch (e) {
      console.error(e)
    }
    return listGames
  }
  return { jsonSetup, updateOrInsertList, readFileConsoleErr, getHaveGame, override, readListGames }
}

export default useJson