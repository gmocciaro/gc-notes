var URLs;
var view;
var save;
var url;
var options;
var selected;
var container;

var phrases = {
    noText      : "There is no note stored for this url",
    noteSaved   : "successfully saved!"
};

var noTextBool = false;

jQuery(document).ready(function(){
    view = jQuery("#view");
    save = jQuery("#save");
    options = jQuery('#options');
    container = jQuery('#container');

    selected = "currentUrl";
    // Checking is user change url selection
    $('input[type=radio][name=selector]').change(function() {
        url = URLs[this.value];
        renderStorageValue(url);
    });

    core();

    // Handling human's interactions
    jQuery('#edit').click(function(){
        view.hide();
        save.fadeIn();

        var html = jQuery('#status').html();
        if (noTextBool) {
            html = "";
        }

        jQuery('#newvalue').val(html);
    });

    jQuery('#cancel').click(function(){
        save.hide();
        view.fadeIn();

        jQuery('#newvalue').val("");
    });

    jQuery('#optionIcon').click(function(){
        container.hide();
        options.fadeIn();
    });

    jQuery('#closeOptionIcon').click(function(){
        options.hide();
        container.fadeIn();
    });
});

function core(){
    // Taking url
    getUrl(function(currentUrl, domain){
        URLs = {
            currentUrl          : currentUrl,
            currentUrlDomain    : domain
        };

        url = currentUrl;
        jQuery('#currentUrl').html(url);

        // is the user is in the main domain, let's destroy the current url selector
        if (url == domain) {
            jQuery('#currentUrlDomainSelector').remove();
            jQuery('#currentUrlDomain').remove();
        } else {
            jQuery('#currentUrlDomain').html(domain);
        }


        // Checking if there is a record for this url
        renderStorageValue(url);

        jQuery('form').submit(function(ev){
            // Blocking form submit
            ev.preventDefault();

            var value = jQuery('#newvalue').val();
            if(value.length < 255 && typeof value == "string") {
                setStorage(url, value, function(result){
                    // Removing trash
                    jQuery('#newvalue').val("");

                    // Taking back storage
                    renderStorageValue(url);

                    notification("success", phrases.noteSaved);
                });
            }
        });
    });
}

function renderStorageValue(url){
    save.hide();
    view.fadeIn();

    getStorage(url, function(data){
        var renderText = data[md5(url)];
        noTextBool = false;

        if (typeof data[md5(url)] == "undefined" || data[md5(url)].length == 0) {
            renderText = jQuery('<p id="emptyStatus">');
            noTextBool = true;
            renderText.html(phrases.noText);
        }

        renderStatus(renderText);
    });
}