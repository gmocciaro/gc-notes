function fetchHistory(){

    getHistory(function(result){

        if ($$et.empty(result)){
            jQuery('#historyContent').html("<div id='noHistory'>" + phrases.noHistory + "</div>");
        } else {
            jQuery('#historyContent').html("");
        }

        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                if(!key.startsWith("gcn_site_")) {
                    var website = result[storagePrefix + storageSitePrefix + key.substring(4)];
                    var content = result[key];

                    // Generating title
                    var title = jQuery("<div>");
                    title.addClass('historyElementTitle');
                    title.attr("referer", key.substring(4));
                    title.addClass('dotted');
                    title.attr("title", website);
                    title.html("- " + website);

                    title.click(function(){
                        // Taking referers
                        var el = jQuery('.historyElement[referer="' + jQuery(this).attr('referer') + '"]');
                        var els = jQuery('.historyElement');
                        // Closing all others
                        els.stop();
                        els.slideUp();

                        // Opening relative box
                        el.stop();
                        el.slideToggle();
                    });

                    // generating delete button
                    var del = jQuery('<div>');
                    del.addClass("historyElementDelete");
                    del.attr("referer", key.substring(4));
                    var delim = jQuery('<img>');
                    delim.attr("src", "/images/trash.png");
                    del.html(delim);

                    del.click(function(){
                        var ref = jQuery(this).attr('referer');
                        if(confirm("Confirm delete?")){
                            deleteSingle(ref, function(){
                                fetchHistory();
                                notification("success", phrases.historyElementDeleted);
                            });
                        }
                    });

                    // Generating container
                    var element = jQuery("<div>");
                    element.addClass('historyElement');
                    element.attr("referer", key.substring(4));

                    // Generating link label
                    var linkLable = jQuery('<p>');
                    linkLable.addClass('historyElementLinkLabel');
                    linkLable.html(phrases.historyLinkLabel);

                    // Generating link
                    var link = jQuery('<a>');
                    link.addClass('historyElementLink');
                    link.addClass('bindacnhorhistory');
                    link.addClass('break');
                    link.attr("href", "http://" + website);
                    link.html(website);

                    // Generating text lable
                    var textLable = jQuery('<p>');
                    textLable.addClass('historyElementNoteLabel');
                    textLable.html(phrases.historyNoteLabel);

                    // Generating text
                    var text = jQuery('<div>');
                    text.addClass('historyElementNote');
                    text.addClass('break');
                    text.html(content);

                    // Appending link and text to container
                    element.append(linkLable).append(link).append(textLable).append(text);

                    // Appending container to main content
                    jQuery('#historyContent').append(title).append(del).append(jQuery('<div class="clear" referer="' + key.substring(4) + '">')).append(element);
                }
            }
        }

        // Binding all links
        bindLinks('bindacnhorhistory');
    });
}

function clearHistory(){
    jQuery('#historyContent').html("");
}

function getHistory(callback){
    // Taking old history
    chrome.storage.sync.get(null, function(result){
        callback(result);
    });
}

function deleteAllHistory(callback){
    chrome.storage.sync.clear(function(){
        fetchHistory();
        callback();
    });
}

function deleteSingle(referer, callback){
    // removing link
    chrome.storage.sync.remove(storagePrefix + storageSitePrefix + referer, function(){
        // removing note
        chrome.storage.sync.remove(storagePrefix + referer, function(result){
            callback(result);
        });
    });
}