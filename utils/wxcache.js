var dtime = '_deadtime';
function set(k, v, t) {
  wx.setStorageSync(k, v)
  var seconds = parseInt(t);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(k + dtime, timestamp + "")
  } else {
    wx.removeStorageSync(k + dtime)
  }
}

function get(k, def) {
  var that = this;
  var deadtime = parseInt(wx.getStorageSync(k + dtime))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      that.remove(k)
      if (def) { return def; } else { return; }
    }
  }
  var res = wx.getStorageSync(k);
  if (res) {
    return res;
  } else {
    return def;
  }
}

function remove(k) {
  wx.removeStorageSync(k);
  wx.removeStorageSync(k + dtime);
}

function clear() {
  wx.clearStorageSync();
}

module.exports = {
  set: set,
  get: get,
  remove: remove,
  clear: clear,
}