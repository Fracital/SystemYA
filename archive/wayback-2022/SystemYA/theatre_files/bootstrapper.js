var _____WB$wombat$assign$function_____=function(name){return (globalThis._wb_wombat && globalThis._wb_wombat.local_init && globalThis._wb_wombat.local_init(name))||globalThis[name];};if(!globalThis.__WB_pmw){globalThis.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opener = _____WB$wombat$assign$function_____("opener");
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.TOMPBoot=e():t.TOMPBoot=e()}(self,(function(){return function(){"use strict";var t={d:function(e,r){for(var o in r)t.o(r,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:r[o]})},o:function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}},e={};t.d(e,{default:function(){return s}});const r=/\s/,o=/^https?:\/\//;class s{static SearchBuilder=class{constructor(t){this.template=String(t)}query(t){return(t=String(t)).match(o)?t:t.includes(".")&&!t.match(r)?`http://${t}`:this.template.replace("%s",encodeURIComponent(t))}};static CODEC_XOR=1;static CODEC_PLAIN=0;static LOG_TRACE=0;static LOG_DEBUG=1;static LOG_INFO=2;static LOG_WARN=3;static LOG_ERROR=4;static LOG_SILENT=5;constructor(t){if("string"!=typeof t.directory)throw new TypeError("Directory must be a string");this.config=t,this.ready=this.register()}async register(){if(!("serviceWorker"in navigator))throw new Error("Your browser does not support service workers.");const t=`${this.config.directory}worker.js?config=${encodeURIComponent(JSON.stringify(this.config))}`;this.worker=await navigator.serviceWorker.register(t,{scope:this.config.directory,updateViaCache:"none"}),await this.worker.update(),this.config.loglevel<=1&&console.debug("Registered the service worker.")}#t(t,e){return`${this.config.directory}process:${encodeURIComponent(t)}:${encodeURIComponent(e)}`}html(t){return this.#t("html",t)}css(t){return this.#t("css",t)}js(t){return this.#t("js",t)}binary(t){return this.#t("binary",t)}}return e.default}()}));
//# sourceMappingURL=bootstrapper.js.map
}

/*
     FILE ARCHIVED ON 15:40:12 May 26, 2022 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 05:55:10 Nov 18, 2026.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  capture_cache.get: 0.415
  load_resource: 420.115 (2)
  PetaboxLoader3.resolve: 336.592 (2)
  PetaboxLoader3.datanode: 81.205 (2)
  revisit.resolve: 315.328
*/