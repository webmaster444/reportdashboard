$(function() {    
    var donutData,donutData1;
    d3.json('assets/data/jsondata.json',function(data){     
        let _data = data;                       
        localStorage.setItem('jsondata',_data);
        var donutData = parseData(data, 'test status', 'Flow exection status');        
        donutChart('#flow_execution_chart', donutData,_data,'test status');

        var barChartData = parseBarChartData(_data);
        drawBarchart("#scenarios_by_funcion_chart", barChartData);

        var donutData1 = parseData(data,'auomated', "Behavioural test coverage");
        donutChart('#behavioural_test_coverage', donutData1,_data, 'auomated');                
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
}