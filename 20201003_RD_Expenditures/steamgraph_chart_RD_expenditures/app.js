async function drawPlot() {
  const dateParser = d3.timeParse("%Y")

  // 1. Access data
  const data = await d3.csv("https://raw.githubusercontent.com/nikomc/dataviz_blog/main/20201003_RD_Expenditures/US_expenditures_by_category_1962_2025_pivot_no_commas.csv", d3.autoType).then(
    function(data) {
      data.forEach(function(d) {
        d.date = dateParser(d.date);
      });
      return data;
    }
  );
  // console.log(data);

  const series = d3.stack()
    .keys(data.columns.slice(1))
    .offset(d3.stackOffsetWiggle)
    .order(d3.stackOrderInsideOut);

  const stackedData = series(data);
  // console.log(stackedData)

  const yAccessor = d => d.date;
  // const colorAccessor = d => d.variable

  // 2. Create chart dimensions

  let dimensions = {
    width: window.innerWidth * 0.8,
    height: 3000,
    margin: {
      top: 30,
      right: 20,
      bottom: 30,
      left: 30,
    },
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // // 3. Draw canvas

  const wrapper = d3.select("#chart")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .attr("transform", `translate(${
        dimensions.margin.left
      }, ${
        dimensions.margin.top
      })`)

  // // 4. Create scales

  const xScale = d3.scaleLinear()
    .domain([d3.min(stackedData, d => d3.min(d, d => d[0])), d3.max(stackedData, d => d3.max(d, d => d[1]))])
    .range([dimensions.boundedWidth - dimensions.margin.left, dimensions.margin.right]);

  const yScale = d3.scaleUtc()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.margin.top, dimensions.boundedHeight - dimensions.margin.bottom])
    .nice();

  const colorScale = d3.scaleOrdinal()
    .domain(data.columns.slice(1))
    .range(d3.schemeCategory10);

  const key = d => d.columns.slice(1);
  console.log(key);

  // 5. Draw data

  const area = d3.area()
    .curve(d3.curveBasis)
    .x0(d => xScale(d[0]))
    .x1(d => xScale(d[1]))
    .y(d => yScale(d.data.date));



  // 6. Draw peripherals
  const axisLeft = d3
    .axisLeft(yScale)
    .ticks(10)
    // .tickSizeOuter(1000)
    .tickSize(-dimensions.boundedWidth);

  const axisVertical = bounds
    .append("g")
    .call(axisLeft)
    .call(g => g.select(".domain").remove())
    .call(g =>
      g
        .selectAll(".tick text")
        .attr("x", -15)
        .attr("dy", -4)
        .attr("text-anchor", "start")
        .attr("font-size", "1em")
    )
    .call(g => g.selectAll(".tick line").attr("stroke", "lightgray"));

  // hide last child element; the tick for 2030 year.
  d3.select('.tick:last-child')
    .style("opacity", 0);

  bounds.append("g")
    .selectAll("path")
    .data(stackedData)
    .join("path")
      .attr("class", "myArea")
      .attr("fill", key => colorScale(key))
      .attr("d", area)
      .append("title")
      .text(function(d) {
        return d.key;
      })
      .on("mouseenter", onMouseEnter)
      // .on("mouseleave", onMouseLeave);

    // see https://www.d3-graph-gallery.com/graph/streamgraph_template.html
    // see https://observablehq.com/@d3/d3v6-migration-guide#events
    // see http://bl.ocks.org/WillTurman/4631136

    const tooltip = d3.select("#tooltip")
    function onMouseEnter(event, d) {
      console.log(event);
      const areaHighlight = d3.select(".myArea")
        .attr("class", "areaHighlight")
        .style("opacity", 1)
        .style("fill", "maroon")
        .style("pointer-events", "none");
      }

    // const formatHumidity = d3.format(".2f")
    // tooltip.select("#humidity")
    //   .text(formatHumidity(yAccessor(datum)))
    //
    // const formatDewPoint = d3.format(".2f")
    // tooltip.select("#dew-point")
    //   .text(formatDewPoint(xAccessor(datum)))
    //
    // const dateParser = d3.timeParse("%Y-%m-%d")
    // const formatDate = d3.timeFormat("%B %A %-d, %Y")
    // tooltip.select("#date")
    //   .text(formatDate(dateParser(datum.date)))
    //
    // const x = xScale(xAccessor(datum))
    // + dimensions.margin.left
    // const y = yScale(yAccessor(datum))
    // + dimensions.margin.top
    //
    // tooltip.style("transform", `translate(`
    // + `calc( -50% + ${x}px),`
    // + `calc(-100% + ${y}px)`
    // + `)`)
    //
    // tooltip.style("opacity", 1)
    // }
    //
    // function onMouseLeave(event, d) {
    // d3.selectAll(".tooltipDot")
    // .remove()
    //
    // tooltip.style("opacity", 0)
    // }

  }
drawPlot();
