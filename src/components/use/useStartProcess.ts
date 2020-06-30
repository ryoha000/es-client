/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import useJson from './useJson'
import * as ChileProcess from 'child_process'
import * as iconv from 'iconv-lite'
import * as path from 'path'
import { ListGame } from 'src/types/root'

const useStartProcess = (game: ListGame) => {
  const startProcess = async (isAdmin: boolean | undefined) => {
    const { readFileConsoleErr, override, getHistory } = useJson()
    if (isAdmin === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      isAdmin = JSON.parse(await readFileConsoleErr('setting/setting.json')).isVerbRunAs
    }
    if (game) {
      const splitPath = game.path.split('\\')
      const exe = splitPath.pop()
      const fp = splitPath.join('\\')
      const normalizedFile = path.normalize(path.resolve(fp)).replace(/\'/g,'\'\'')
      try {
        await readFileConsoleErr('setting/playtime.json')
      } catch (e) {
        await override('setting/playtime.json', '')
      }
      const addStartTime = `$date = Get-Date ; Add-Content setting/playtime.json \"start\`n${game.id}\`n$date\"`
      const addFinishTime = `$date = Get-Date ; Add-Content setting/playtime.json \"end\`n${game.id}\`n$date\"`
      const command = `$now = pwd ; ${addStartTime} ; cd \'${normalizedFile}\' ; powershell Start-Process ${exe ?? ''} ${isAdmin ? '-verb runas' : ''} -Wait ; cd $now.path ; ${addFinishTime}`
      // 何故か if(Buffer.isBuffer(stderr)) で判定してもダメだからanyに
      ChileProcess.exec(`powershell.exe -command "${command}"`, {encoding: 'binary', maxBuffer: 64*1024*1024}, (err, stdout, stderr: any) => {
        if (err) {
          const str = iconv.decode(stderr, 'shiftjis')
          alert(str)
        }
        return
      })
    }
  }
  return { startProcess }
}

export default useStartProcess