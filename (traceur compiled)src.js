$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var __moduleName = null;
  var datastr = function(stringify, data, type) {
    this.stringify = stringify;
    this.data = data;
    this.gtype = ("[Object dataStructuredString_" + type + "]");
  };
  datastr = ($traceurRuntime.createClass)(datastr, {toString: function() {
      return this.stringify.call(this.data);
    }}, {});
  var memdata = function(conf) {
    $traceurRuntime.superCall(this, $memdata.prototype, "constructor", [function() {
      var Gi = this.data.Gi ? this.data.Gi: 0;
      var Mi = this.data.Mi ? this.data.Mi: 0;
      var Ki = this.data.Ki ? this.data.Ki: 0;
      var iB = this.data.iB ? this.data.iB: 0;
      return (Gi + "GiB " + Mi + "MiB " + Ki + "KiB " + iB + "B");
    }, conf, "MemoryData"]);
  };
  var $memdata = ($traceurRuntime.createClass)(memdata, {toString: function() {
      return this.stringify.call(this.data);
    }}, {}, datastr);
  memdata.docformat = "Format:\
Property Gi,Mi,Ki,iB are specified GiB,MiB,KiB and byte values";
  memdata.is = function(a) {
    return a instanceof memdata;
  };
  memdata.calcByte = function(a) {
    a = a.data ? a.data: a;
    return a.Gi << 30 + a.Mi << 20 + a.Ki << 10 + a.iB;
  };
  var parseMulEx = function(a) {
    switch (a) {
      case ("G"):
        return 3;
      case ("M"):
        return 2;
      case ("K"):
        return 1;
      default:
        return 0;
    }
  };
  var parseMul = function(a, b, c) {
    var m = parseMulEx(a);
    if (b === "i") {
      m = 1 << (m * 10);
    } else {
      m = Math.pow(10, 3 * m);
    }
    if (c === "b") {
      m = m / 8;
    }
    return m;
  };
  var binaryDataTemplate = function(length, elementsize, if_offset) {
    this.length = length;
    this.size = elementsize;
    this.offset = if_offset;
  };
  binaryDataTemplate = ($traceurRuntime.createClass)(binaryDataTemplate, {
    generate: function(memblock) {
      switch (this.size) {
        case (1):
          this.viewport = new Uint8Array(memblock, this.offset, this.length);
          return this.viewport;
        case (2):
          this.viewport = new Uint16Array(memblock, this.offset, this.length);
          return this.viewport;
        case (4):
          this.viewport = new Uint32Array(memblock, this.offset, this.length);
          return this.viewport;
        default:
          this.viewport = new Uint8ClampedArray(memblock, this.offset, this.length);
          return this.viewport;
      }
    },
    toString: function() {
      return ("[Template{typedArray:Uint} sizePerElement:" + this.size + " lengthOfDataInIndex:" + this.length + " lengthInByte:" + this.length * this.size + " offsetInBuffer:" + this.offset + "]");
    }
  }, {});
  var binaryData = {};
  binaryData.is = function(a) {
    return a instanceof binaryDataTemplate;
  };
  var memblock = function(memsize, callbackSuccess, callbackFailed) {
    callbackSuccess = callbackSuccess ? callbackSuccess: (function(memblock) {
      return true;
    });
    callbackFailed = callbackFailed ? callbackFailed: (function(sizewanted, memblock) {
      return true;
    });
    if (memdata.is(memsize)) {
      this.memsize = memsize.data;
      var size = memdata.calcByte(memsize);
      this.memblock = new ArrayBuffer(size);
      if (this.memblock.byteLength === size) {
        callbackSuccess.call(this, this.memblock);
      } else {
        callbackFailed.call(this, size, this.memblock);
      }
      this.length = this.memblock.byteLength;
      return true;
    }
    var memre = /\s*([KMGTkmgt]{0,1})([i]{0,1})([Bb])\s*/;
    var strmem = String(memsize);
    var splitedData = strmem.split(memre);
    var size = 0,
        sizex,
        mulx;
    {
      try {
        throw undefined;
      } catch ($i) {
        $i = 0;
        for (; $i < splitedData.length / 4; $i++) {
          try {
            throw undefined;
          } catch (i) {
            i = $i;
            try {
              sizex = parseFloat(splitedData[$traceurRuntime.toProperty(i * 4)]);
              mulx = parseMul(splitedData[$traceurRuntime.toProperty(i * 4)] + 1, splitedData[$traceurRuntime.toProperty(i * 4)] + 2, splitedData[$traceurRuntime.toProperty(i * 4)] + 3);
              size = sizex * mulx << 0;
              this.memblock = new ArrayBuffer(size);
              if (this.memblock.byteLength === size) {
                callbackSuccess.call(this, this.memblock);
              } else {
                callbackFailed.call(this, size, this.memblock);
              }
              this.length = this.memblock.byteLength;
              return true;
            } finally {
              $i = i;
            }
          }
        }
      }
    }
  };
  memblock = ($traceurRuntime.createClass)(memblock, {
    subMemBlock: function(f, t) {
      return this.memblock.slice(f, t);
    },
    addDataViewport: function(offset, length, callbackSuccess, callbackFailed) {
      callbackSuccess = callbackSuccess ? callbackSuccess: (function(memblock) {
        return true;
      });
      callbackFailed = callbackFailed ? callbackFailed: (function(sizewanted, memblock) {
        return true;
      });
      if (binaryData.is(offset)) {
        var memer = offset.generate(this.memblock);
        var g_size = memer.length * memer.BYTES_PER_ELEMENT;
        length = (length === - 1 ? g_size: length);
        if (length === g_size) {
          callbackSuccess.call(this, memer);
        } else {
          callbackFailed.call(this, length, memer);
        }
        return memer;
      } else {
        var memer = new Uint8Array(this.memblock, offset, (length === - 1 ? undefined: length));
        var g_size = memer.length;
        length = (length === - 1 ? g_size: length);
        if (length === g_size) {
          callbackSuccess.call(this, memer);
        } else {
          callbackFailed.call(this, length, memer);
        }
        return memer;
      }
    },
    toString: function() {
      return ("[Object memblock->length:" + this.length + "]");
    }
  }, {});
  var ctrlMem = function(m) {
    this.mem = m;
  };
  ctrlMem = ($traceurRuntime.createClass)(ctrlMem, {getElement: function(m) {
      if (m >= this.mem.length) {
        throw ("Element index overflow at TypedArray. Not allowed to access.");
      } else {
        return this.mem[$traceurRuntime.toProperty(m)];
      }
    }}, {});
  return {};
});
