function BaseSimpleD3Chart() {
  this.svg={};
}

BaseSimpleD3Chart.prototype.shot=function(type=" image/png", encoderOptions=0.92){
  // this.svg=this.svgCanvas.nodes()[0].outerHTML
  if(this.svg){
    let canvas=svg2Canvas(this.svg)
    return canvas?canvas.toDataURL(type,encoderOptions):false
  }
  function svg2Canvas(svg){
    if(typeof canvg!=='undefined'){
        var _canvas=document.createElement('canvas');
        canvg(_canvas,svg)
        return _canvas;
      }
    return false
  }
 
}

function d3ColumnChart(option) {
  BaseSimpleD3Chart.call(this);
  //初始化配置项
  var option=!option?{}:option;
  // this.option=option;
  var margin={top: 10, right: 10, bottom: 10, left: 10}
  var element=option.hasOwnProperty("element")?option.element:"body";
  var svgWidth=option.hasOwnProperty("width")?option.width:200;
  var svgheigth=option.hasOwnProperty("height")?option.height:200;
  this.axisTag=option.hasOwnProperty("xTag")?option.xTag:[];
  var series =option.hasOwnProperty("series")&&isArrayFn(option.series)?option.series:[];
  var leftAxis =option.hasOwnProperty("leftAxis")?option.leftAxis:null;
  var bottomAxis =option.hasOwnProperty("bottomAxis")?option.bottomAxis:null;
  var rightAxis=option.hasOwnProperty("rightScale")?option.rightAxis:null;
  var colorScale =option.hasOwnProperty("colorScale")?option.colorScale:null;
  this._svg=d3.select(element).append("svg")
              .attr("width",svgWidth)
              .attr("height",svgheigth);
  console.log("svg",this._svg)
  this.bottomAxis =bottomAxis||d3.scaleBand().domain(this.axisTag).rangeRound([margin.left, svgWidth - margin.right]).padding(0.5)
  this.leftAxis =leftAxis||d3.scaleLinear().domain([0, 10]).rangeRound([svgheigth - margin.bottom-margin.top, 0]);
  this.rightAxis =rightAxis;
  this.colorScale = colorScale||d3.scaleOrdinal(d3.schemeCategory10);
  //绘制坐标轴
  this._svg.append("g")
      // .attr("transform", "translate("+margin.left+"," + (svgheigth- margin.bottom) + ")")
      // .attr("transform", "translate("+0+"," + (svgheigth- margin.bottom) + ")")
      .attr("transform", "translate("+0+"," + (this.leftAxis(0)) + ")")
      .call(d3.axisBottom(this.bottomAxis));

  if(this.rightAxis){
    this._svg.append("g")
        .attr("transform", "translate(" + (svgWidth) + ",0)")
        .call(d3.axisRight(this.rightAxis));
  }
  //绘制矩形
  var _this=this;
  bars = this._svg.selectAll(".bar").data(series).enter().each(function(d,index,j){
    var nodelen=j.length;
    var bandwidth=_this.bottomAxis.bandwidth()
    var xAxis=_this.bottomAxis;
    var xTag=_this.axisTag;
    var yAxis=_this.leftAxis;
    var viewheigt=svgheigth-margin.bottom-margin.top
    var rect=_this._svg.append("g").selectAll("rect").data(d).enter().append("rect")
                      .attr("fill",_this.colorScale(index))
                      .attr("x", function(d,i) {return xAxis(xTag[i])+bandwidth/nodelen*index})
                      .attr("width", bandwidth/nodelen)
                      .attr("y", function(d) { return _this.leftAxis(d); })
                      .attr("height", function(d,i) { return viewheigt - yAxis(d);});
 })
 this.svg=this._svg.nodes()[0].outerHTML;
  function isArrayFn(value){
    if (typeof Array.isArray === "function") {
      return Array.isArray(value);
    }else{
      return Object.prototype.toString.call(value) === "[object Array]";
    }
  }

}
d3ColumnChart.prototype=Object.create(BaseSimpleD3Chart.prototype);
d3ColumnChart.prototype.constructor=d3ColumnChart;
