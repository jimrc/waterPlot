const data = [
  { date: new Date("2024-07-30T00:00:00"), height: 0.23 },
  { date: new Date("2024-09-03T17:00:00"), height: 0.4 },
  { date: new Date("2025-08-03T15:05:00"), height: 0.18 }
  // ... more data points
];
const margin = { top: 25, right: 30, bottom: 30, left: 50 };
const width = 400 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Step 2: Create the SVG element and append it to the container
const svg = d3.select("#graph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x = d3.scaleTime()
  .domain(d3.extent(data, (d) => d.date)) // Get the min and max dates from the data
  .range([0, width]);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, (d) => d.height)]) // Get the max height from the data
  .range([height, 0]);

// Step 4: Create the x and y axes
//onst xAxis = d3.axisBottom(x).ticks(d3.timeDates.every(30));
const yAxis = d3.axisLeft(y);
const domain = [new Date("2024-07-01"), new Date("2025-09-01")];
console.log(domain);
// Create an x-axis group
const xAxis = d3.select("svg")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("class", "axis")
  .call(d3.axisBottom(d3.scaleTime()
    .domain(domain)
    .ticks(d3.timeWeek.every(1)) // Display ticks for every year
    .tickSizeInner(-height)
    .tickSizeOuter(0)
    .tickPadding(10)
  ));

// Draw the axis line
xAxis.selectAll("path")
  .attr("stroke", "black")
  .attr("stroke-width", "1px");

// Draw the domain line
xAxis.selectAll(".domain")
  .attr("stroke", "red")
  .attr("stroke-width", "2px");
// Draw the ticks
xAxis.selectAll("g")
  .attr("transform", "translate(0," + height + ")")
  .selectAll("line")
  .attr("stroke", "black")
  .attr("stroke-width", "0.5px")
  .attr("x1", 0)
  .attr("x2", width);

// Step 5: Append the axes to the SVG

svg.append("g")
  .call(yAxis);
// Step 6: Create the line generator
const lineGenerator = d3.line()
  .x((d) => x(d.date))
  .y((d) => y(d.height));

// Step 7: Append the line path to the SVG
const linePath = svg.append("path")
  .datum(data) // Binds the data to the line generator
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)
  .attr("d", lineGenerator);

// Step 8: Optionally, add labels and a title
const xAxisLabel = svg.append("text")
  .attr("transform", "translate(" + (width / 2) + ", " + 
        (height + margin.top ) + ")")
  .style("text-anchor", "middle")
  .text("Date");

const yAxisLabel = svg.append("text")
  .attr("transform", "translate(-30, " + (height / 2) + ")rotate(-90)")
  .style("text-anchor", "middle")
  .text("Height (ft)");

const title = svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Height vs. Time");
