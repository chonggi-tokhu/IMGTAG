var ColourgreyShorterJS = typeof require === 'function' ? require("./ColourgreyShorterCSSJS-0.0.0.js") : this['ColourgreyShorterJS'];
function getImageRawData(thisobj, { nothex, savenewline, savespace }, cbfunc) {
    var src = ColourgreyShorterJS.checkString(thisobj) ? thisobj : thisobj instanceof HTMLElement || thisobj instanceof Image ? thisobj.src : null;
    if (src===null) {
        return Promise.resolve(false);
    }
    var mypromise = new Promise((resolve) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', src, true);
        if (nothex) {
            xhr.responseType = 'text'; // this will accept the response as an Text
            xhr.send();
            xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
                var text = xhr.response;
                if (!savenewline) {
                    text = text.replaceAll('\n', '').replaceAll(String.raw`
`, '');
                }
                if (!savespace) {
                    text = text.replaceAll(' ', '');
                }
                resolve(text, thisobj);
    }
            }
        } else {
            xhr.responseType = 'arraybuffer'; // this will accept the response as an ArrayBuffer
            xhr.send();
            xhr.addEventListener("load", (buffer) => {
                var words = new Uint32Array(buffer),
                    hex = '';
                for (var i = 0; i < words.length; i++) {
                    hex += words.get(i).toString(16);  // this will convert it to a 4byte hex string
                }
                resolve(hex, thisobj);
            });
        }
    });
    if (typeof cbfunc !== 'function') {
        return mypromise.then((hex, thisobj) => {
            return hex;
        });
    }
    return mypromise.then(cbfunc);
}
var setimgdata = async (thisobj, cbfunc) => {
    var data = '';
    var israw = 'raw';
    await getImageRawData(thisobj, { nothex: true }, (hex, obj) => {
        israw = ifparsedataisraw(hex);
        /* if (israw === 'hex') {
            if (ColourgreyShorterJS.checkObj(obj)) {
                thisobj.imgdata = hex;
                thisobj.imgtype = 'hex';
                data = thisobj.imgdata;
            }
        } */
    });
    await (async () => {
        if (israw === 'raw') {
            getImageRawData(thisobj, { nothex: true }, (text, obj) => {
                if (ColourgreyShorterJS.checkObj(obj)) {
                    thisobj.imgdata = text.replace(text.split('img0')[0] + 'img0', '');
                    thisobj.imgtype = israw;
                    data = thisobj.imgdata;
        console.log(data);
                }
            });
        } else if (israw === 'json') {
            getImageRawData(thisobj, { nothex: true }, (text, obj) => {
                if (ColourgreyShorterJS.checkObj(obj)) {
                    thisobj.imgdata = text.replace(text.split('img0')[0] + 'img0', '');
                    thisobj.imgtype = israw;
                    thisobj.imgdataobj = JSON.parse(text);
                    data = thisobj.imgdata;
        console.log(data);
                }
            });
        } else if (israw === '3d') {
            getImageRawData(thisobj, { nothex: true }, (text, obj) => {
                if (ColourgreyShorterJS.checkObj(obj)) {
                    thisobj.imgdata = text.replace(text.split('img0')[0] + 'img0', '');
                    thisobj.imgtype = israw;
                    data = thisobj.imgdata;
        console.log(data);
                }
            });
        } else if (israw === 'canv') {
            getImageRawData(thisobj, { nothex: true }, (text, obj) => {
                if (ColourgreyShorterJS.checkObj(obj)) {
                    thisobj.imgdata = text.replace(text.split('img0')[0] + 'img0', '');
                    thisobj.imgtype = israw;
                    data = thisobj.imgdata;
        console.log(data);
                }
            });
        }
    })()
    await (async () => { if (typeof cbfunc !== 'function') { return; } cbfunc(thisobj, data); })();
    return thisobj;
}
/**
 * 
 * @param {string} data 
 * @returns {object}
 */
