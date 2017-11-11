$(function() {    
    var donutData,donutData1;
    d3.json('assets/jsondata.json',function(data){
        var _data = data;
        
        // donutData = parseData(_data,'test status','Flow exection status');        
        // var donuts = new DonutCharts('#flow_execution_chart');
        // donuts.create(donutData);

        var donutData = parseData(data, 'test status', 'Flow exection status');
        donutChart('#flow_execution_chart', donutData);

        var barChartData = parseBarChartData(_data);
        drawBarchart("#scenarios_by_funcion_chart", barChartData);

        var donutData1 = parseData(data,'auomated', "Behavioural test coverage");
        donutChart('#behavioural_test_coverage', donutData1);
        // donuts1.create(donutData1);
    })
});

function parseBarChartData(data){
    var dataset = d3.nest()
        .key(function(d){return d['funcional area'];})
        .rollup(function(v){return v.length;})
        .entries(data);
    
    var tmp_data = new Array();
    for(index in dataset){
        var datum = dataset[index];
                    
        tmp_data.push({
            'key':datum.key,
            'value':datum.values
        })
    }

    return tmp_data;
}

function parseData(data,filterKey,title){                
        var datasetByTestStatus = d3.nest()
        .key(function(d){return d[filterKey];})
        .rollup(function(v){return v.length;})
        .entries(data);
                
        var data1 = Object.values(datasetByTestStatus);        

        var cat = [];
        var counts = [];
        for(index in data1){
            var tmp_array = Object.values(data1[index]);
            cat.push(tmp_array[0]);
            counts.push(tmp_array[1]);
        }

        var total = 0;
        for(count in counts){
            total +=counts[count];
        }
        
    
        var dataset = new Array();
        var tmp_data = new Array();
        for(var j=0; j<cat.length; j++){
            tmp_data.push({
                "name":cat[j],
                "total":counts[j]
            });
        }

return tmp_data;
        // dataset.push({
        //     "type":title,
        //     "unit":"",
        //     "data":tmp_data,
        //     "total":total
        // });
        // return dataset;        
    }