var Module=function(){var n,t,r={},e=console.warn.bind(console);"object"!=typeof WebAssembly&&A("no native wasm support detected");var i,a=!1;var o=[],s=[],u=[];var f,c=0;function l(n){0==--c&&(v||function(){if(c>0)return;if(y(o),c>0)return;if(v)return;if(v=!0,a)return;y(s),r.onRuntimeInitialized&&r.onRuntimeInitialized();!function(){if(r.postRun)for("function"==typeof r.postRun&&(r.postRun=[r.postRun]);r.postRun.length;)n=r.postRun.shift(),u.unshift(n);var n;y(u)}()}())}function A(n){throw r.onAbort(n),e(n="Aborted("+n+")"),a=!0,new WebAssembly.RuntimeError(n)}function p(){try{return new Uint8Array(n)}catch(n){A(n)}}function y(n){for(;n.length>0;){var t=n.shift();if("function"!=typeof t){var e=t.func;"number"==typeof e?void 0===t.arg?m(e)():m(e)(t.arg):e(void 0===t.arg?null:t.arg)}else t(r)}}f="solve.wasm";var h=[];function m(n){var t=h[n];return t||(n>=h.length&&(h.length=n+1),h[n]=t=i.get(n)),t}class w{constructor(n){this.ptr=n-24}init(n,t){r.HEAPU32[this.ptr+16>>2]=0,r.HEAPU32[this.ptr+4>>2]=n,r.HEAPU32[this.ptr+8>>2]=t,r.HEAP32[this.ptr>>2]=0,r.HEAP8[this.ptr+12>>0]=0,r.HEAP8[this.ptr+13>>0]=0}}var v,b={a:{b:function(n){return _malloc(n+24)+24},a:function(n,t,r){throw new w(n).init(t,r),n,0,n},d:n=>A(""),e:n=>r.HEAPU8.copyWithin(dest,src,src+num),c:n=>A("Out Of Memory")}};function d(n){var e,a;r.asm=n.instance.exports,t=r.asm.f,e=t.buffer,r.HEAP8=new Int8Array(e),r.HEAP16=new Int16Array(e),r.HEAP32=new Int32Array(e),r.HEAPU8=new Uint8Array(e),r.HEAPU16=new Uint16Array(e),r.HEAPU32=new Uint32Array(e),r.HEAPF32=new Float32Array(e),r.HEAPF64=new Float64Array(e),i=r.asm.k,a=r.asm.g,s.unshift(a),l()}function g(t){return async function(){if(!n)try{const n=await fetch(f,{credentials:"same-origin"});if(!n.ok)throw"failed to load wasm binary file at '"+f+"'";return await n.arrayBuffer()}catch(n){return p()}return p()}().then(function(n){return WebAssembly.instantiate(n,b)}).then(t,function(n){e("failed to asynchronously prepare wasm: "+n),A(n)})}return c++,n?g(d):fetch(f,{credentials:"same-origin"}).then(n=>{WebAssembly.instantiateStreaming(n,b).then(d,function(n){e("wasm streaming compile failed: "+n),e("falling back to ArrayBuffer instantiation"),g(d)})}),r.__Z7getHintPcS_=function(){return r.asm.h.apply(null,arguments)},r.__Z11alloc_statev=function(){return r.asm.i.apply(null,arguments)},r.__Z10alloc_movev=function(){return r.asm.j.apply(null,arguments)},r}();

let wasmGetHint;

Module.onRuntimeInitialized = function() {
	console.log("wasm loaded");

	//Allocate I/O
	var state_input = Module.__Z10alloc_movev();
	var move_output = Module.__Z11alloc_statev();

	wasmGetHint = function(str){
		// Load state into heap
		Module.HEAPU8.set([...str].map(i=>i.charCodeAt(0)), state_input);
		// Call the wasm code
		Module.__Z7getHintPcS_(state_input, move_output);
		// Now read the result from heap
		let view = Module.HEAPU8.slice(move_output, move_output + 5);
		let x = view[0];
		let y = view[1];
		let d = "UP DOWN LEFT RIGHT".split(" ")[view[4]];
		// Return result
		return [x, y, d];
	}
}