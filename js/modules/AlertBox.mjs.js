// modifiedAt: 2022-03-15

class AlertBox {
  constructor() {
    this.lastIdx = 1;
    this.alerts = [];
  }
  static new() {
    return new AlertBox();
  }
  pushAlert(ctt = "🐵", typ = "info", tot = 2000) {
    console.log(['pushAlert', ctt, typ, tot]);
    let idx = this.lastIdx + 1;
    this.alerts.push({
      'idx': idx,
      'type': typ,
      'content': ctt,
      'show': 1,
    });
    this.lastIdx += 1;
    // let that = self;
    setTimeout(() => {
      this.removeAlert(idx);
    }, tot);
    return idx;
  }
  removeAlert(idx) {
    this.alerts.find(alert => alert.idx == idx).show = 0;
  }
}

export default AlertBox;
