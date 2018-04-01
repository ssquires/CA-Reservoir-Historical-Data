var data = [{
    "date": "September 2004",
    "SAM": [{"name": "full",
             "percent": 55.6},
            {"name": "empty",
             "percent": 44.4}],
    "BAG": [{"name": "full",
             "percent": 10.0},
            {"name": "empty",
             "percent": 90.0}],
    "ZUK": [{"name": "full",
             "percent": 90.5},
            {"name": "empty",
             "percent": 9.5}],
    }, 
    {
    "date": "October 2004",
    "SAM": [{"name": "full",
             "percent": 60.6},
            {"name": "empty",
             "percent": 39.4}],
    "BAG": [{"name": "full",
             "percent":20.0},
            {"name": "empty",
             "percent": 80.0}],
    "ZUK": [{"name": "full",
             "percent": 80.5},
            {"name": "empty",
             "percent": 19.5}],
    },
    {
    "date": "November 2004",
    "SAM": [{"name": "full",
             "percent": 40.5},
            {"name": "empty",
             "percent": 59.5}],
    "BAG": [{"name": "full",
             "percent":25.5},
            {"name": "empty",
             "percent": 74.5}],
    "ZUK": [{"name": "full",
             "percent": 85.0},
            {"name": "empty",
             "percent": 15.0}],
    },
    {
    "date": "December 2004",
    "SAM": [{"name": "full",
             "percent": 70.9},
            {"name": "empty",
             "percent": 29.1}],
    "BAG": [{"name": "full",
             "percent": 35.4},
            {"name": "empty",
             "percent": 64.6}],
    "ZUK": [{"name": "full",
             "percent": 77.5},
            {"name": "empty",
             "percent": 22.5}],
    }]

var width = 150,
    height = 150,
    radius = Math.min(width, height) / 2;

var color = d3.scaleOrdinal().range(["#00CDFF", "#230059"]);

var arc = d3.arc().outerRadius(radius - 10)
                  .innerRadius(0);

var pies = [];
var svgs = [];
var resNames = [];

// Create date range slider
var sliderMax = data.length - 1;
var s = $("<input type='range' min='0' max='" + sliderMax + "' value='0' class='slider' oninput='sliderMove(this.value)'>");
$("#sliderContainer").append(s);


function sliderMove(v) {
    updateData(v);
}

// Create pie charts
var chartNum = 0;
for (var key in data[0]) {
    console.log(key);
    console.log(data[0][key]);
    if (key === "date") {
        $("#date").text(data[0][key]);
        continue;
    }
        
    resNames.push(key);
    // Create a new div for the chart
    var d = $("<div id='chart" + chartNum + "' class='chart'><h2 class='res-name'>" + key + "</h2></div>");
    $("#pieChart").append(d);
    
    // Add pie chart to pies array
    pies.push(d3.pie()
            .value(function(d) { return d.percent }).sort(null)(data[0][key]));
    
    // Add pie chart to div
    svgs.push(d3.select("#chart" + chartNum)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", 
                  "translate(" + width / 2 + 
                  "," + height / 2 + ")"));
    
    var g = svgs[chartNum].selectAll("arc").data(pies[chartNum]).enter().append("g").attr("class", "arc");

    g.append("path").attr("d", arc)
                .style("fill", function(d) { return color(d.data.name);})
                .each(function(d) { this._current = d; });
    
    var percentLabel = $("<h3 id='label" + chartNum + "'>" + data[0][key][0]["percent"] +"%</h3>");
    d.append(percentLabel);
    
    chartNum++;
}

function updateData(index) {
    $("#date").text(data[index]["date"]);
    for (var j = 0; j < pies.length; j++) {
        var resData = data[index][resNames[j]];
        var pie = d3.pie().value(function(d) { return d.percent;}).sort(null)(resData);
        
        path = d3.select("#chart" + j).selectAll("path").data(pie);
        path.transition().duration(500).attrTween("d", arcTween);
        
        $("#label" + j).text(resData[0]["percent"] + "%");
    }
}



/*************************************
 *        HELPER FUNCTIONS           *
 *************************************/

function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };
}
