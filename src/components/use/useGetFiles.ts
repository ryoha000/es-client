import * as fs from 'fs'
import * as path from 'path'

const useGetFile = () => {
  const showFilesDepth1 = async (dirpath: string) => {
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
        try {
          const dirents = await showFilesDepth1(searchPath)
          for (const dirent of dirents) {
            const fp = path.join(searchPath, dirent.name);
            if (dirent.isDirectory()) {
              nextSearchPaths.push(fp)
            } else {
              if (fp.endsWith('.lnk') || fp.endsWith('.LNK')) {
                paths.push(fp)
              }
            }
          }
        } catch(e) {
          throw e
        }
      }
      searchPaths = nextSearchPaths.slice()
      nextSearchPaths = []
    }
    return paths
  }
  const getUserInstallFile = async (userDirpath: string) => {
    const paths: string[] = []
    try {
      const userDirs = await showFilesDepth1(userDirpath)
      for (const userDir of userDirs) {
        try {
          paths.push(...await showFiles(path.join(userDirpath, userDir.name, 'AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs')))
        } catch (e) {
          //
        }
      }
    } catch (e) {
      // console.error(e)
    }
    return paths
  }
  return { showFiles, getUserInstallFile }
}

export default useGetFile