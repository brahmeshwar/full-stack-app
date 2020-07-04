/** @format */

import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory();
class History {
  pageReload() {
    window.location.reload();
  }
  redirectTo(path: string) {
    browserHistory.push(path);
    this.pageReload();
  }
  pageRefresh() {
    setTimeout(() => {
      history.pageReload();
    }, 300);
  }
}
const history = new History();
export default history;
