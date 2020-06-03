import * as fs from 'fs'
import * as path from 'path'

const useGetFile = () => {
  const showFilesDepth1 = async (dirpath: string) => {
    const paths: string[] = []
    return await fs.promises.readdir(dirpath, {withFileTypes: true});
  }
  const showFiles = async (dirpath: string) => {
    let isFinish = false
    const paths: string[] = []
    let searchPaths: string[] = [dirpath]
    let nextSearchPaths: string[] = []
    while (!isFinish) {
      if (searchPaths.length === 0) {
        isFinish = true
        break
      }
      for (const searchPath of searchPaths) {
        const dirents = await showFilesDepth1(searchPath)
        for (const dirent of dirents) {
          const fp = path.join(searchPath, dirent.name);
          if (dirent.isDirectory()) {
            nextSearchPaths.push(fp)
          } else {
            if (!fp.endsWith('.ini')) {
              paths.push(fp)
            }
          }
        }
      }
      searchPaths = [...nextSearchPaths]
      nextSearchPaths = []
    }
    return paths
  }
  return { showFiles }
}

export default useGetFile