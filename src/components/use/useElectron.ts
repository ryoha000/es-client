import { remote } from 'electron'

const useElectron = () => {
  const createListDialog = () => {
    const win = remote.getCurrentWindow();
    const options = {
        type: 'info',
        buttons: ['OK', 'テスト', 'Cancel', 'sample', 'Yes', 'No'],
        title: 'タイトル',
        message: 'メッセージ',
        detail: '詳細メッセージ'
    };
    
    remote.dialog.showMessageBox(win, options);
  }
  return { createListDialog}
}
export default useElectron