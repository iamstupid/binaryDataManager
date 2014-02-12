class datastr{
	constructor (stringify,data,type){
		this.stringify=stringify;
		this.data=data;
		this.gtype=`[Object dataStructuredString_${type}]`;
	}
	toString (){
		return this.stringify.call(this.data);
	}
}
class memdata extends datastr{
	constructor (conf){
		super(function(){
			var Gi=this.data.Gi?this.data.Gi:0;
			var Mi=this.data.Mi?this.data.Mi:0;
			var Ki=this.data.Ki?this.data.Ki:0;
			var iB=this.data.iB?this.data.iB:0;
			return `${Gi}GiB ${Mi}MiB ${Ki}KiB ${iB}B`;
		},conf,"MemoryData");
	}
	toString (){
		return this.stringify.call(this.data);
	}
}
memdata.docformat="Format:\
Property Gi,Mi,Ki,iB are specified GiB,MiB,KiB and byte values";
memdata.is=function(a){
	return a instanceof memdata;
}
memdata.calcByte=function(a){
	a=a.data?a.data:a;
	//if is a memsize instance, get the memsize data
	return a.Gi<<30+a.Mi<<20+a.Ki<<10+a.iB;
}
var parseMulEx=function(a){
	switch(a){
		case("G"):
			return 3;
		case("M"):
			return 2;
		case("K"):
			return 1;
		default:
			return 0;
	}
}
var parseMul=function(a,b,c){
	var m=parseMulEx(a);
	if(b==="i"){
		m=1<<(m*10);
	}else{
		m=Math.pow(10,3*m);
	}
	if(c==="b"){
		m=m/8;
	}
	return m;
}
class binaryDataTemplate{
	constructor (length,elementsize,if_offset){
		this.length=length;
		this.size=elementsize;
		this.offset=if_offset;
	}
	generate (memblock){
		switch(this.size){
			case(1):
				this.viewport=new Uint8Array(memblock,this.offset,this.length);
				return this.viewport;
			case(2):
				this.viewport=new Uint16Array(memblock,this.offset,this.length);
				return this.viewport;
			case(4):
				this.viewport=new Uint32Array(memblock,this.offset,this.length);
				return this.viewport;
			default:
				this.viewport=new Uint8ClampedArray(memblock,this.offset,this.length);
				return this.viewport;
		}
	}
	toString (){
		return `[Template{typedArray:Uint} sizePerElement:${this.size} lengthOfDataInIndex:${this.length} lengthInByte:${this.length*this.size} offsetInBuffer:${this.offset}]`;
	}
}
var binaryData={};
binaryData.is=function(a){
	return a instanceof binaryDataTemplate;
}
class memblock{
	constructor (memsize,callbackSuccess,callbackFailed){
		callbackSuccess=callbackSuccess?callbackSuccess: (memblock)=>true;
		callbackFailed=callbackFailed?callbackFailed: (sizewanted,memblock)=>true;
		if(memdata.is(memsize)){
			this.memsize=memsize.data;
			var size=memdata.calcByte(memsize);
			this.memblock=new ArrayBuffer(size);
			if(this.memblock.byteLength===size){
				callbackSuccess.call(this,this.memblock);
			}else{
				callbackFailed.call(this,size,this.memblock);
			}
			this.length=this.memblock.byteLength;
			return true;
		}
		var memre=/\s*([KMGTkmgt]{0,1})([i]{0,1})([Bb])\s*/;
		var strmem=String(memsize);
		var splitedData=strmem.split(memre);
		var size=0,sizex,mulx;
		for(let i=0;i<splitedData.length/4;i++){
			sizex=parseFloat(splitedData[i*4]);
			mulx=parseMul(splitedData[i*4]+1,splitedData[i*4]+2,splitedData[i*4]+3);
			size=sizex*mulx<<0;
			this.memblock=new ArrayBuffer(size);
			if(this.memblock.byteLength===size){
				callbackSuccess.call(this,this.memblock);
			}else{
				callbackFailed.call(this,size,this.memblock);
			}
			this.length=this.memblock.byteLength;
			return true;
		}
	}
	subMemBlock (f,t){
		return this.memblock.slice(f,t);
	}
	addDataViewport (offset,length,callbackSuccess,callbackFailed){
		callbackSuccess=callbackSuccess?callbackSuccess: (memblock)=>true;
		callbackFailed=callbackFailed?callbackFailed: (sizewanted,memblock)=>true;
		if(binaryData.is(offset)){
			var memer=offset.generate(this.memblock);
			var g_size=memer.length*memer.BYTES_PER_ELEMENT;
			length=(length===-1?g_size:length);
			if(length===g_size){
				callbackSuccess.call(this,memer);
			}else{
				callbackFailed.call(this,length,memer);
			}
			return memer;
		}else{
			var memer=new Uint8Array(this.memblock,offset,(length===-1?undefined:length));
			var g_size=memer.length;
			length=(length===-1?g_size:length);
			if(length===g_size){
				callbackSuccess.call(this,memer);
			}else{
				callbackFailed.call(this,length,memer);
			}
			return memer;
		}
	}
	toString (){
		return `[Object memblock->length:${this.length}]`;
	}
}
class ctrlMem{
	constructor (m){
		this.mem=m;
	}
	getElement (m){
		if(m>=this.mem.length){
			//raise error
			throw("Element index overflow at TypedArray. Not allowed to access.");
		}else{
			return this.mem[m];
		}
	}
}
