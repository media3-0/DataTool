/*global FileReader */

var React       = require("react");
var OnResize    = require("react-window-mixins").OnResize;
var MD5         = require("MD5");
var classNames  = require("classnames");
var d3          = require("d3");

var CreateClass = require("./addons/create-class");
var Selection   = React.createFactory(require("./selection"));

var FileUpload = CreateClass({
  getInitialState: function() {
    return {
      fileName:    "",
      fileContent: "",
      delimiter:   "",
      uploaded:    false
    };
  },

  onChangeFile: function(event) {
    var file       = event.target.files[0];
    var fileReader = new FileReader();

    this.setState({ fileName: file.name, uploaded: false });

    fileReader.onload = function() {
      this.setState({
        uploaded:    true,
        fileContent: fileReader.result
      });
    }.bind(this);

    fileReader.readAsText(file);
  },

  onChangeDelimiter: function(delimiter) {
    this.setState({ delimiter: delimiter });
  },

  onClickSave: function() {
    var fileContent = this.state.fileContent;
    var fileId      = MD5(this.state.fileContent);
    var fileName    = this.state.fileName.replace(/\..+$/, "");

    var delimiter   = this.state.delimiter;
    var parser      = (delimiter === "<tab>") ? d3.tsv : d3.dsv(delimiter);
    var fileParsed  = parser.parse(fileContent);

    this.props.onFileDataUpdate({
      name: fileName,
      id:   fileId,
      data: fileParsed
    });
  },

  onClickCancel: function() {
    console.log("cancel");
  },

  renderUploadStep: function() {
    return React.DOM.div(
      { className: "upload-form input-group" },
      React.DOM.div(
        { className: "upload-form-filename form-control file-caption" },
        this.state.fileName
      ),
      React.DOM.div(
        { className: "input-group-btn" },
        React.DOM.span(
          {
            className: classNames(
              "btn btn-primary btn-file",
              { disabled: this.state.uploaded }
            )
          },
          React.DOM.span(null, "Wybierz plik"),
          React.DOM.input({ type: "file", onChange: this.onChangeFile })
        )
      )
    );
  },

  renderParseStep: function() {
    return React.DOM.div(
      null,
      React.DOM.div(
        { className: "delimiter-select col-md-6 col-md-offset-4" },
        Selection({
          name:           "Delimiter:",
          className:      "form-inline",
          labelClassName: "col-md-3",
          data:           [ ",", ";", ":", "|", "<tab>" ],
          onChange:       this.onChangeDelimiter
        })
      ),
      React.DOM.div(
        { className: "delimiter-select col-md-9 col-md-offset-3" },
        React.DOM.div(
          {
            className: "btn btn-default col-md-3",
            onClick:   this.onClickCancel
          },
          "Anuluj"
        ),
        React.DOM.div(
          {
            className: "btn btn-success col-md-3 col-md-offset-1",
            onClick:   this.onClickSave
          },
          "Zapisz"
        )
      )
    );
  },

  render: function() {
    return React.DOM.div(
      { className: "upload-new-file" },
      this.renderUploadStep(),
      this.state.uploaded ? this.renderParseStep() : null
    );
  }
});

var FileNew = React.createClass({
  mixins: [ OnResize ],

  onFileDataUpdate: function(data) {
    this.props.onFileDataUpdate(data);
  },

  render: function() {
    var height = this.state.window.height - 133;

    return React.DOM.div(
      { style: { height: height } },
      FileUpload({ onFileDataUpdate: this.onFileDataUpdate })
    );
  }
});

module.exports = FileNew;
