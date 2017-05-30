/**
 * Property of Fabio Croce
 *
 * I hope you found this library useful
 *
 * Note: I do not accept donations, but who in the right mind would say "no" if you'd like to offer a beer?!
 */

var EVOLVED_TOOLS = new function() {
    var self = this;


    self.die = function(data) {
        console.log(data);
        throw new Error("Don't fear the Reaper");
    };

    self.isset = function(variable) {
        return (typeof variable != 'undefined');
    };

    self.empty = function(variable) {
        if (!self.isset(variable) || variable === null) return true;

        var isEmptyObject = function(obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        };

        // Check Strings, Arrays, Objects
        if (self.is_function(variable.hasOwnProperty) && variable.hasOwnProperty('length') && variable.length === 0) return true;

        // Check Numbers
        if (variable === 0) return true;

        // Check Objects
        if (self.is_object(variable) && isEmptyObject(variable)) return true;

        // Check Booleans
        if (self.is_bool(variable) && variable === false) return true;

        // Not empty
        return false;
    };

    self.is_bool = function(variable) {
        return (Object.prototype.toString.call(variable) == '[object Boolean]');
    };

    self.is_numeric = function(variable) {
        return (Object.prototype.toString.call(variable) == '[object Number]');
    };

    self.is_string = function(variable) {
        return (Object.prototype.toString.call(variable) == '[object String]');
    };

    self.is_array = function(variable) {
        return (Object.prototype.toString.call(variable) == '[object Array]');
    };

    self.is_object = function(variable) {
        return (Object.prototype.toString.call(variable) == '[object Object]');
    };

    self.is_file = function(variable) {
        return (Object.prototype.toString.call(variable) == '[object File]');
    };

    self.is_blob = function(variable) {
        return (Object.prototype.toString.call(variable) == '[object Blob]');
    };

    self.is_function = function(variable) {
        return (typeof variable == 'function');
    };

    self.is_FileReader = function(variable) {
        return (Object.prototype.toString.call(variable) == '[object FileReader]');
    };

    self.is_email = function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    self.getType = function(variable) {
        return Object.prototype.toString.call(variable);
    };

    self.getBool = function(flag) {
        if (!self.isset(flag) || flag === null) return false;
        if (typeof flag == "boolean") return flag;
        if (parseInt(flag) == 1) return true;
        return !!(typeof flag == "string" && flag.toLowerCase() == "true");
    };

    self.getInt = function(number) {
        if (!self.isset(number) || number === null) return 0;

        if (self.is_bool(number)) {
            number = number === true ? 1 : 0;
        }

        return parseInt(number);
    };

    self.getFloat = function(number) {
        if (!self.isset(number) || number === null) return 0;

        if (self.is_bool(number)) {
            number = number === true ? 1 : 0;
        }

        return parseFloat(number);
    };

    self.cloneObject = function(source) {
        return JSON.parse(JSON.stringify(source));
    };

    self.mergeObjects = function(mainObject, poolObject) {
        if ( !self.is_object(mainObject) || !self.is_object(poolObject) ) {
            return null;
        }

        for (var key in poolObject) {
            mainObject[key] = poolObject[key];
        }

        return mainObject;
    };

    self.getObjectLength = function(source) {
        if (!self.is_object(source)) {
            return 0;
        }

        return Object.keys(source).length;
    };


    /** Strings tools **/
    self.strings = {

        is_url: function(url) {
            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

            return pattern.test(url);
        },

        clearUrlSlashes: function(url) {
            return url.replace(/([^:]\/)\/+/g, "$1");
        },

        httpBuildQuery: function(parameters) {
            if (!self.isset(parameters) || !self.is_object(parameters)) {
                return '';
            }

            var qs = "";

            for(var key in parameters) {
                if (!parameters.hasOwnProperty(key)) {
                    break;
                }

                var value = parameters[key];
                qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
            }

            // Remove last "&"
            if (qs.length > 0){
                qs = qs.substring(0, qs.length - 1);
            }
            return qs;
        },

        parseURL: function(url) {
            var parser = document.createElement('a');
            parser.href = url;

            var search = new Array();
            var tmp = (parser.search.replace('?', '')).split('&');

            for(var i = 0; i < tmp.length; i++) {
                var pair = tmp[i].split('=');

                if (!self.empty(pair[0]) && !self.empty(pair[1])) {
                    search.push({key: pair[0], value: pair[1]});
                }
            }

            return {
                protocol        : parser.protocol.replace(':', ''),
                host            : parser.host,
                hostname        : parser.hostname,
                port            : parser.port,
                pathname        : parser.pathname,
                hash            : parser.hash,
                search          : search
            };
        },

        stringStartsWith: function(string, prefix) {
            return string.slice(0, prefix.length) == prefix;
        },

        randomString: function (length) {
            length = self.getInt(length);

            var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var result = '';

            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];

            return result;
        },

        randomHexColor: function () {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },

        secondsToHHMMSS: function (total_seconds) {
            if (!self.isset(total_seconds) || !self.is_numeric(total_seconds) || total_seconds < 0) {
                return '';
            }

            var sec_num = parseInt(total_seconds, 10);
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0" + hours;}
            if (minutes < 10) {minutes = "0" + minutes;}
            if (seconds < 10) {seconds = "0" + seconds;}

            return hours + ':' + minutes + ':' + seconds;
        },

        secondsToHHMMSSmmmm: function (total_milliseconds) {
            var secondsConverted = self.strings.secondsToHHMMSS(total_milliseconds);

            if (secondsConverted != '') {
                var ms = Math.floor((total_milliseconds - Math.floor(total_milliseconds)) * 10000) + '';

                if (ms <= 9999) {
                    ms = ("000" + ms).slice(-4);
                }

                secondsConverted += ':' + ms;
            }

            return secondsConverted;
        },

        /**
         * @return {number}
         */
        HHMMSSmmmmToSeconds: function(time) {
            var total = 0;

            if (!self.isset(time)) {
                return total;
            }

            var parsed = time.split(/[:]+/);

            if (parsed.length < 3) {
                return total;
            }

            total = $$et.getInt(parsed[0]) * 3600 + $$et.getInt(parsed[1]) * 60 + $$et.getInt(parsed[2]);

            if (parsed.length == 4) {
                total += $$et.getInt(parsed[3]) / 10000;
            }

            return total;
        },

        genUUID: function() {
            var _p8 = function(s) {
                var p = (Math.random().toString(16)+"000000000").substr(2,8);
                return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
            };

            return _p8() + _p8(true) + _p8(true) + _p8();
        }
    };

    /** Files tools **/
    self.files = {
        isBase64Data: function(dataURI) {
            if (!self.is_string(dataURI)) {
                return false;
            }

            var data = dataURI.split(',');

            // Remove binary from memory
            delete data[1];

            return self.isset(data[0]) && (/^data:(.*)\/(.*);base64/g).test(data[0]);
        },

        explodeBase64Data: function(dataURI) {
            var exploded = {
                type    : '',
                binary  : ''
            };

            var maxDataURISubstring = 100;

            if (!self.is_string(dataURI) || !self.files.isBase64Data(dataURI.substring(0, maxDataURISubstring))) {
                return exploded;
            }

            var data = dataURI.substring(0, maxDataURISubstring).split(',');

            if (data.length !== 2) {
                return exploded;
            }

            // Remove binary from memory
            delete data[1];

            var matches = (/^data:(.*)\/(.*);base64/g).exec(data[0]);

            if (self.empty(matches) || !self.is_array(matches) || matches.length < 3) {
                return exploded;
            }

            var type = matches[1] + '/' + matches[2];

            exploded.type = type;
            exploded.binary = dataURI.replace("data:" + type + ";base64,", "");

            return exploded;
        },

        base64DataToBlob: function(dataURI) {
            var dataExploded = self.files.explodeBase64Data(dataURI);

            if (self.empty(dataExploded.type) || self.empty(dataExploded.binary)) {
                return null;
            }

            // Convert base64 to raw binary data held in a string
            var byteString = atob(dataExploded.binary);

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);

            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {type: dataExploded.type});
        },

        binaryToBase64Data: function(binary, callback) {
            if ((!self.is_function(FileReader) && !self.is_object(FileReader) && !self.is_FileReaderConstructor(FileReader)) || !self.is_function(callback) || (!self.is_file(binary) && !self.is_blob(binary))) {
                return null;
            }

            var reader = new FileReader();

            reader.onload = (function(theFile) {
                callback(theFile.target.result);
            });

            reader.readAsDataURL(binary);
        }
    };

    /** Images tools **/
    self.images = {
        resize: function(image, sizes, callback) {
            // Check image
            if ( (!self.is_file(image) && !self.is_blob(image)) || !self.isset(image.type) || !(/image\/(jpg|jpeg|png|gif)/).test(image.type) ) {
                return -1;
            }

            // Check sizes
            if (!self.is_array(sizes)) {
                return -2;
            }

            // Check callback
            if (!self.is_function(callback)) {
                return -3;
            }

            // Get image original info
            self.files.binaryToBase64Data(image, function(base64Data) {
                // Create image object
                var origImg = new Image();

                origImg.src = base64Data;

                // Create canvas for the original image
                var canvas = document.createElement('canvas');

                // Get context
                var ctx = canvas.getContext('2d');

                canvas.width = origImg.width;
                canvas.height = origImg.height;
                ctx.drawImage(origImg, 0, 0, origImg.width, origImg.height);

                /** Start resizing **/

                var worksDone = {};

                for(var i = 0; i < sizes.length; i++) {
                    if ( sizes[i].length < 2 || !self.is_numeric(sizes[i][0]) || !self.is_numeric(sizes[i][1]) ) {
                        continue;
                    }

                    var method = 'stretch';

                    // Available resize methods
                    if (sizes[i].length === 3) {
                        switch(sizes[i][2]) {
                            case 'stretch':
                            case 'crop':
                            case 'centerCrop':
                                method = sizes[i][2];
                                break;
                        }
                    }

                    // Resize
                    canvas.width = sizes[i][0];
                    canvas.height = sizes[i][1];

                    switch(method) {
                        case 'stretch':

                            ctx.drawImage(origImg, 0, 0, origImg.width, origImg.height, 0, 0, sizes[i][0], sizes[i][1]);

                            break;

                        case 'crop':

                            ctx.drawImage(origImg, 0, 0, origImg.width, origImg.height);

                            break;

                        case 'centerCrop':

                            var x = (origImg.width - sizes[i][0]) / 2;
                            var y = (origImg.height - sizes[i][1]) / 2;

                            ctx.drawImage(origImg, -x, -y, origImg.width, origImg.height);

                            break;
                    }

                    // Save result
                    var key = sizes[i][0] + 'x' + sizes[i][1];

                    worksDone[key] = canvas.toDataURL("image/png");
                }

                // Callback when all images are created
                callback(worksDone);
            });

            // All checks are good
            return 1;
        },

        getImageInfoFromBase64: function(imageData) {
            var imgInfo = {
                width   : 0,
                height  : 0,
                name    : '',
                type    : '',
                size    : 0,
                binary  : null
            };

            if (!self.files.isBase64Data(imageData)) {
                return imgInfo;
            }

            var img = new Image();

            img.src = imageData;

            var blob = self.files.base64DataToBlob(imageData);

            var name = self.strings.genUUID();

            switch(blob.type) {
                case 'image/png':
                    name += '.png';
                    break;
                case 'image/jpg':
                case 'image/jpeg':
                    name += '.jpg';
                    break;
                case 'image/gif':
                    name += '.gif';
                    break;
            }

            imgInfo.width   = img.width;
            imgInfo.height  = img.height;
            imgInfo.name    = name;
            imgInfo.type    = blob.type;
            imgInfo.size    = blob.size;
            imgInfo.binary  = blob;

            return imgInfo;
        },

        getBase64FromImage: function(image) {
            var canvas = document.createElement("canvas");

            canvas.width = image.width;
            canvas.height = image.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);

            return canvas.toDataURL("image/png");
        }
    };

    /** Videos tools **/
    self.videos = {
        getThumbnail: function(video_source, callback, options) {
            if (!self.is_string(video_source) || !self.is_function(callback)) {
                return false;
            }

            var el_video = document.createElement('video');
            el_video.src = video_source;
            el_video.crossOrigin = "Anonymous";

            /** Append and hide video to body **/
            el_video.style.position = 'absolute'; el_video.style.left = '-9999px';
            document.body.appendChild(el_video);

            /** Settings **/
            var settings = {
                position : 'begin'
            };

            if (!self.empty(options) && self.is_object(options)) {
                // Video position
                if (self.isset(options.position)) {
                    switch (options.position) {
                        case 'begin':
                        case 'center':
                        case 'end':
                        case self.is_numeric(options.position):
                            settings.position = options.position;
                            break;
                    }
                }
            }

            /** Video is ready **/
            var video_can_play = false;

            el_video.oncanplay = function() {
                // Execute once only
                if (video_can_play) return;

                video_can_play = true;

                // Frame position
                switch (settings.position) {
                    case 'begin':
                        el_video.currentTime = 0;
                        break;
                    case 'center':
                        el_video.currentTime = el_video.duration / 2;
                        break;
                    case 'end':
                        el_video.currentTime = el_video.duration - 0.001;
                        break;
                    default:
                        el_video.currentTime = settings.position;
                        break;
                }

                /** Move to desired frame **/
                el_video.play(); el_video.pause();

                /** Video is seeked **/
                el_video.onseeked = function() {
                    // Create canvas
                    var canvas = document.createElement('canvas');

                    // Get context
                    var ctx = canvas.getContext('2d');

                    canvas.width = el_video.videoWidth;
                    canvas.height = el_video.videoHeight;

                    // Draw selected frame on canvas
                    ctx.drawImage(el_video, 0, 0, el_video.videoWidth, el_video.videoHeight);

                    /// Delete video element
                    document.body.removeChild(el_video);

                    /** Return base64 image data **/
                    callback(canvas.toDataURL("image/jpeg"));
                };
            };

            return true;
        }
    };

    /** Operative System information **/
    self.osInfo = {
        'Android': function() {
            return navigator.userAgent.match(/Android/i) !== null;
        },

        'BlackBerry': function() {
            return navigator.userAgent.match(/BlackBerry/i) !== null;
        },
        'iOS': function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null;
        },

        'Opera': function() {
            return navigator.userAgent.match(/Opera Mini/i) !== null;
        },

        'Windows': function() {
            return navigator.userAgent.match(/IEMobile/i) !== null;
        },

        'Macintosh': function() {
            return navigator.userAgent.match(/Macintosh/i) !== null;
        },

        'Linux': function() {
            return navigator.userAgent.match(/Linux/i) !== null;
        }
    };

    /** Browser information **/
    self.browserInfo = {
        'Chrome': function() {
            return navigator.userAgent.match(/Chrome|Chromium/i) !== null;
        },

        'Safari': function() {
            return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
        },

        'IE': function() {
            return navigator.userAgent.match(/Explorer/i) !== null;
        },

        'Edge': function() {
            return navigator.userAgent.match(/Edge/i) !== null;
        },

        'Firefox': function() {
            return navigator.userAgent.match(/Firefox/i) !== null;
        },

        'Opera': function() {
            return navigator.userAgent.match(/Opera/i) !== null;
        }
    };

} ();

if (!EVOLVED_TOOLS.isset($$et)) var $$et = EVOLVED_TOOLS;