var transformerBase;

$(document).ready(function () {
	
    setURIParameters(fillInputs);
	
    var resultDiv = $("#resultDiv");
    resultDiv.hide();
	
    function transformerUri() {
    	//TODO gabor
        //return transformerBase+"?taxonomy="+encodeURIComponent($.trim($("#taxonomy").val()));
    }
	
    $('#generate').on("click", function() {
        $('#resultValue').val(transformerUri());
        resultDiv.show();
        return false;
    });
    
    $('#register').on("click", function() {
        var postBody = "@prefix dct: <http://purl.org/dc/terms/>."+
            "@prefix trldpc: <http://vocab.fusepool.info/trldpc#> ."+
            "<> a trldpc:TransformerRegistration;"+
            "    trldpc:transformer <"+transformerUri()+">;"+
            "    dct:title 'Literal Extraction Transformer'@en;"+
            "    dct:description 'Literal Extraction Transformer using "+$.trim($("#transformer").val())+"'.";
        //hideMessages();
        startLoading();
        var container = $.trim($("#transformerRegistry").val());
        var tentativeName = "literal-extraction-transformer";
        var headerCollection = { "Slug" : tentativeName };
        function registerSuccess(response, textStatus, request) {
            // Getting the name of the created resource & letting the user know about the successful creation
            var actualContainer = request.getResponseHeader('Location');
            if(actualContainer !== null) {
                showMessage("add-success", "Content is successfully saved here: <b>" + actualContainer + "</b>");
            }
            else {
                showMessage("add-success", "Content is successfully saved.");
            }
            stopLoading();
        }

        function registerFail(response, textStatus, statusLabel) {
            showErrorMessage("add-alert", response, statusLabel);
            stopLoading();
        }
        saveContent(container, postBody, headerCollection, "text/turtle", registerSuccess, registerFail);
        return false;
    });
    $("#resultValue").prop("readonly", true);
    
    url = location.protocol + '//' + location.hostname + ':' + location.port + '/';
});

function fillInputs() {	
		P3Platform.getPlatform(platformURI).then(function(p) {
			$("#transformerBase").val(transformerBase);
			$("#transformerRegistry").val(p.getTransformerRegistryURI());
		});
}

function saveContent(container, data, headers, contentType, saveSuccess, saveFail) {
	
	var ajaxRequest = $.ajax({	type: "POST",
								url: container,
								data: data,
								headers: headers,
								contentType: contentType,
								processData: false
							});	
	
	ajaxRequest.done(function(response, textStatus, request){
		saveSuccess(response, textStatus, request);
	});
	ajaxRequest.fail(function(response, textStatus, statusLabel){
		saveFail(response, textStatus, statusLabel);
	});
}


/* General stuff */

function showMessage(elementId, message) {
    var element = $('#'+elementId);
	element.html('').html("<a href='#' class='close' id='"+elementId+"-close'>×</a>"+message).show();
    var elementClose = $('#'+elementId+"-close");
    elementClose.click(function() {
        element.hide();
    });
}

function showErrorMessage(elementId, response, statusLabel, fallbackMessage) {

    if (typeof(fallbackMessage) == "undefined"){
        fallbackMessage = "Something went wrong...";
    }

	if(typeof response.responseText !== 'undefined' && response.responseText.length > 0 ) {
		showMessage(elementId, response.responseText);
	}
	else if(typeof statusLabel !== 'undefined' && statusLabel.length > 0) {
		showMessage(elementId, statusLabel);
	}
	else {
		showMessage(elementId, fallbackMessage);
	}
}

function hideMessage(elementId) {
	$('#'+elementId).html('').hide();
}

function startLoading() {
	$('html,body').css('cursor','wait');
}

function stopLoading() {
	$('html,body').css('cursor','auto');
}