var ifparsedataisraw = (data, hex) => {
    var rtv = 'hex';
    if (!ColourgreyShorterJS.checkString(data)) {
        return rtv;
    }
    var parsedtype = '';
    if (hex) {
        var type = data.substring(0, 8);
        var splitparsedtype = '';
        for (var i = 0; i < type.length; i++) {
            splitparsedtype += type[i];
            if (i % 2 === 1) {
                parsedtype += String.fromCharCode(parseInt(splitparsedtype, 16));
                splitparsedtype = '';
            }
        }
    } else {
        parsedtype = data.split('img0')[0];
    }
    console.log(parsedtype);
    if (parsedtype.includes('RAW')) {
        console.log('raw');
        rtv = 'raw';
    } else if (parsedtype.includes('JSON')) {
        rtv = 'json';
    } else if (parsedtype.includes('3D')) {
        rtv = '3d';
    } else if (parsedtype.includes('CANV')) {
        rtv = 'canv';
    } else {
        return rtv;
    }
    return rtv;
}
class customHTMLImageElement extends HTMLImageElement {
    constructor() {
        super();
        var shadow = this.attachShadow({ mode: "open" });
        if (this.src.endsWith(".img0")) {
            setimgdata(this, (thisobj, data) => {
                this.imgdata = data;
                if (ColourgreyShorterJS.checkString(thisobj.imgdata)) {
                    if (thisobj.imgtype === 'canv') {
                        var newcanv = document.createElement("canvas");
                        this.canvas = shadow.appendChild(newcanv);
                        this.canvas.width = this.width;
                        this.canvas.height = this.height;
                        this.ctx = this.canvas.getContext("2d");
                        this.ctx.drawImage(this, 0, 0);
                    } else if (thisobj.imgtype === 'raw') {
                        var newcanv = document.createElement("canvas");
                        this.canvas = shadow.appendChild(newcanv);
                        this.canvas.width = this.width;
                        this.canvas.height = this.height;
                        this.ctx = this.canvas.getContext("2d");
                        if (ColourgreyShorterJS.checkString(thisobj.imgdata)) {
                            var imgdata_a = [];
                            var thisimgdata = '';
                            for (var i = 0; i < thisobj.imgdata.length; i++) {
                                thisimgdata += thisobj.imgdata[i];
                                if (i % 6 === 0) {
                                    imgdata_a.push(thisimgdata);
                                    thisimgdata = '';
                                }
                            }
                            var x = 0;
                            var y = 0;
                            for (var i = 0; i < imgdata_a.length; i++) {
                                var val = imgdata_a[i], idx = i, arr = imgdata_a;
                                if (val === '//////') {
                                    y++;
                                    x = 0;
                                    continue;
                                } else {
                                    x++;
                                }
                                this.ctx.beginPath();
                                this.ctx.fillStyle = '#' + val;
                                this.ctx.fillRect(x, y, 1, 1);
                                this.ctx.closePath();
                            }
                        }
                    }
                }
            });
        }
    }
    connectedCallback() {
        var shadow = this.attachShadow({ mode: "open" });
        if (this.src.endsWith(".img0")) {
            console.log('data');
            setimgdata(this, (thisobj, data) => {
                this.imgdata = data;
                if (ColourgreyShorterJS.checkString(thisobj.imgdata)) {
                    if (thisobj.imgtype === 'canv') {
                        var newcanv = document.createElement("canvas");
                        this.canvas = shadow.appendChild(newcanv);
                        this.canvas.width = this.width;
                        this.canvas.height = this.height;
                        this.ctx = this.canvas.getContext("2d");
                        this.ctx.drawImage(this, 0, 0);
                    } else if (thisobj.imgtype === 'raw') {
                        var newcanv = document.createElement("canvas");
                        this.canvas = shadow.appendChild(newcanv);
                        this.canvas.width = this.width;
                        this.canvas.height = this.height;
                        this.ctx = this.canvas.getContext("2d");
                        if (ColourgreyShorterJS.checkString(thisobj.imgdata)) {
                            var imgdata_a = [];
                            var thisimgdata = '';
                            for (var i = 0; i < thisobj.imgdata.length; i++) {
                                thisimgdata += thisobj.imgdata[i];
                                if (i % 6 === 0) {
                                    imgdata_a.push(thisimgdata);
                                    thisimgdata = '';
                                }
                            }
                            var x = 0;
                            var y = 0;
                            for (var i = 0; i < imgdata_a.length; i++) {
                                var val = imgdata_a[i], idx = i, arr = imgdata_a;
                                if (val === '//////') {
                                    y++;
                                    x = 0;
                                    continue;
                                } else {
                                    x++;
                                }
                                this.ctx.beginPath();
                                this.ctx.fillStyle = '#' + val;
                                this.ctx.fillRect(x, y, 1, 1);
                                this.ctx.closePath();
                            }
                        }
                    }
                }
            });
        }
    }
}
class customImg extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        var img = document.createElement("img");
        img.src = this.getAttribute("src");
        img.width = this.getAttribute("width");
        img.height = this.getAttribute("height");
        this.src = this.getAttribute("src");
        this.img = this.appendChild(img);
        this.img.crossOrigin = 'anonymous';
        var shadow = this.attachShadow({ mode: "open" });
        if (this.img.src.endsWith(".img0")) {
            console.log('data');
            setimgdata(this, (thisobj, data) => {
                this.imgdata = data;
                if (ColourgreyShorterJS.checkString(thisobj.imgdata)) {
                    if (thisobj.imgtype === 'canv') {
                        var newcanv = document.createElement("canvas");
                        this.canvas = shadow.appendChild(newcanv);
                        this.canvas.width = this.img.width;
                        this.canvas.height = this.img.height;
                        this.ctx = this.canvas.getContext("2d");
                        this.ctx.drawImage(this, 0, 0);
                    } else if (thisobj.imgtype === 'raw') {
                        var newcanv = document.createElement("canvas");
                        this.canvas = shadow.appendChild(newcanv);
                        this.canvas.width = this.img.width;
                        this.canvas.height = this.img.height;
                        this.ctx = this.canvas.getContext("2d");
                        if (ColourgreyShorterJS.checkString(thisobj.imgdata)) {
                            var imgdata_a = [];
                            var thisimgdata = '';
                            for (var i = 0; i < thisobj.imgdata.length; i++) {
                                thisimgdata += thisobj.imgdata[i];
                                if (i % 6 === 0) {
                                    imgdata_a.push(thisimgdata);
                                    thisimgdata = '';
                                }
                            }
                            var x = 0;
                            var y = 0;
                            for (var i = 0; i < imgdata_a.length; i++) {
                                var val = imgdata_a[i], idx = i, arr = imgdata_a;
                                if (val === '//////') {
                                    y++;
                                    x = 0;
                                    continue;
                                } else {
                                    x++;
                                }
                                this.ctx.beginPath();
                                this.ctx.fillStyle = '#' + val;
                                this.ctx.fillRect(x, y, 1, 1);
                                this.ctx.closePath();
                            }
                        }
                    }
                }
            });
        }
    }
}
HTMLImageElement.prototype.constuctor = customHTMLImageElement.prototype.constuctor;
Image.prototype.constuctor = customHTMLImageElement.prototype.constuctor;
HTMLImageElement = customHTMLImageElement;
Image = customHTMLImageElement;
//customElements.define("img0-img", customHTMLImageElement, { extends: "img" });
customElements.define("custom-img0-img", customImg);
