d3.json("/ds_jobs").then(data => {
    // give data parameter object a more specific name: ds_jobs
    var ds_jobs = data;
    
    // dropdown menu names
    const menuNames = ["Sector", "Company name", "City", "State"]

    // add the names to the dropdown
    var dropDown = d3.select("select")
    menuNames.forEach(name => dropDown.append('option').text(name));
    
    // Write function to return different word cloud based on dropdown selection.

    // Start
    function populateWords(newChoice){

        // Clear pre-existing chart
        var viz_div = d3.select("#my_dataviz");
        viz_div.html("");

        // Change if possible to JS specialized function
        if (newChoice === "Sector") {
            var category = ds_jobs.map(record => record.category);
        } else if (newChoice === "Company name"){
            var category = ds_jobs.map(record => record.company_name);
        } else if (newChoice === "City") {
            var category = ds_jobs.map(record => record.city);            
        } else if (newChoice === "State") {
            var category = ds_jobs.map(record => record.state);
        };
    
        // -----------------------------------------------------------------------
    
    
        //Function to count unique items in object using some JS tricks
        const countUnique = arr => {
            const counts = {};
            for (var i = 0; i < arr.length; i++) {
                counts[arr[i]] = 1 + (counts[arr[i]] || 0);
            };
            return counts;
        };

        var categoriesUnique = countUnique(category);


        // console.log(categoriesUnique); //355 unique categories, including NULL

        // JSON objects cannot be sorted inherently, so turn them into nested arrarys... 
        // 
        // Make empty arrays for next step.
        var categories_sorted = [];

        // Push from dict to nested array
        for (var job in categoriesUnique) {
            categories_sorted.push([job, categoriesUnique[job]]);        
        };

        // Now sort each in descending order

        categories_sorted.sort(function(a, b) {
            return b[1] - a[1];
        });
    
        // Check indexing 
        // console.log(categories_sorted);
        // console.log(categories_sorted[0])
        // console.log(categories_sorted[0][0])
        // console.log(categories_sorted[0][1])

        // for(var i = 0; i < 50; i++) {
        //     console.log(categories_sorted[i]);
        // }

        // -----------------------------------------------------------------------
        
        // Scale the font!
        // To scale the font, we need to go back and get the max and min for the top 50.

        var categories_sorted_nums = categories_sorted.map(record => record[1]);
        var categories_sorted_min = d3.min(categories_sorted_nums)
        var categories_sorted_max = d3.max(categories_sorted_nums)
    
        // Write function to scale word counts in x to be scaled between a and b...
        // ...based on min and max

        function scaleSize(x, a, b, min, max){
            var fontSize = (((b - a) * (x - min)) / (max - min)) + a;
            return Math.round(fontSize);
        }
    
        // To check the behavior of the function
        // console.log(scaleSize(60, 10, 100, sorted_min, sorted_max))
        // ----------------------------------------------------------------------- 
    
        // OK now rebuild the JSON from the nested array:
        //

        // Check indexing logic
        // var myWords = []
        // myWords[0] = {}
        // myWords[0]["word"] = sorted[0][0]
        // myWords[0]["count"] = sorted[0][1]
        // console.log(myWords[0])

        // Make this a global function:

        function makeWords(arr_sorted, arr_sorted_min, arr_sorted_max){
            
            var tempWords = [];

            if (newChoice === "State") {
                var word_count = 48;
            } else {
                var word_count = 50;
            };

            // colorArray = [];
            // var counter = 0;
            // var position = 10;

            // for (var i = 0; i < word_count; i++) {
            //     if (counter < position) {
            //         colorArray.push("#FF0000")
            //     } else {
            //         colorArray.push("#000000")
            //     }
            // counter++;
            // }

            for(var j = 0; j < word_count; j++) {
                tempWords[j] = {};
                tempWords[j]["word"] = arr_sorted[j][0];
                tempWords[j]["size"] = scaleSize(arr_sorted[j][1], 10, 100, arr_sorted_min, arr_sorted_max);
                // tempWords[j]["color"] = colorArray[j];
                // console.log(tempWords[j]);
            };

            // console.log(word_count);

        return tempWords;
        };
        
        // Starter code for bar plot
        var x_bar = [];
        var y_bar = [];

        for (var j = 0; j < 10; j++) {
            x_bar[j] = categories_sorted[j][0];
            y_bar[j] = categories_sorted[j][1];
        }

        var bar_trace = {
            x: x_bar,
            y: y_bar,
            type: "bar",
            text: x_bar,
            marker: {
                color: "#505050"
            },
            orientation: "v"
        };

        var bar_data = [bar_trace];

        var bar_layout = {
            title: "Top 10",
            xaxis: {},
            yaxis: {title: "Counts"}
        };

        Plotly.newPlot("bar", bar_data, bar_layout);


        var myWords = makeWords(categories_sorted, categories_sorted_min, categories_sorted_max);

        // -----------------------------------------------------------------------
    
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = window.innerWidth - margin.left - margin.right,
            height = window.innerHeight - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
        // Wordcloud features that are different from one word to the other must be here
        var layout = d3.layout.cloud()
                    .size([width, height])
                    .words(myWords.map(function(d) { return {text: d.word, size:d.size, fill:d.color}; }))
                    .padding(5)        //space between words
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .fontSize(function(d) { return d.size; })      // font size of words
                    .on("end", draw);
        layout.start();

        myColors = ["red", "orange"];
        
        // This function takes the output of 'layout' above and draw the words
        // Wordcloud features that are THE SAME from one word to the other can be here
        function draw(words) {
        svg.append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size; })
            // .style("fill", function(d) { return d.color; })
            .style("fill", "#505050")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
        }
    };

    populateWords("Sector");

    // handle on click event

    dropDown.on("change", function() {
        var newChoice = dropDown.property("value")
        populateWords(newChoice);
    });

    var button = d3.select(".btn");

    button.on("click", function() {
        var newChoice = dropDown.property("value")
        populateWords(newChoice);
    });

});