var React         = require("react");
var CreateClass   = require("./addons/create-class");
var Visualization = require("./visualization");

var VisualizationWrapper = CreateClass({
  render: function() {
    return React.DOM.div(
      { className: "visualization-wrapper" }
    );
  }
});

var VisualizationGenerator = React.createClass({
  getInitialState: function() {
    return {
      selectedFileIndex:      null,
      selectedGeoColumnIndex: null,
      selectedGeoTypeIndex:   null,
      selectedVisColumnIndex: null
    };
  },

  componentDidMount: function() {
    this.props.emitter.on("visualization:data", function(data) {
      console.log("emitter visualization:data", data);
      this.setState(data);
    }.bind(this));
  },

  render: function() {
    // var visualizationData = {
    // };

    return React.DOM.div(
      { className: "visualization-generator" },
      "VIZ"
    );
  }
});

module.exports = VisualizationGenerator;
