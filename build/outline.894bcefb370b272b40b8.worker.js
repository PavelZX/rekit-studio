!function(e){function t(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=0)}([function(e,t){function n(e,t){t=t||"";var n=[];return e.body.forEach(function(e){if(e.declaration&&/^(ClassDeclaration|FunctionDeclaration|VariableDeclaration)$/.test(e.declaration.type)&&(e=e.declaration),"ClassDeclaration"===e.type)return void n.push(r(e));var a=void 0,o=void 0;if(/^(ClassProperty|ClassMethod)$/.test(e.type)&&(a=t+"-"+e.key.name,o=e.key.name),/^(FunctionDeclaration)$/.test(e.type)&&(a=t+"-"+e.id.name,o=e.id.name),/^(VariableDeclaration)$/.test(e.type)){var i=e.declarations[0],s=void 0;s="ObjectPattern"===i.id.type?i.id.properties[0].key.name:i.id.name,a=t+"-"+s,o=s}a&&o&&n.push({key:a,label:o,startLine:e.loc.start.line,type:e.type})}),n}function r(e){return{key:e.id.name,label:e.id.name,type:e.type,startLine:e.loc.start.line,children:n(e.body,e.id.name)}}self.importScripts(["/static/libs/babylon.js"]),self.addEventListener("message",function(e){var t=e.data.code;try{var r=babylon.parse(t,{sourceType:"module",plugins:["jsx","flow","doExpressions","objectRestSpread","decorators","classProperties","exportExtensions","asyncGenerators","functionBind","functionSent","dynamicImport"]}),a={key:"root",label:"Root",children:n(r.program)};self.postMessage({root:a})}catch(e){}})}]);
//# sourceMappingURL=outline.894bcefb370b272b40b8.worker.js.map