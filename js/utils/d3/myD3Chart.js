function d3SimpleColumnChart() {

  // var axisTag=['星期一','b','c','d'];
  // // var axisTag=[1,2,'c','d'];
  // // var yaxisTag=[];
  // var series =[121,200,300,400];
  // console.log('series',series);
  // var svg = d3.select("svg")
  //     // .style("transparent",true)
  //     .style("background", "transparent")
      
  //     margin = {top: 20, right: 30, bottom: 30, left: 60},
  //     width = +svg.attr("width"),
  //     height = +svg.attr("height");
    
  var axisTag=['A','B','C','D'];
  var series =[100,200,200,200];
  var margin = {top: 20, right: 30, bottom: 30, left: 60};
  var svgWidth=200;
  var svgheigth=200;
  var sumSeries=d3.sum(series);
  var svg=d3.select("body")
            .append("svg")
            .attr("width",svgWidth)
            .attr("height",svgheigth)
  var tooltip=d3.select("body")
                .append("div")
                .attr("class","tooltip")
                .style("opacity",0.0);
  var x = d3.scaleBand()
            .domain(axisTag)
            .rangeRound([margin.left, svgWidth - margin.right])
            .padding(0.5)
  var y = d3.scaleLinear()
            .domain([0, d3.max(series)])
            .rangeRound([svgheigth - margin.bottom-margin.top, 0]);
  var z = d3.scaleOrdinal(d3.schemeCategory10);
  svg.selectAll("rect")
    .data(series)
    .enter()
    .append("rect")
      .attr("width", x.bandwidth)
      .attr("x", function(d,i) { return x(axisTag[i]); })
      .attr("y", function(d) { return y(d); })
      .attr("height", function(d) { return svgheigth-y(d)-margin.bottom-margin.top; })
      .attr("fill",function (d,i){
        return  z(i);
      })
      .on("mouseover",function(d,i){
            tooltip.html(d)
                   .style("left",(d3.event.pageX+10)+"px")
                   .style("top",(d3.event.pageY -10)+"px")
                   .style("opacity",1.0)
                   .style("background-color",z(i))
      
            d3.select(this)
              .transition()
              .duration(500)
              .attr("fill","black")
      })
      .on("mouseout",function(d,i){
          tooltip.style("opacity",0);
          d3.select(this)
            .transition()
            .duration(500)
            .attr("fill",z(i))
      });
  svg.append("g")
      .attr("transform", "translate(0," + (y(0)) + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      // .attr("transform", "translate(0,0)")
      .call(d3.axisLeft(y));
  return svg.nodes()[0].outerHTML
}

function d3SimplePieChart(){
  console.log("@@@@@@",EventEmitter)
  EventEmitter.call(this);
  // var updateEvent = new CustomEvent('update', { 
  //     detail: { title: 'This is update!'},
  // });

  // if(this.dispatchEvent) {  
  //     this.dispatchEvent(updateEvent);
  // } else {
  //     this.fireEvent(updateEvent);
  // }
 // this.addEventListener('update', function(event){
 //    // 如果是CustomEvent，传入的数据在event.detail中
 //    console.log('得到数据为：', event.detail);

 //    // ...后续相关操作
 //  });
  // console.log("updateEvent",updateEvent)
  var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  var axisTag=['A','B','C','D'];
  var series =[121,200,200,200];
  var svgWidth=200;
  var svgheigth=200;
  var sumSeries=d3.sum(series);
  var svg=d3.select("body").append("svg").attr("width",svgWidth).attr("height",svgheigth)
  var tooltip=d3.select("body").append("div").attr("class","tooltip").style("opacity",0.0);
  //数据转换器
  var pie=d3.pie().sort(null).value(function(d){return d})
  var piedata=pie(series);
  console.log('piedata',piedata)
  //弧线生成器
  var radius=d3.min([svgWidth,svgheigth])/3;
  var innnerRadius=0;
  var arc=d3.arc().innerRadius(innnerRadius).outerRadius(radius)

  var parentPath=svg.append("g").attr("transform","translate("+ (svgWidth/2) +","+ (svgheigth/2) +")");
  parentPath.selectAll("path").data(piedata).enter().append('path')
    .each(function(d) { this._current = d; })
    .attr('fill',function(d,i){
      return colorScale(i)
    })
    .attr('d',function(d){
       return arc(d)
    })
    .on("mouseover",mouseover)
    .on("mouseout",mouseout)

  var parentText=svg.append("g").attr("transform","translate("+ (svgWidth/2) +","+ (svgheigth/2) +")");
  parentText.selectAll("text").data(piedata).enter().append("text")
    .attr("transform",function(d){
      return "translate("+arc.centroid(d)+")"
    })
    .attr("text-anchor","middle")
    .attr("font-size","10px")
    .text(function(d,i){
      return axisTag[i]+":"+(d.data/sumSeries*100).toFixed(2)+"%"
    })

  function mouseover(d,i){
      tooltip.html(d.data)
         .style("left",(d3.event.pageX+2)+"px")
         .style("top",(d3.event.pageY -2)+"px")
         .style("opacity",1.0)
         .style("background-color",colorScale(i))
      d3.select(this).transition().duration(500)
        .attr("transform",function(d,i){
          return "scale(1.2)"
          })
        .attr("fill","skyblue")
  }
  function mouseout(d,i){
      tooltip.style("opacity",0);
      d3.select(this).transition().duration(500)
        .attr("transform",function(d,i){
          return "scale(1)"
        })
        .attr("fill",colorScale(i))
  }
  this.update=function(nD){
    svg.selectAll("path").data(pie(nD))
        .transition()
        .duration(500)
        .attrTween("d", arcTween);
    parentText.selectAll("text").data(pie(nD))
        .attr("transform",function(d){return "translate("+arc.centroid(d)+")"})
        .text(function(d,i){return axisTag[i]+":"+(d.data/d3.sum(nD)*100).toFixed(2)+"%"})

    this.emit("update","successful")
    this.on("update",function(d){
      console.log(d)
    })  
  }
  function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) { return arc(i(t));};
  }
  this.svg=svg.nodes()[0].outerHTML
  console.log(this.svg.dispatchEvent)
}
// d3SimplePieChart.prototype = Object.create(EventEmitter.prototype); 
// d3SimplePieChart.prototype.constructor = d3SimplePieChart;
// d3SimplePieChart.prototype.update=function(data){
//    svg.selectAll("path").data(pie(data)).transition().duration(500)
//                 .attrTween("d", arcTween);
//    function arcTween(a) {
//         var i = d3.interpolate(this._current, a);
//         this._current = i(0);
//         return function(t) { return arc(i(t));};
//     }    
// }
function d3SimpleLineChart(){
  var axisTag=['A','B','C','D'];
  var series =[100,200,200,200];
  var margin = {top: 20, right: 30, bottom: 30, left: 60};
  var svgWidth=200;
  var svgheigth=200;
  var sumSeries=d3.sum(series);

  var svg=d3.select("body")
          .append("svg")
          .attr("width",svgWidth)
          .attr("height",svgheigth)
          // .attr("tranform","transl  
  var x = d3.scaleBand()
      .domain(axisTag)
      .rangeRound([margin.left, svgWidth - margin.right])
      .padding(0.5)

  var y = d3.scaleLinear()
      .domain([0, d3.max(series)])
      // .rangeRound([svgheigth - margin.bottom-margin.top, 0]);
      .rangeRound([svgheigth - margin.bottom-margin.top, 0]);
  var z = d3.scaleOrdinal(d3.schemeCategory10);
  var line=d3.line()
             .x(function(d,i){
                return x(axisTag[i])
             })
             .y(function(d,i){
                return y(d)
             })
  line.curve(d3.curveBasis);
  // console.log('linepoint',line(series))
  svg.append("g")
      .attr("transform", "translate(0," + (y(0)) + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      // .attr("transform", "translate(0,0)")
      .call(d3.axisLeft(y));
  svg.append("g")
     .append("path")
     .attr("d",line(series))
     .attr('stroke', 'skyblue')
     .attr('stroke-width', '2px')
     .attr('fill', 'none')
  return svg.nodes()[0].outerHTML
}



 function EventEmitter () {
     this.__z_e_listeners = {};
 };
 EventEmitter.prototype.on = function (evt, handler, context) {
     var handlers = this.__z_e_listeners[evt];
     if (handlers === undefined) {
         handlers = [];
         this.__z_e_listeners[evt] = handlers;
     }
     var item = {
         handler: handler,
         context: context
     };
     handlers.push(item);
     return item;
 };
 EventEmitter.prototype.off = function (evt, handler, context) {
     var handlers = this.__z_e_listeners[evt];
     if (handlers !== undefined) {
         var size = handlers.length;
         for (var i = 0; i < size; i++) {
             var item = handlers[i];
             if (item.handler === handler && item.context === context) {
                 handlers.splice(i, 1);
                 return;
             }
         }
     }
 };
 EventEmitter.prototype.emit = function (type, event) {
     var hanlders = this.__z_e_listeners[type];
     if (hanlders !== undefined) {
         var size = hanlders.length;
         for (var i = 0; i < size; i++) {
             var ef = hanlders[i];
             var handler = ef.handler;
             var context = ef.context;
             handler.apply(context, [event]);
         }
     }
 };