const exec = require('child_process').exec
import * as iconv from 'iconv-lite'
import * as path from 'path'

const useGetFileIcon = () => {
  const createCommand = (filePath: string) => {
    const normalizedFile = path.normalize(path.resolve(filePath)).replace(/\'/g,'\'\'')
    return `$Path = '${normalizedFile}' ; $Icon = [System.Drawing.Icon]::ExtractAssociatedIcon($Path) ; $Bitmap = $Icon.ToBitmap() ; $MemoryStream = New-Object System.IO.MemoryStream ; $Bitmap.Save($MemoryStream, [System.Drawing.Imaging.ImageFormat]::Png) ; $Bytes = $MemoryStream.ToArray() ; $MemoryStream.Flush() ; $MemoryStream.Dispose() ; [convert]::ToBase64String($Bytes)`
  }
  const getIcon = (filePaths :{id: number, path: string}[]): Promise<{id: number, path: string, icon: string}[]> => {
    return new Promise((resolve, reject) => {
      const commands: string[] = []
      for (const filePath of filePaths) {
        commands.push(createCommand(filePath.path))
      }
      exec(`powershell.exe -command "Add-Type -AssemblyName System.Drawing ; ${commands.join(' ; ')}"`, {encoding: 'binary', maxBuffer: 64*1024*1024}, (err: string, stdout: Buffer) => {
        if (err) {
          //console.log(err)
          return resolve(filePaths.map(v => ({id: v.id, path: v.path, icon: '' })))
          //return reject(err)
        }
        const str = iconv.decode(stdout, 'shiftjis')
        const result = str.replace(/\r/g,'').split('\n').filter((v) => !!v)
  
        if (filePaths.length === 0) resolve([])
        if (result.length === 1) {
          resolve([{id: filePaths[0].id, path: filePaths[0].path, icon: result[0]}])
        } else if (result.length === 0) {
          resolve(filePaths.map(v => ({id: v.id, path: v.path, icon: '' })))
        } else {
          resolve(result.map((v, i) => ({id: filePaths[i].id, path: filePaths[i].path, icon: v})))
        }
      })
    })
  }
  return { getIcon }
}

export default useGetFileIcon