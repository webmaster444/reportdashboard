function drawBarchart(wrapper, data){
var margin = {top: 50, right: 20, bottom: 110, left: 40},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Parse the date / time
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select(wrapper).append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox', function(){
      return '0 0 '+parseInt(width + margin.left + margin.right) + ' ' + parseInt(height + margin.top + margin.bottom);})
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Value:</strong> <span style='color:red'>" + d.value + "</span>";
  })

svg.call(tip);

data.forEach(function(d) {
  d.date = d.key;
  d.value = +d.value;
});
	
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text('');

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", height)
      .attr("height", 0)
      .transition()
      .duration(1500)
      .delay(function(d,i){ return i*250})
      .attr("height", function(d) { return height - y(d.value); })
      .attr("y", function(d) {return y(d.value); });

      // .on('mouseover', tip.show)
      // .on('mouseout', tip.hide);
}