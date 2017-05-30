jQuery(document).ready(function(){
    bindLinks('bindanchor');
});

function bindLinks(htmlclass){
    jQuery('a.' + htmlclass).each(function(ind, el){
        var jel = jQuery(el);
        // Removing all previous binding
        jel.unbind();

        jel.click(function(){
            chrome.tabs.create({ url: jQuery(this).attr('href') });
        });

    });
}