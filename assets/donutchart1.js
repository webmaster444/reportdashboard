function donutChart(chartWrapper, dataset){
// var dataset = [
// 	{ name: 'Firearms', total: 8124, percent: 67.9 },
// 	{ name: 'Knives or cutting instruments', total: 1567, percent: 13.1 },
// 	{ name: 'Other weapons', total: 1610, percent: 13.5 },
// 	{ name: 'Hands, fists, feet, etc.', total: 660, percent: 5.5 }
// ];

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["green", "red", "orange", "#6b486b", "#a05d56"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
	 .startAngle(1.1*Math.PI)
    .endAngle(3.1*Math.PI)
    .padAngle(.02)
    .value(function(d) { return d.total; });

var svg = d3.select(chartWrapper).append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox', function(){
      return '0 0 '+ width + ' ' + height;
    })
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


 var g = svg.selectAll(".arc")
      .data(pie(dataset))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
	.style("fill", function(d) { return color(d.data.name); })
    .transition().delay(function(d,i) {
	return i * 500; }).duration(500)
	.attrTween('d', function(d) {
		var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
		return function(t) {
			d.endAngle = i(t); 
			return arc(d)
			}
		}); 
  // g.append("text")
  //     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
  //     .attr("dy", ".35em")
	 //  .transition()
	 //  .delay(1000)
  //     .text(function(d) { return d.data.name; });
	  
	  
//d3.select("body").transition().style("background-color", "#d3d3d3");
function type(d) {
  d.total = +d.total;
  return d;
}

}