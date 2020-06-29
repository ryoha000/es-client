/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const exec = require('child_process').exec
import path from 'path'
import * as iconv from 'iconv-lite'

const useGetEXEPath = () => {
  function getCommand (lnkFile: string) {
    const normalizedFile = path.normalize(path.resolve(lnkFile)).replace(/\'/g,'\'\'')
    const getCOM = '(New-Object -COM WScript.Shell)'
  
    return `${getCOM}.CreateShortcut('${normalizedFile}').TargetPath;`
  }
  
  function getPath (lnkFile: Array<{id: number, path: string}> | {id: number, path: string}): Promise<{id: number, path: string}[]> {
    return new Promise((resolve, reject) => {
      const commands: string[] = []
  
      if (process.platform !== 'win32') {
        return reject(new Error('Platform is not Windows'))
      }
  
      if (Array.isArray(lnkFile)) {
        for (const lnk of lnkFile) {
          commands.push(getCommand(lnk.path))
        }
      } else if (typeof lnkFile === 'object') {
        commands.push(getCommand(lnkFile.path))
      } else {
        console.log(typeof lnkFile)
        return reject(new Error('Input is neither string nor array!'))
      }
  
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      exec(`powershell.exe -command "${commands.join('')}"`, {encoding: 'binary', maxBuffer: 64*1024*1024}, (err: string, stdout: Buffer) => {
        if (err) {
          return reject(err)
        }
        const str = iconv.decode(stdout, 'shiftjis')
        const result = str.replace(/\r/g,'').split('\n').filter((v) => !!v)
  
        if (result.length === 1) {
          if (Array.isArray(lnkFile)) {
            if (lnkFile.length > 0) {
              resolve([{id: lnkFile[0].id, path: result[0]}])
            } else {
              resolve([])
            }
          } else {
            resolve([{id: lnkFile.id, path: result[0]}])
          }
        } else if (result.length === 0) {
          if (Array.isArray(lnkFile)){
            if (lnkFile.length > 0) {
              resolve([{id: lnkFile[0].id, path: lnkFile[0].path}])
            } else {
              resolve([])
            }
          } else {
            resolve([{id: lnkFile.id ?? 0, path: lnkFile.path ?? ''}])
          }
        } else {
          if (Array.isArray(lnkFile)) {
            if (result.length !== lnkFile.length) {
              resolve([])
            }
            resolve(result.map((res, i) => ({id: lnkFile[i].id, path: res})))
          }
        }
      })
    })
  }

  return { getPath }
}

export default useGetEXEPath