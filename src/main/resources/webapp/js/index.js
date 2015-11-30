var transformerBase;
var sparqlEndpoint;
var transformerRegistry;

$(document).ready(function () {
	
    setURIParameters(fillInputs);

    var resultDiv = $("#resultDiv");
    resultDiv.hide();
	
	function getCustomName(){
		var customName = $.trim($("#title").val());
		return !isEmpty(customName) ? customName : "Literal Extraction Transformer";	
	}
	
    function transformerUri() {
		var transformer = encodeURIComponent($('#transformer').find(":selected").text());
		var processedLanguages = $.trim($("#lang").val());
		var literalProperties = $("#lit-pred").val();
		var entityProperty = $("#entity-pred").val();
		var topicProperty = $("#topic-pred").val();
		var entityPredicates = {
			person: $("#pers-ne-pred").val(),
			organization: $("#org-ne-pred").val(),
			location: $("#loc-ne-pred").val(),
			other: $("#misc-ne-pred").val(),
			unknown: $("#unk-ne-pred").val()
		};
		var keywordProperty = $("#keyword-pred").val();
		var sentimentProperty = $("#sentiment-pred").val();
		
		// contains the query string params
		var queryParams = [];
		
		// add transformer
		if(!isEmpty(transformer)){
			queryParams.push('transformer=' + encodeURIComponent(transformer));
		}
		else{
			createAlertDialog('Please select a transformer first!');
			return;
		}
		
		// add processed languages
		if(!isEmpty(processedLanguages)){
			var langs = processedLanguages.split(',');
			for(var i = 0; i < langs.length; i++){
				queryParams.push('lang=' + encodeURIComponent(langs[i]));
			}
		}
		
		// add literal properties
		if(!isEmpty(literalProperties)){
			var litPreds = literalProperties.split('\n');
			for(var i = 0; i < litPreds.length; i++){
				var uri = $.trim(litPreds[i]);
				if(!isEmpty(uri)) {
					if(validateURL(uri)){
						queryParams.push('lit-pred=' + encodeURIComponent(uri));
					}
					else{
						createAlertDialog('The following literal property: ' + uri);
						return;
					}
				}
			}
		}
		
		// add entity property
		if(!isEmpty(entityProperty)){
			queryParams.push('entity-pred=' + encodeURIComponent(entityProperty));
		}
		
		// add topic property
		if(!isEmpty(topicProperty)){
			queryParams.push('topic-pred=' + encodeURIComponent(topicProperty));
		}
		
		// entity predicates
		if(!isEmpty(entityPredicates.person)){
			queryParams.push('pers-ne-pred=' + encodeURIComponent(entityPredicates.person));
		}
		if(!isEmpty(entityPredicates.organization)){
			queryParams.push('org-ne-pred=' + encodeURIComponent(entityPredicates.organization));
		}
		if(!isEmpty(entityPredicates.location)){
			queryParams.push('loc-ne-pred=' + encodeURIComponent(entityPredicates.location));
		}
		if(!isEmpty(entityPredicates.other)){
			queryParams.push('misc-ne-pred=' + encodeURIComponent(entityPredicates.other));
		}
		if(!isEmpty(entityPredicates.unknown)){
			queryParams.push('unk-ne-pred=' + encodeURIComponent(entityPredicates.unknown));
		}
		
		// add keyword property
		if(!isEmpty(keywordProperty)){
			queryParams.push('keyword-pred=' + encodeURIComponent(keywordProperty));
		}
		
		// add sentiment property
		if(!isEmpty(sentimentProperty)){
			queryParams.push('sentiment-pred=' + encodeURIComponent(sentimentProperty));
		}
		
        return transformerBase + "?" + queryParams.join("&");
    }
	
    $('#generate').on("click", function() {
		var uri = transformerUri();
		console.log(uri);
		if(!isEmpty(uri)){
			$('#resultValue').val(uri);
			resultDiv.show();
		}   
        return false;
    });
    
    $('#register').on("click", function() {
        var postBody = "@prefix dct: <http://purl.org/dc/terms/>."+
            "@prefix trldpc: <http://vocab.fusepool.info/trldpc#> ."+
            "<> a trldpc:TransformerRegistration;"+
            "    trldpc:transformer <" + transformerUri() + ">;"+
            "    dct:title '" + getCustomName() + "'@en;"+
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
			transformerRegistry = p.getTransformerRegistryURI();
			sparqlEndpoint = p.getSparqlEndpoint();
			getTransformers();
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

function getTransformers(){
	var query = 'PREFIX dc: <http://purl.org/dc/terms/> '
            + 'PREFIX trldpc: <http://vocab.fusepool.info/trldpc#> '
            + 'PREFIX ldp: <http://www.w3.org/ns/ldp#> '
            + 'SELECT * WHERE { '
            + ' <' + transformerRegistry + '> ldp:contains ?child . '
            + ' ?child dc:title ?title . '
            + ' ?child trldpc:transformer ?uri . '
            + '     OPTIONAL { '
            + '         ?child dc:description ?description . '
            + '         ?child dc:created ?date . '
            + '     }'
            + '}';

    $.ajax({
        type: 'POST',
        url: sparqlEndpoint,
        headers: {
            'Accept': 'application/sparql-results+json',
            'Content-Type': 'application/sparql-query;charset=UTF-8'
        },
        data: query
    }).done(function (data) {
		console.log(data);
        var transformers = data.results.bindings;
        $("#transformer").html('');
        if (transformers.length > 0) {
			$("#transformer").append($('<option>').text('Select transformer').val(''));
            jQuery.each(transformers.reverse(), function (i, transformer) {      
                var uri = isEmpty(transformer.list) ? transformer.uri.value : transformer.uri.value + '?config=' + transformer.child.value;
                $("#transformer").append($('<option>').text(transformer.title.value).val(uri).prop('title', transformer.description.value))
            });
        }
        else {
            $("#transformer").html('<option value="">No transformer available...</option>');
        }
    }).fail(function (xhr, textStatus, errorThrown) {
        createAlertDialog(textStatus);
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