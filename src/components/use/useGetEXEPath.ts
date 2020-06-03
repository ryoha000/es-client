const exec = require('child_process').exec
import path from 'path'
import * as iconv from 'iconv-lite'

const useGetEXEPath = () => {
  function getCommand (lnkFile: string) {
    const normalizedFile = path.normalize(path.resolve(lnkFile))
    const getCOM = '(New-Object -COM WScript.Shell)'
  
    return `${getCOM}.CreateShortcut('${normalizedFile}').TargetPath;`
  }
  
  function getPath (lnkFile: Array<string> | string) {
    return new Promise((resolve, reject) => {
      const commands: string[] = []
  
      if (process.platform !== 'win32') {
        return reject(new Error('Platform is not Windows'))
      }
  
      if (Array.isArray(lnkFile)) {
        for (const lnk of lnkFile) {
          commands.push(getCommand(lnk))
        }
      } else if (typeof lnkFile === 'string') {
        commands.push(getCommand(lnkFile))
      } else {
        console.log(typeof lnkFile)
        return reject(new Error('Input is neither string nor array!'))
      }
  
      exec(`powershell.exe -command "${commands.join('')}"`, {encoding: 'binary', maxBuffer: 64*1024*1024}, (err: string, stdout: Buffer) => {
        if (err) {
          return reject(err)
        }
        const str = iconv.decode(stdout, 'shiftjis')
        const result = str.split('\r\n').filter((v) => !!v)
  
        if (result.length === 1) {
          resolve(result[0])
        } else if (result.length === 0) {
          resolve(null)
        } else {
          resolve(result)
        }
      })
    })
  }
  return { getPath }
}

export default useGetEXEPath