function setURIParameters(initFunc){
	if(!extractParam("platformURI", "platformURI")) {
		var platformURI = prompt('Please enter a valid platform URI', 'http://example.com/ldp/platform');
		if (platformURI != null) {
			window.platformURI = platformURI;
		}
		else {
			return;
		}
	}
	if(!extractParam("transformerBase", "transformerBase")) {
		var transformerBase = prompt('Please enter a valid transformer base URI', 'http://example.com:8301/');
		if (transformerBase != null) {
			window.transformerBase = transformerBase;
		}
		else {
			return;
		}
	}
	initFunc();
}

function extractParam(param, variableName) {
	var set = getURLParameter(param);
	if(set.length > 0) {
		window[variableName] = set[0];
		return true;
	}
	else {
		return false;
	}
}

function getURLParameter(paramName){
	var result = [];
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++){
		var parameterName = sURLVariables[i].split('=');
		if (parameterName[0] === paramName){
			result.push(decodeURIComponent(parameterName[1]));
		}
	}
	return result;
}

function exist(elementId){
	if(isEmpty(elementId)){
		return false;
	}
	var element =  document.getElementById(elementId);
	return !isEmpty(element);
}

function isTrue(text){
	if(text == 'true' || text == '1'){
		return true;
	}
	return false;
}

function isEmpty(data){
    if(typeof data === 'undefined' || data === '' || data === null || data.length == 0){
        return true;
    }
    return false;
}

function replaceForText(str) {
    str = str.replace(/\"/g, '\'');
    return str.replace(/\'/g, '\"');
}

function replaceForHTML(str) {
    return str.replace(/<.*?>/g, '');
}


function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function openDialog(id) {
    if ($('#' + id).length) {
        $('#' + id).dialog('open');
    }
    return false;
}

function closeDialog(id) {
    if ($('#' + id).length) {
        $('#' + id).dialog('close');
    }
    return false;
}

function createAlertDialog() {
    $('<div id="alertDialog" title="Error" style="padding-left: 1px; padding-right: 1px; padding-bottom: 0px;"></div>').appendTo('body')
        .html(
                    '<div class="col-sm-12">'
                        + '<div class="col-sm-2 text-left" style="padding-left: 0px; padding-right: 5px;">'
                            + '<img src="images/exclamation128.png" height="40" width="40" style="margin: 0 auto;">'
                        + '</div>'
                        + '<div class="col-sm-10 text-left" style="padding-left: 20px; padding-right: 0px;">'
                            + '<p id="alertDialogErrorText">Error...</p>'
                        + '</div>'
                    + '</div>'
                    + '<div class="col-sm-12" >'
                        + '<hr style="margin: 0 !important;">'
                    + '</div>'
                    + '<div class="col-sm-12 text-right" style="width: inherit; margin-top: 10px; margin-bottom: 10px; float: right;">'
                            + '<button id="btnCancel" type="button" class="btn btn-default" style="width: 80px" title="Bezárás" onclick="return closeDialog(\'alertDialog\');">'
                                + 'Close'
                            + '</button>'
                    + '</div>'
      ).dialog({
          modal: true, 
		  width: 300, 
		  resizable: false, 
		  autoOpen: false,
          position: { my: "center", at: "center", collision: 'fit' },
          show: {
              duration: 300
          },
          hide: {
              duration: 300
          }
      }).dialog("widget").removeClass('ui-widget');
}

function createProgressDialog() {
    $('<div id="progressDialog" title="Progress..." class="dialog"></div>').appendTo('body')
		.html(
                '<div style="display: block; text-align: center; width: 100%; padding-top: 15px;">'
                + '<img src="images/loader70.gif" style="margin: 0 auto;" />'
                + '</div>'

      ).dialog({
            modal: true,
            autoOpen: false,
			resizable: false,
            position: { my: "center", at: "center", collision: 'fit' },
            show: {
                duration: 300
            },
            hide: {
                duration: 300
            }
      }).dialog("widget").removeClass('ui-widget');
}

function createConfirmDialog(titleText, bodyText, confrimFunctionText) {
    $('<div id="confirmDialog" style="padding-left: 1px; padding-right: 1px; padding-bottom: 0px;"></div>').appendTo('body')
        .html(
                    '<div class="col-sm-12">'
                        + '<div class="col-sm-2 text-left" style="padding-left: 0px; padding-right: 5px;">'
                            + '<img src="images/questionmark128.png" height="40" width="40" style="margin: 0 auto;">'
                        + '</div>'
                        + '<div class="col-sm-10 text-left" style="padding-left: 5px; padding-right: 0px;">'
                            + '<p>'
                                + bodyText
                            + '</p>'
                        + '</div>'
                    + '</div>'
                    + '<div class="col-sm-12" >'
                        + '<hr style="margin: 0 !important;">'
                    + '</div>'
                    + '<div class="col-sm-12 text-right" style="width: inherit; margin-top: 10px; margin-bottom: 10px; float: right;">'
                        + '<table><tr><td style="padding-right: 10px;">'
                            + '<button id="btnOk" type="button" style="width: 80px;" class="btn btn-default" data-toggle="tooltip" data-placement="right" title="Yes" onclick="' + confrimFunctionText + '">'
                                + '<span class="glyphicon glyphicon-ok"></span><span class="glyphicon-button">Yes</span>'
                            + '</button>'
                        + '</td><td>'
                            + '<button id="btnCancel" type="button" class="btn btn-primary" title="Cancel" onclick="return closeDialog(\'confirmDialog\');" autofocus>'
                                + '<span class="glyphicon glyphicon-remove"></span><span class="glyphicon-button">Cancel</span>'
                            + '</button>'
                       + '</td></tr></table>'
                    + '</div>'

      ).dialog({
          modal: true, title: titleText, zIndex: 10000, autoOpen: true,
          width: 400, resizable: false,
          position: { my: "center", at: "center", collision: 'fit' },
          close: function (event, ui) {
              $(this).remove();
          },
          show: {
              duration: 300
          },
          hide: {
              duration: 300
          }
      }).dialog("widget").removeClass('ui-widget');
}