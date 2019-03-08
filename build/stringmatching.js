/*! stringmatchvisualiser 2019-03-09 */
require(["algorithms","plotter"],function(a,b){function c(a){for(var b,c,d="",e=0;e<a.length;e++)b=a[e],(c=b.charCodeAt(0))>=32&&c<256&&(d+=b);return d}new Vue({el:"#app",data:{textInput:"the mathematical theory",patternInput:"thema",text:"",pattern:"",comparisons:[],comparisonIndex:-1,comparisonIndexString:"",matches:[],algorithm:"naive",toggledescription:!1,togglestats:!1,togglegraphblurb:!1},created:function(){this.start()},watch:{textInput:function(){this.start()},patternInput:function(){this.start()},comparisonIndexString:function(){this.comparisonIndex=parseInt(this.comparisonIndexString)},comparisonIndex:function(){this.comparisons.length>0&&this.comparisonIndex>=0&&this.comparisonIndex<this.comparisons.length&&b.showCurrent(this.comparisons[this.comparisonIndex]),this.comparisonIndexString=""+this.comparisonIndex}},methods:{start:function(){var d;this.text=this.textInput,this.pattern=this.patternInput,this.algorithm.includes("oyer")&&(this.text=c(this.text),this.pattern=c(this.pattern)),d=a.run(this.algorithm,this.pattern,this.text),this.comparisons=d.comparisons,this.matches=d.matches,this.comparisonIndex=0,this.comparisons.length>0&&(b.plot(d),b.showCurrent(this.comparisons[this.comparisonIndex]))},textClass:function(a){var b=a-1,c="table-char";return b===this.i&&(c+=" current",this.text[b]==this.pattern[b-this.patternPos]&&(c+=" match")),c},patternClass:function(a){var b=a-1,c="table-char";return b-this.patternPos===this.j&&(c+=" current",this.text[b]==this.pattern[b-this.patternPos]&&(c+=" match")),c},patternChar:function(a){return a>=this.patternPos&&a<this.patternPos+this.pattern.length?this.pattern[a-this.patternPos]:" "},next:function(){this.comparisonIndex<this.comparisons.length-1&&(this.comparisonIndex+=1)},previous:function(){this.comparisonIndex>0&&(this.comparisonIndex-=1)}},computed:{n:function(){return this.text.length},m:function(){return this.pattern.length},i:function(){return this.comparisons.length>0&&this.comparisonIndex>=0?this.comparisons[this.comparisonIndex][0]:0},j:function(){return this.comparisons.length>0&&this.comparisonIndex>=0?this.comparisons[this.comparisonIndex][1]:0},patternPos:function(){return this.i-this.j},nextDisabled:function(){return!(this.comparisonIndex>=0&&this.comparisonIndex<this.comparisons.length-1)},previousDisabled:function(){return!(this.comparisonIndex>0)},comparisonsMax:function(){return this.comparisons.length-1},algorithmList:function(){return a.list},sourceurl:function(){return"./"+this.algorithm+".js"}}})});