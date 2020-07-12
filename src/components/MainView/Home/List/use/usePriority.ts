import { ListInServerWithGames, ListInServer } from "src/types/root";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const usePriority = (listInServers: ListInServer[]) => {
  const getMostLowPriority = () => {
    let mostLowPriority = 0
    for (const l of listInServers) {
      const p = l.priority
      if (p < mostLowPriority) {
        mostLowPriority = p
      }
    }
    return mostLowPriority
  }
  const getNewPriority = (newIndex: number) => {
    let prePriority = 0
    let nextPriority = 0
    switch (newIndex) {
      case 0:
        nextPriority = listInServers[newIndex + 1].priority
        return nextPriority - 100
      case listInServers.length - 1:
        prePriority = listInServers[newIndex - 1].priority
        return prePriority + 100
      default:
        prePriority = listInServers[newIndex - 1].priority
        nextPriority = listInServers[newIndex + 1].priority
        return Math.floor((prePriority + nextPriority) / 2)
    }
  }
  return { getMostLowPriority, getNewPriority }
}

export default usePriority