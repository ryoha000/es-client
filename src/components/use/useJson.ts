/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as fs from 'fs';
import { List, ListGame, History } from 'src/types/root';
import store from 'src/store'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useJson = () => {
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
  const jsonSetup = async () => {
    try {
      await fs.promises.stat('setting')
    } catch (e) {
      console.error(e)
      try {
        await fs.promises.mkdir('setting')
      } catch (e) {
        console.error(e)
        throw(e)
      }
    }
    try {
      await readFileConsoleErr('setting/setting.json')
    } catch (e) {
      try {
        const settings = { isVerbRunAs: false }
        await override('setting/setting.json', JSON.stringify(settings))
      } catch (e) {
        console.error(e)
        throw(e)
      }
    }
  }
  const getLists = async (): Promise<List[]> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(await readFileConsoleErr('setting/lists.json'))
    } catch (e) {
      console.error(e)
      return []
    }
  }
  const updateOrInsertList = async (list: List) => {
    try {
      const jsonLists = JSON.parse(await readFileConsoleErr('setting/lists.json'))
      if (!Array.isArray(jsonLists)) {
        console.log(jsonLists)
        await override('setting/lists.json', JSON.stringify([list]))
      }
      else {
        let exist = false
        const newList: List[] = []
        for (const prevList of jsonLists) {
          if (prevList.id === list.id) {
            newList.push(list)
            exist = true
          } else {
            newList.push(prevList)
          }
        }
        if (!exist) {
          newList.push(list)
        }
        store.commit.app.setLists(newList)
        await override('setting/lists.json', JSON.stringify(newList))
      }
    } catch(e) {
      console.error(e)
      await override('setting/lists.json', JSON.stringify([list]))
    }
  }
  const updateImage = async (path: string, iconPath: string) => {
    try {
      const base64Icon = await fs.promises.readFile(iconPath, 'base64')
      const jsonLists: List[] = JSON.parse(await readFileConsoleErr('setting/lists.json'))
      if (!Array.isArray(jsonLists)) throw new Error()
      for (const jsonList of jsonLists) {
        let isChange = false
        const list: List = jsonList
        list.games = list.games.map(v => {
          if (v.path === path) {
            v.icon = base64Icon
            isChange = true
          }
          return v
        })
        if (isChange) {
          await updateOrInsertList(list)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
  const createNewList = async (listName: string, games: ListGame[]) => {
    try {
      const nowLists: List[] = JSON.parse(await readFileConsoleErr('setting/lists.json'))
      let max = 0
      for (const nl of nowLists) {
        if (max < nl.id) max = nl.id
      }
      await updateOrInsertList({id: max + 1, name: listName, games: games})
    } catch {
      throw new Error()
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
  const getHaveGameIdArray = async () => {
    try {
      const lists: List[] = JSON.parse(await readFileConsoleErr('setting/lists.json'))
      const haveGames: number[] = []
      lists.forEach((element: List) => {
        if (element.id === 0) {
          element.games.forEach(ele => {
            haveGames.push(ele.id)
          })
          console.log(element.games.length)
        }
      })
      return haveGames
    } catch (e) {
      console.error(e)
    }
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
  const addGameToList = async (id :number, game: ListGame) => {
    const list: List = {id: id, name: '', games: [game]}
    try {
      const jsonLists: List[] = JSON.parse(await readFileConsoleErr('setting/lists.json'))
      if (!Array.isArray(jsonLists)) throw new Error()
      for (const jsonList of jsonLists) {
        if (jsonList.id === id) {
          list.name = jsonList.name
          list.games.push(...jsonList.games)
          console.log(list)
          break
        }
      }
      await updateOrInsertList(list)
    } catch (e) {
      console.error(e)
    }
  }
  const removeGameFromList = async (id :number, game: ListGame) => {
    const list: List = {id: id, name: '', games: []}
    try {
      const jsonLists: List[] = JSON.parse(await readFileConsoleErr('setting/lists.json'))
      if (!Array.isArray(jsonLists)) throw new Error()
      for (const jsonList of jsonLists) {
        if (jsonList.id === id) {
          list.name = jsonList.name
          list.games.push(...jsonList.games.filter(v => v.path !== game.path))
          console.log(list)
        }
      }
      await updateOrInsertList(list)
    } catch (e) {
      console.error(e)
    }
  }
  const removeList = async (id :number) => {
    const lists: List[] = []
    try {
      const jsonLists: List[] = JSON.parse(await readFileConsoleErr('setting/lists.json'))
      if (!Array.isArray(jsonLists)) throw new Error()
      for (const jsonList of jsonLists) {
        if (jsonList.id === id) {
          continue
        }
        lists.push(jsonList)
      }
      await override('setting/lists.json', JSON.stringify(lists))
    } catch (e) {
      console.error(e)
    }
  }
  const updateRelation = async (path: string, correctId: number) => {
    const newLists: List[] = []
    try {
      const jsonLists: List[] = JSON.parse(await readFileConsoleErr('setting/lists.json'))
      console.log(jsonLists)
      if (!Array.isArray(jsonLists)) throw new Error()
      for (const jsonList of jsonLists) {
        const games: ListGame[] = []
        for (const game of jsonList.games) {
          if (game.path === path) {
            games.push({id: correctId, path: path, icon: game.icon})
          } else {
            games.push(game)
          }
        }
        newLists.push({id: jsonList.id, name: jsonList.name, games: games})
      }
      console.log(newLists)
      store.commit.app.setLists(newLists)
      await override('setting/lists.json', JSON.stringify(newLists))
    } catch (e) {
      console.error(e)
    }
  }
  const getPlayTime = (start: string, end: string) => {
    const startYear = +(start.split(' ')[0].split('/')[2])
    const startMonth = +(start.split(' ')[0].split('/')[0])
    const startDay = +(start.split(' ')[0].split('/')[1])
    const startHour = +(start.split(' ')[1].split(':')[0])
    const startMinute = +(start.split(' ')[1].split(':')[1])
    const startSecond = +(start.split(' ')[1].split(':')[2])
    const endYear = +(end.split(' ')[0].split('/')[2])
    const endMonth = +(end.split(' ')[0].split('/')[0])
    const endDay = +(end.split(' ')[0].split('/')[1])
    const endHour = +(end.split(' ')[1].split(':')[0])
    const endMinute = +(end.split(' ')[1].split(':')[1])
    const endSecond = +(end.split(' ')[1].split(':')[2])
    const startTime = new Date(startYear, startMonth, startDay, startHour, startMinute, startSecond)
    const endTime = new Date(endYear, endMonth, endDay, endHour, endMinute, endSecond)
    return endTime.getTime() - startTime.getTime()
  }
  const getHistory = async() => {
    try {
      const pt = await readFileConsoleErr('setting/playtime.json')
      const histories: History[] = []
      const start: {id: number, time: string}[] = []
      const nowStart = {id: 0, time: ''}
      const nowEnd = {id: 0, time: ''}
      let isStart = 0
      let isEnd = 0
      for (const row of pt.split('\n')) {
        console.log(row)
        if (isStart === 1) {
          isStart++
          nowStart.id = +(row)
          continue
        }
        if (isStart === 2) {
          isStart++
          nowStart.time = row
          start.push(nowStart)
          continue
        }
        if (isEnd === 1) {
          isEnd++
          nowEnd.id = +(row)
          continue
        }
        if (isEnd === 2) {
          isEnd++
          nowEnd.time = row
          const mirror = start.find(v => v.id === nowEnd.id)
          if (mirror) {
            histories.push({ id: nowEnd.id, time: getPlayTime(mirror.time, nowEnd.time) })
            start.splice(start.findIndex(v => v.id === nowEnd.id), 1)
          }
        }
        if (row === 'start') {
          isStart = 1
          isEnd = 0
          continue
        }
        if (row === 'end') {
          isStart = 0
          isEnd = 1
          continue
        }
      }
      return histories
    } catch (e) {
      await override('setting/playtime.json', '')
      return []
    }
  }
  return {
    jsonSetup,
    updateOrInsertList,
    readFileConsoleErr,
    getHaveGame,
    override,
    readListGames,
    createNewList,
    addGameToList,
    updateRelation,
    removeGameFromList,
    getHistory,
    updateImage,
    getHaveGameIdArray,
    removeList,
    getLists
  }
}

export default useJson