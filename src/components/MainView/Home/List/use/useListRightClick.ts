// eslint-disable-next-line @typescript-eslint/no-var-requires
const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useListRightClick = () => {
  const setupMenuList = (
    label: string,
    openEditDialog: () => void,
    openArrangementDialog: () => void,
    deleteList: () => Promise<void>,
  ) => {
    const menu = new Menu();
    menu.append(
      new MenuItem({
        label: `${label}を編集`,
        click: openEditDialog
      })
    );
    menu.append(new MenuItem({ type: 'separator' }));

    menu.append(
      new MenuItem({
        label: `${label}を並べ替え`,
        click: openArrangementDialog
      })
    );
    menu.append(new MenuItem({ type: 'separator' }));

    menu.append(
      new MenuItem({
        label: `${label}を削除`,
        click: async () => await deleteList()
      })
    );
    return menu
  }
  const setupCardMenuList = (
    label: string,
    deleteGameFromList: () => Promise<void>,
  ) => {
    const menu = new Menu();
    menu.append(
      new MenuItem({
        label: `${label}をリストから削除`,
        click: async () => await deleteGameFromList()
      })
    );
    return menu
  }
  return { setupMenuList, setupCardMenuList }
}

export default useListRightClick