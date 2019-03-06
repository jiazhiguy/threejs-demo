function BaseSimpleD3Chart() {
  var axisTag=['A','B','C','D'];
  var series =[100,200,200,200];
  var option={
      margin:{top: 20, right: 30, bottom: 30, left: 60}||option.margin,
      svgWidth:200||option.width,
      svgheigth:200||option.height,
  }
  this.axisTag=axisTag;
  this.series=series;
  this.option=option; 
  this.svgCanvas={};
  this.svg={};
  this.draw=function(series){
    // this.svg=svgCanvas;
    var x=scale(series).x;
    console.log('scale',scale(series))
    var y=scale(series).y;
    var z=scale(series).z;
    drawScale(this.svgCanvas,x,y);
    drawMain(this.svgCanvas,x,y,z);
  }; 
  this.update=function(newSeries){
    // this.draw(newSeries)
  }  
  function scale(series){
    return {    
       x: d3.scaleBand().domain(axisTag).rangeRound([option.margin.left, option.svgWidth - option.margin.right]).padding(0.5),
       y: d3.scaleLinear().domain([0, d3.max(series)]).rangeRound([option.svgheigth - option.margin.bottom-option.margin.top, 0]),
       z: d3.scaleOrdinal(d3.schemeCategory10)}
  }
  //根据比例尺绘制x,y轴
  function drawScale(svgCanvas,x,y){
    
    svgCanvas.append("g")
      .attr("transform", "translate(0," + (y(0)) + ")")
      .call(d3.axisBottom(x));

    svgCanvas.append("g")
      .attr("transform", "translate(" + option.margin.left + ",0)")
      // .attr("transform", "translate(0,0)")
      .call(d3.axisLeft(y));
  }
  //绘制主区图像
  function drawMain(svgCanvas,x,y,z){
    console.log("@@@",svgCanvas,series);
    svgCanvas.selectAll("rect").data(series).enter().append("rect")
      .attr("width", scale(series).x.bandwidth)
      .attr("x", function(d,i) { return x(axisTag[i]); })
      .attr("y", function(d) { return y(d); })
      .attr("height", function(d) { return option.svgheigth-y(d)-option.margin.bottom-option.margin.top; })
      .attr("fill",function (d,i){return z(i);})
    .on("mouseover",function(d,i){
        // tooltip.html(d)
        //        .style("left",(d3.event.pageX+10)+"px")
        //        .style("top",(d3.event.pageY -10)+"px")
        //        .style("opacity",1.0)
        //        .style("background-color",z(i))
        d3.select(this).transition().duration(500)
          .attr("fill","black")
    })
    .on("mouseout",function(d,i){
        // tooltip.style("opacity",0);
        d3.select(this).transition().duration(500)
          .attr("fill",z(i))
    });
  }
}

// BaseSimpleD3Chart.prototype.update=function(data){
//   console.log("this is update")
// }
BaseSimpleD3Chart.prototype.create=function(){
  
  this.svgCanvas=d3.select("body").append("svg")
                    .attr("width",this.option.svgWidth)
                    .attr("height",this.option.svgheigth)
  this.draw(this.series);
  this.svg=this.svgCanvas.nodes()[0].outerHTML
  
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

function d3ColumnChart() {
  BaseSimpleD3Chart.call(this);

}
d3ColumnChart.prototype=Object.create(BaseSimpleD3Chart.prototype);
d3ColumnChart.prototype.constructor=d3ColumnChart;

