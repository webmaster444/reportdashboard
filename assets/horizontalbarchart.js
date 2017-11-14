 function drawHorizontalBarChart(chartWrapper, dataset,oData,selectedKey){    
    var axisMargin = 20,
            margin = 40,
            valueMargin = 4,
            width = parseInt(d3.select(chartWrapper).style('width'), 10),
            height = parseInt(d3.select(chartWrapper).style('height'), 10),
            barHeight = (height-axisMargin-margin*2)* 0.4/dataset.length,
            barPadding = (height-axisMargin-margin*2)*0.6/dataset.length,
            bar, svg, scale, xAxis, labelWidth = 0;

    max = d3.max(dataset, function(d) { return d.total; });

    svg = d3.select(chartWrapper)
            .append("svg")            
            .attr("width", '100%')
            .attr("height", '100%')
            .attr("viewBox",'0 0 '+ width + ' ' + height);


    bar = svg.selectAll("g")
            .data(dataset)
            .enter()
            .append("g");

    bar.attr("class", "bar")
            .attr("cx",0)
            .attr("transform", function(d, i) {
                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

    bar.append("text")
            .attr("class", "label")
            .attr("y", barHeight / 2)
            .attr("dy", ".35em") //vertical align middle
            .text(function(d){
                return d.name;
            }).each(function() {
        labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
    });

    scale = d3.scale.linear()
            .domain([0, max])
            .range([0, width - margin*2 - labelWidth]);

    xAxis = d3.svg.axis()
            .scale(scale)
            .tickSize(-height + 2*margin + axisMargin)
            .orient("bottom");

    bar.append("rect")
            .attr("transform", "translate("+labelWidth+", 0)")
            .attr("height", barHeight)
						.attr("width", 0)
						.transition()
						.duration(1500)
            .attr("width", function(d){
                return scale(d.total);
            });

    bar.append("text")
            .attr("class", "value")
            .attr("y", barHeight / 2)
            .attr("dx", -valueMargin + labelWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .text(function(d){
                return (d.total);
            })
            .attr("x", function(d){
                var width = this.getBBox().width;
                return Math.max(width + valueMargin, scale(d.total));
            });

    svg.insert("g",":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
            .call(xAxis);

}