/*!
* GoogleURLShortener ver 0.1
* by Zzbaivong <http://devs.forumvi.com/>
*/
(function ($) {
	"use strict";
	$.GoogleURLShortener = function (options) {
		var settings = $.extend({
			key: null,
			mode: "auto",
			url: null,
			success: function (url, response) {},
			error: function (message, response) {}
		}, options);      
		var invalid = function (mess) {
			settings.error(mess, {
				"error": {
					"code": 400,
					"message": mess,
					"data": [{
						"domain": "global",
						"reason": "Invalid",
						"message": mess
					}]
				}
			});
		};      
		var url = settings.url;      
		if ("" !== url && /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/.test(url) && !/^http:\/\/goo\.gl\/?$/.test(url)) {
			window.gapi_onload = function (options) {              
				var client = gapi.client;
				client.setApiKey(settings.key);
				client.load("urlshortener", "v1", function (response) {                  
					if (typeof (response) == "object") {                      
						settings.error(response.error.message, response);                      
					} else {                      
						var mode = settings.mode,
							request,
							link;                      
						if (mode == "auto") {                          
							if (/http:\/\/goo\.gl\/.+/.test(url)) {                              
								mode = "short";                              
							} else {                              
								mode = "long";                              
							}
						}                      
						switch (mode) {
			                        	case "long":
			                                	request = client.urlshortener.url.insert({
			                                    		"resource": {
			                                        		"longUrl": url
			                                    		}
			                                	});
			                                	link = "id";
			                        		break;
			                            	case "short":
			                                	request = client.urlshortener.url.get({
			                                    		"shortUrl": url
			                                	});
			                                	link = "longUrl";
			                                	break;
						}                      
						if (request) {                          
							request.execute(function (response) {
								if (response.error) {
									settings.error(response.error.message, response);
								} else {
									if (response[link] !== null) {
										settings.success(response[link], response);
									} else {
										settings.error(response.error.message, response);
									}
								}
							});                          
						} else {                          
							invalid("Invalid Setting");                          
						}                      
					}
				});
			};
			$.getScript("https://apis.google.com/js/client.js");
		} else {          
			invalid("Invalid Value");          
		}
	};
}(jQuery));
