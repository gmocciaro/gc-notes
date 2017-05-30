var URLs;
var view;
var save;
var url;
var options;
var selected;
var container;
var history;

var phrases = {
    noText                  : "There is no note stored for this url",
    noteSaved               : "successfully saved!",
    historyLinkLabel        : 'URL:',
    historyNoteLabel        : 'Note:',
    historyElementDeleted   : 'Element deleted!',
    noHistory               : 'You don\'t have any record in history',
    historyWiped            : 'History wiped!'
};

var storagePrefix = "gcn_";
var storageSitePrefix = "site_";

var noTextBool = false;

function getUrl(callback){
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        // chrome.tabs.query invokes the callback with a list of tabs that match the
        // query. When the popup is opened, there is certainly a window and at least
        // one tab, so we can safely assume that |tabs| is a non-empty array.
        // A window can only have one active tab at a time, so the array consists of
        // exactly one tab.
        var tab = tabs[0];

        // A tab is a plain object that provides information about the tab.
        // See https://developer.chrome.com/extensions/tabs#type-Tab
        var url = tab.url;

        // tab.url is only available if the "activeTab" permission is declared.
        // If you want to see the URL of other tabs (e.g. after removing active:true
        // from |queryInfo|), then the "tabs" permission is required to see their
        // "url" properties.
        console.assert(typeof url == 'string', 'tab.url should be a string');

        // removing http and www
        if (url.indexOf("://") > -1) {
            // url.split(':')[0] -> taking protocol (http, https, ftp and so on)
            // than removing protocol and :// form url
            url = url.replace(url.split(':')[0] + "://", "");

            // Removing www
            url = url.replace("www.", "");

            // Removing final /
            if (url[url.length - 1] == "/") {
                url = url.slice(0, -1);
            }
        }

        var hostname = url;

        if (hostname.indexOf("://") > -1) {
            hostname = hostname.split('/')[2];
        }
        else {
            hostname = hostname.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];

        callback(url, hostname);
    });
}

function renderStatus(statusText) {
    jQuery('#status').html(statusText);
}

function getStorage(url, callback){
    chrome.storage.sync.get(storagePrefix + md5(url), function(result){
        callback(result);
    });
}

function setStorage(url, value, callback){
    var obj = {};
    obj[storagePrefix + md5(url)] = value;
    obj[storagePrefix + storageSitePrefix + md5(url)] = url;

    chrome.storage.sync.set(obj, function(result){
        // Saving the record in the history
        callback(result);
    });
}

function notification(type, text){
    var handler = jQuery('#notificationBox');
    handler.html(text);
    handler.addClass("notification_" + type);

    handler.stop();
    handler.fadeIn("Slow", function(){
        setTimeout(function(){
            handler.fadeOut("Slow", function(){
                handler.html("");
            });
        }, 2000);
    });
}