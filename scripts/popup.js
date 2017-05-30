jQuery(document).ready(function(){
    view = jQuery("#view");
    save = jQuery("#save");
    options = jQuery('#options');
    container = jQuery('#container');
    myHistory = jQuery('#history');

    selected = "currentUrl";
    // Checking is user change url selection
    $('input[type=radio][name=selector]').change(function() {
        url = URLs[this.value];
        renderStorageValue(url);
    });

    core();

    //getHistory(function(data){
    //    console.log(data);
    //});

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

        renderStorageValue(url);
    });

    jQuery('#openHistory').click(function(){
        options.hide();
        myHistory.fadeIn();

        fetchHistory();
    });

    jQuery('#closeHistoryIcon').click(function(){
        myHistory.hide();
        options.fadeIn();

        clearHistory();
    });

    jQuery('#deleteAllHistory').click(function(){
        if(confirm("Are you sure you want to delete all history?")){
            deleteAllHistory(function(){
                notification("success", phrases.historyWiped);
            });
        }
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
        var renderText = data[storagePrefix + md5(url)];
        noTextBool = false;

        if (typeof renderText == "undefined" || renderText.length == 0) {
            renderText = jQuery('<p id="emptyStatus">');
            noTextBool = true;
            renderText.html(phrases.noText);
        }

        renderStatus(renderText);
    });
}