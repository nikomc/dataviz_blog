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
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "data": {
      "url": "https://raw.githubusercontent.com/nikomc/dataviz_blog/main/20201002_Twitter_SHERP_Disparities/SHERP_tweeter_data_clean.csv"
    },
    "layer": [
      {
        "mark": {
          "type": "circle",
          "filled": true
        },
        "encoding": {
          "x": {
            "field": "following_count",
            "type": "quantitative"
          },
          "y": {
            "field": "followers_count",
            "type": "quantitative"
          }
        }
      },
      {
        "mark": {
          "type": "line",
          "color": "firebrick"
        },
        "transform": [
          {
            "regression": "following_count",
            "on": "followers_count"
          }
        ],
        "encoding": {
          "x": {
            "field": "following_count",
            "type": "quantitative"
          },
          "y": {
            "field": "followers_count",
            "type": "quantitative"
          }
        }
      },
      {
        "transform": [
          {
            "regression": "following_count",
            "on": "followers_count",
            "params": true
          },
          {"calculate": "'R²: '+format(datum.rSquared, '.2f')", "as": "R2"}
        ],
        "mark": {
          "type": "text",
          "color": "firebrick",
          "x": "width",
          "align": "right",
          "y": -5
        },
        "encoding": {
          "text": {"type": "nominal", "field": "R2"}
        }
      }
    ]
  }

}
drawPlot();
