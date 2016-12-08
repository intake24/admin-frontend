/**
 * Created by Tim Osadchiy on 08/12/2016.
 */

"use strict";


module.exports = function (url, file, HttpRequestInterceptor, $q) {
    var deferred = $q.defer(),
        req = new XMLHttpRequest(),
        formData = new FormData();

    formData.append("file", file);
    formData.append("keywords", "");

    req.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
            deferred.notify(evt.loaded / evt.total);
        }
    });
    req.addEventListener("load", function (evt) {
        if (req.status == 200) {
            var reader = new FileReader(),
                id = JSON.parse(req.response)[0];
            reader.onload = function (e) {
                deferred.resolve({id: id, src: e.target.result});
            };
            reader.readAsDataURL(file);
        }
    });
    req.addEventListener("error", function (evt) {
        deferred.reject();
    });
    req.addEventListener("abort", function (evt) {
        deferred.reject();
    });

    req.open("POST", url);
    HttpRequestInterceptor.xmlHttpRequestConfig(req);
    req.send(formData);

    return deferred.promise;
};
