var Module = (function(){
	var Module = {};
	
	var err = console.warn.bind(console);
	var wasmBinary;
	if (typeof WebAssembly != "object") {
	    abort("no native wasm support detected")
	}
	var wasmMemory;
	var ABORT = false;
	
	function updateGlobalBufferAndViews(buf) {
	    Module.HEAP8 = new Int8Array(buf);
	    Module.HEAP16 = new Int16Array(buf);
	    Module.HEAP32 = new Int32Array(buf);
	    Module.HEAPU8 = new Uint8Array(buf);
	    Module.HEAPU16 = new Uint16Array(buf);
	    Module.HEAPU32 = new Uint32Array(buf);
	    Module.HEAPF32 = new Float32Array(buf);
	    Module.HEAPF64 = new Float64Array(buf)
	}
	var wasmTable;
	var __ATPRERUN__ = [];
	var __ATINIT__ = [];
	var __ATPOSTRUN__ = [];
	
	function preRun() {
	    callRuntimeCallbacks(__ATPRERUN__)
	}
	
	function initRuntime() {
	    callRuntimeCallbacks(__ATINIT__)
	}
	
	function postRun() {
	    if (Module.postRun) {
	        if (typeof Module.postRun == "function") Module.postRun = [Module.postRun];
	        while (Module.postRun.length) {
	            addOnPostRun(Module.postRun.shift())
	        }
	    }
	    callRuntimeCallbacks(__ATPOSTRUN__)
	}
	
	function addOnInit(cb) {
	    __ATINIT__.unshift(cb)
	}
	
	function addOnPostRun(cb) {
	    __ATPOSTRUN__.unshift(cb)
	}
	var runDependencies = 0;
	
	function addRunDependency(id) {
	    runDependencies++;
	}
	
	function removeRunDependency(id) {
	    runDependencies--;
	    if (runDependencies == 0) {
			if(!calledRun) run();
	    }
	}
	
	function abort(what) {
		Module.onAbort?.(what);
	    what = "Aborted(" + what + ")";
	    err(what);
	    ABORT = true;
	    throw new WebAssembly.RuntimeError(what)
	}
	
	var wasmBinaryFile;
	wasmBinaryFile = "solve.wasm";
	
	function getBinary() {
	    try {
	        return new Uint8Array(wasmBinary)
	    } catch (err) {
	        abort(err)
	    }
	}
	
	async function getBinaryPromise() {
	    if (!wasmBinary) {
			try {
				const response = await fetch(wasmBinaryFile, {credentials: "same-origin"});
				if (!response.ok) throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
				return await response.arrayBuffer();
			} catch (e) {
				return getBinary();
			}
	    }
	    return getBinary();
	}
	
	function callRuntimeCallbacks(callbacks) {
	    while (callbacks.length > 0) {
	        var callback = callbacks.shift();
	        if (typeof callback == "function") {
	            callback(Module);
	            continue
	        }
	        var func = callback.func;
	        if (typeof func == "number") {
	            if (callback.arg === undefined) {
	                getWasmTableEntry(func)()
	            } else {
	                getWasmTableEntry(func)(callback.arg)
	            }
	        } else {
	            func(callback.arg === undefined ? null : callback.arg)
	        }
	    }
	}
	var wasmTableMirror = [];
	
	function getWasmTableEntry(funcPtr) {
	    var func = wasmTableMirror[funcPtr];
	    if (!func) {
	        if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
	        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr)
	    }
	    return func
	}
	
	function ___cxa_allocate_exception(size) {
	    return _malloc(size + 24) + 24
	}
	
	class ExceptionInfo {
	    constructor(excPtr) {
	        this.ptr = excPtr - 24;
	    }
		init(type, destructor){
			Module.HEAPU32[this.ptr + 16 >> 2] = 0;
			Module.HEAPU32[this.ptr + 4 >> 2] = type;
			Module.HEAPU32[this.ptr + 8 >> 2] = destructor;
			Module.HEAP32[this.ptr >> 2] = 0;
			Module.HEAP8[this.ptr + 12 >> 0] = 0;
	        Module.HEAP8[this.ptr + 13 >> 0] = 0;
		}
	}
	var exceptionLast = 0;
	var uncaughtExceptionCount = 0;
	
	function ___cxa_throw(ptr, type, destructor) {
	    var info = new ExceptionInfo(ptr);
	    info.init(type, destructor);
	    exceptionLast = ptr;
	    uncaughtExceptionCount++;
	    throw ptr
	}
	
	var asmLibraryArg = {
	    "b": ___cxa_allocate_exception,
	    "a": ___cxa_throw,
	    "d": (_=>abort("")),
	    "e": (_=>Module.HEAPU8.copyWithin(dest, src, src + num)),
	    "c": (_=>abort("Out Of Memory"))
	};
	
	var info = {
		"a": asmLibraryArg
	};

	addRunDependency("wasm-instantiate");

	function receiveInstantiationResult(result) {
		Module.asm = result.instance.exports;
		wasmMemory = Module.asm.f;
		updateGlobalBufferAndViews(wasmMemory.buffer);
		wasmTable = Module.asm.k;
		addOnInit(Module.asm.g);
		removeRunDependency("wasm-instantiate")
	}

	function instantiateArrayBuffer(receiver) {
		return getBinaryPromise().then(function(binary) {
			return WebAssembly.instantiate(binary, info)
		}).then(receiver, function(reason) {
			err("failed to asynchronously prepare wasm: " + reason);
			abort(reason)
		})
	}

	if (!wasmBinary) {
		fetch(wasmBinaryFile, {credentials: "same-origin"}).then(response => {
			var result = WebAssembly.instantiateStreaming(response, info);
			result.then(receiveInstantiationResult, function(reason) {
				err("wasm streaming compile failed: " + reason);
				err("falling back to ArrayBuffer instantiation");
				instantiateArrayBuffer(receiveInstantiationResult);
			});
		})
	}
	else instantiateArrayBuffer(receiveInstantiationResult)
	
	Module.__Z7getHintPcS_ = function() {
	    return Module.asm.h.apply(null, arguments)
	};
	Module.__Z11alloc_statev = function() {
	    return Module.asm.i.apply(null, arguments)
	};
	Module.__Z10alloc_movev = function() {
	    return Module.asm.j.apply(null, arguments)
	};
	var calledRun;
	
	function run() {
	    if (runDependencies > 0) return
	    preRun();
	    if (runDependencies > 0) return
		if (calledRun) return;
		calledRun = true;
		if (ABORT) return;
		initRuntime();
		if (Module.onRuntimeInitialized) Module.onRuntimeInitialized();
		postRun()
	}
	return Module;
})();





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

	// Tests:
	console.log(wasmGetHint('@12@@34@<><><><>.<>.'));
	console.log(wasmGetHint('@12@@34@@@@@@.@@@@.@'));
	console.log(wasmGetHint('@@@^12^v34v^.<>v.@<>'));
}