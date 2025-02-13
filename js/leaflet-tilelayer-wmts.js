L.TileLayer.WMTS = L.TileLayer.extend({
  defaultWmtsParams: {
    service: "WMTS",
    request: "GetTile",
    version: "1.0.0",
    layer: "",
    style: "",
    tilematrixSet: "",
    format: "image/jpeg",
  },
  initialize: function (e, t) {
    this._url = e;
    var n = L.extend({}, this.defaultWmtsParams),
      r = t.tileSize || this.options.tileSize;
    if (t.detectRetina && L.Browser.retina) {
      n.width = n.height = r * 2;
    } else {
      n.width = n.height = r;
    }
    for (var i in t) {
      if (!this.options.hasOwnProperty(i) && i != "matrixIds") {
        n[i] = t[i];
      }
    }
    this.wmtsParams = n;
    this.matrixIds = t.matrixIds || this.getDefaultMatrix();
    L.setOptions(this, t);
  },
  onAdd: function (e) {
    L.TileLayer.prototype.onAdd.call(this, e);
  },
  getTileUrl: function (e, t) {
    var n = this._map;
    crs = n.options.crs;
    tileSize = this.options.tileSize;
    nwPoint = e.multiplyBy(tileSize);
    nwPoint.x += 1;
    nwPoint.y -= 1;
    sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
    nw = crs.project(n.unproject(nwPoint, t));
    se = crs.project(n.unproject(sePoint, t));
    tilewidth = se.x - nw.x;
    t = n.getZoom();
    ident = this.matrixIds[t].identifier;
    X0 = this.matrixIds[t].topLeftCorner.lng;
    Y0 = this.matrixIds[t].topLeftCorner.lat;
    tilecol = Math.floor((nw.x - X0) / tilewidth);
    tilerow = -Math.floor((nw.y - Y0) / tilewidth);
    url = L.Util.template(this._url, { s: this._getSubdomain(e) });
    return (
      url +
      L.Util.getParamString(this.wmtsParams, url) +
      "&tilematrix=" +
      ident +
      "&tilerow=" +
      tilerow +
      "&tilecol=" +
      tilecol
    );
  },
  setParams: function (e, t) {
    L.extend(this.wmtsParams, e);
    if (!t) {
      this.redraw();
    }
    return this;
  },
  getDefaultMatrix: function () {
    var e = new Array(22);
    for (var t = 0; t < 22; t++) {
      e[t] = {
        identifier: "" + t,
        topLeftCorner: new L.LatLng(20037508.3428, -20037508.3428),
      };
    }
    return e;
  },
});
L.tileLayer.wmts = function (e, t) {
  return new L.TileLayer.WMTS(e, t);
};
