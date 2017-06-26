
var data;
// Get the data
d3.json("assets/js/hier_skills.json", function(error, hbcdata) {
  console.log("json:",hbcdata)
 
  hbcdata.forEach(function(d) {
		d.value = +d.value;
  });

	d3.select('#inds')
			.on("change", function () {
				var sect = this
				console.log(sect);
				var section = sect.options[sect.selectedIndex].value;
                console.log(section)

				data = filterJSON(hbcdata, 'skill', section);

                console.log(data)
	      //debugger
	      
		    data.forEach(function(d) {
    			d.frequenza = +d.frequenza;
    			//d.year = parseDate(String(d.year));
    			d.active = true;
    		});
    		
		    
		    //debugger
				update(data);


				//jQuery('h1.page-header').html(section);
			});

	// generate initial graph
	data = filterJSON(hbcdata, 'skill', 'Pacchetto Office');
	update(data);

});

function filterJSON(dati, key, value) {
   console.log("filter: ",key, value, dati)
  var result = [];
  dati.forEach(function(val,idx,arr){
    //  console.log("foreach")
     // console.log("check",key, val[key], value)
    if(val[key] == value){
     // console.log("found")
      result.push(val)
    }
  })
  console.log("risultato: ",result);
  return result;

}


function update(data){
	//set domain for the x axis
    console.log("update:", data)
	yChart.domain(data.map(function(d){ 
    	// console.log("ychart: ",d);
        return d.figura; }) );
	//set domain for y axis
	xChart.domain( [0, d3.max(data, function(d){
		//console.log("frea: ",+d.frequenza);
		 return +d.frequenza; })] );

	//console.log("xch",xChart)
	
	//get the width of each bar 
	var barHeight = height / data.length;
	
	//select all bars on the graph, take them out, and exit the previous data set. 
	//then you can add/enter the new data set
	var bars = chart.selectAll(".bar")
					.data(data)
					.remove()
					.exit()
					.data(data)		

	//now actually give each rectangle the corresponding data
	bars.enter()
		.append("rect")
		.attr("class", "bar")
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
	
	chart.select('.y')
		  .call(yAxis)
		  .selectAll("text")
		  
		  
	//bottom axis
	chart.select('.xAxis')
		//.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
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

var svg = d3.select("#hierbcskill")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				
var chart = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xChart = d3.scale.linear()
				.range([0, width]);
				
var yChart = d3.scale.ordinal()
	.rangeRoundBands([height, 0], .1) 


var xAxis = d3.svg.axis().orient("top").scale(xChart);
var yAxis = d3.svg.axis().orient("left").scale(yChart);

//set up axes
//left axis

	chart.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		  
      	
    
	//bottom axis
	chart.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate("-10+"," + height + ")")
		.call(xAxis)
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
chart
	.append("text")
	.attr("transform", "translate(-70," +  (height+margin.bottom)/2 + ") rotate(-90)")
	.text("Competenze");
		
chart
	.append("text")
	.attr("transform", "translate(" + (width/4) + "," + ( -30) + ")")
	.text("Frequenza");
