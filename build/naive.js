/*! stringmatchvisualiser 2019-03-09 */
define([],function(){function a(a,b){var c,d,e=b.length,f=a.length,g=[],h=[],i=function(c,d){return g.push([c,d]),b[c]==a[d]};for(c=0;c<=e-f;c++){for(d=0;d<f&&i(c+d,d);)d+=1;d==f&&h.push(g.length-1)}return{comparisons:g,matches:h}}return a});