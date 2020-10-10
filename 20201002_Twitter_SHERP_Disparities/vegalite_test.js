// setup API options
const options = {
  config: [{
    // Vega-Lite default configuration
  }],
  init: (view) => {
    // initialize tooltip handler
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    // view constructor options
    // remove the loader if you don't want to default to vega-datasets!
    loader: vega.loader({
      baseURL: "https://cdn.jsdelivr.net/npm/vega-datasets@1/",
    }),
    renderer: "canvas",
  },
};

const v1 = vl.register(vega, vegaLite, options);

async function drawPlot() {

  const width = window.innerWidth * 0.7;
  const height = width;

  // Playing with the movies dataset
  const dataset = await d3.csv("https://raw.githubusercontent.com/nikomc/dataviz_blog/main/20201002_Twitter_SHERP_Disparities/SHERP_tweeter_data_clean.csv")

  console.table(dataset[0])

{
  const chart = vl.markCircle({size: 15, opacity: 0.5})
    .data(dataset)
    .encode(
      vl.x().fieldQ('following_count'),
      vl.y().fieldQ('followers_count'),
      v1.color().fieldN('gender')
    )
    .render()
    .then(viewElement => {
          document.getElementById('view').appendChild(viewElement);
        });
}

}
drawPlot();
