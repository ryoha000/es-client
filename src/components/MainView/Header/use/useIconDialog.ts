import { User } from 'src/types/root';
import { ComputedRef } from '@vue/composition-api';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useIconDialog = () => {
  const setupMenuList = (
    openLoginDialog: (isLog: boolean) => void,
    logout: () => Promise<void>,
    openUserEditDialog: () => void,
    openFollowDialog: () => void,
    openESLoginDialog: () => void,
    me: ComputedRef<User | null>,
  ) => {
    const menu = new Menu();

    if (!me.value) {
      menu.append(
        new MenuItem({
          label: 'ログイン',
          click: () => {
            openLoginDialog(true);
          }
        })
      );
      menu.append(new MenuItem({ type: 'separator' }));
  
      menu.append(
        new MenuItem({
          label: 'ユーザー登録',
          click: () => {
            openLoginDialog(false);
          }
        })
      );
    } else {
      menu.append(
        new MenuItem({
          label: 'ログアウト',
          click: async () => {
            await logout()
          }
        })
      );

      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(
        new MenuItem({
          label: '編集',
          click: () => {
            openUserEditDialog();
          }
        })
      );

      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(
        new MenuItem({
          label: 'フォロー',
          click: () => {
            openFollowDialog();
          }
        })
      );

      // menu.append(new MenuItem({ type: 'separator' }));
      // menu.append(
      //   new MenuItem({
      //     label: 'メッセージ',
      //     click: () => {
      //       console.log('message')
      //     }
      //   })
      // );
    }
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(
      new MenuItem({
        label: '批評空間にログイン',
        click: () => {
          openESLoginDialog();
        }
      })
    );
    return menu
  }
  return { setupMenuList }
}

export default useIconDialog