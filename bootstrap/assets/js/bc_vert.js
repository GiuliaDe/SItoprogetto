

var data;
// Get the data
d3.json("assets/data/hier_figure.json", function(error, json) {
  console.log("hf",json)
 
  json.forEach(function(d) {
		d.value = +d.value;
  });

	d3.select('#indsfig')
			.on("change", function () {
				var sect = this
				var section = sect.options[sect.selectedIndex].value;
                console.log(section)

				data = filterJSON(json, 'figura', section);

                //console.log(data)
	      //debugger
	      
		    data.forEach(function(d) {
    			d.frequenza = +d.frequenza;
    			//d.year = parseDate(String(d.year));
    			d.active = true;
    		});
    		
		    
		    //debugger
				updatehbcFigura(data);


				//jQuery('h1.page-header').html(section);
			});

	// generate initial graph
	data = filterJSON(json, 'figura', 'Analisti e progettisti di software');
	updatehbcFigura(data);

});

function filterJSON(json, key, value) {
  //  console.log("filter: ",key, value, json)
  var result = [];
  json.forEach(function(val,idx,arr){
    //  console.log("foreach")
     // console.log("check",key, val[key], value)
    if(val[key] == value){
     // console.log("found")
      result.push(val)
    }
  })
  //console.log("risultato: ",result);
  return result;

}


function updatehbcFigura(data){
	//set domain for the x axis
    console.log("data figura :", data)
	yChartF.domain(data.map(function(d){ 
    //	 console.log("ychart: ",d);
        return d.skill; }) );
	//set domain for y axis
	xChartF.domain( [0, d3.max(data, function(d){
		//console.log("frea: ",+d.frequenza);
		 return +d.frequenza; })] );

	//console.log("xch",xChart)
	
	//get the width of each bar 
	var barHeight = height / data.length;
	
	//select all bars on the graph, take them out, and exit the previous data set. 
	//then you can add/enter the new data set
	var bars = chartF.selectAll(".barF")
					.data(data)
					.remove()
					.exit()
					.data(data)		
	//now actually give each rectangle the corresponding data
	bars.enter()
		.append("rect")
		.attr("class", "barF")
		//.attr("x", function(d, i){ return i * barHeight + 1 })
		.attr("x",0)
		.attr("y", function(d, i){ console.log("y: ", i*barHeight+1)
			return  i * barHeight + 1 })
		.attr("width", function(d){
			//console.log("width: ",d.frequenza, xChart(d.frequenza))
			return xChart(d.frequenza); })
			//return d.frequenza;})
		//.attr("width", function(d){console.log("valore", xChart(d.frequenza)) 
		//	return height - xChart(d.frequenza); })
		.attr("height", barHeight - 1)
		.attr("fill", "#ABCDEF");
	//left axis
	
	chartF.select('.yAxisF')
		  .call(yAxisF)
		  .selectAll("text")
		  
		  
	//bottom axis
	chartF.select('.xAxisF')
		//.attr("transform", "translate(0," + height + ")")
		.call(xAxisF)
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", ".8em")
			.attr("dy", ".15em")
			/*
			.attr("transform", function(d){
				return "rotate(-65)";
			});
			*/
			
}//end update

//set up chart
var margin = {top: 80, right: 20, bottom: 35, left: 80};
var width = 700;
var height = 500;

var svgF = d3.select("#hierbcfigure")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				
var chartF = svgF.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xChartF = d3.scale.linear()
				.range([0, width]);
				
var yChartF = d3.scale.ordinal()
	.rangeRoundBands([height, 0], .1) 


var xAxisF = d3.svg.axis().orient("top").scale(xChartF);
var yAxisF = d3.svg.axis().orient("left").scale(yChartF);


//set up axes
//left axis

	chartF.append("g")
		  .attr("class", "yAxisF")
		  .call(yAxisF)
		  
      	
    
	//bottom axis
	chartF.append("g")
		.attr("class", "xAxisF")
		.attr("transform", "translate("-10+"," + height + ")")
		.call(xAxisF)
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", ".8em")
			.attr("dy", ".15em")
			/*
			.attr("transform", function(d){
				return "rotate(-65)";
			});
			*/

//add labels
chartF
	.append("text")
	.attr("transform", "translate(-70," +  (height+margin.bottom)/2 + ") rotate(-90)")
	.text("Competenze");
		
chartF
	.append("text")
	.attr("transform", "translate(" + (width/4) + "," + ( -30) + ")")
	.text("Frequenza");

//use bothData to begin with
//update(data);