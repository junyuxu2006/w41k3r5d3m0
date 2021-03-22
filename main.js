var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

(function() {
var terminal = terminal || {};
var main = main || {};

main.worldUrl = "https://www.w41k3r.ga";
main.div = $(".terminal");
terminal.namn = "Anonymous";
main.memory = [];
terminal.posts = [];
main.vars = {};
terminal.pointer = false;
terminal.welcome = "";
terminal.part = false;
terminal.cursorTimer = false;
main.loggedin = false;
terminal.currentPost = false;

//
// Core functions
main.init = function(worldUrl) {
	main.worldUrl = worldUrl;
	main.events();
	//if($(window).width() > 800) {
		$("#input").focus();
	//}
	
	terminal.scrollbottom();
	main.addPosts();
	main.render();
}

main.render = function() {
	terminal.cursor();
	terminal.setCursor("input", "cursor");
}
main.events = function() {
	$("#input-form").off().submit(function(e) {
		e.preventDefault();
		main.execute($("#input").val(), function() {
			$("#input").val("");
		});		
	});
	$("html").bind('click', main.helpclick);
	//if($(window).width() > 800) {
		$("body, html").click(function() {
			$("#input").focus();
		});

		
	//}
	$("#input").keydown(function(e) {
		$("#input_front").val($(this).val());
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 38) {
			$("#input").val(main.memory[main.memory.length - 1]);
			
		}
		if(code == 13) {
			$("#input-form").submit();
		}
		if(code == 27) {
			terminal.closePop();
		}
		$("#cursor").css("display", "none");
	});
	$("#input").keyup(function(e) {
		terminal.setCursor("input", "cursor");
		$("#cursor").css("display", "block");
		$("#input_front").val($(this).val());
	});
	$("document").keydown(function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 27) {
			terminal.closePop();
		}
	});
}
main.helpclick = function() {
	terminal.help();
	$("html").unbind('click', main.helpclick);
}
main.execute = function(string, callback) {
	$("html").unbind('click', main.helpclick);

	//Check function?
	//string = string.replace(">", "");

	main.memory.push(string);
	var stringArray = string.split('-');
	var fun = stringArray.shift().replace(/ /g, '').toLowerCase();

	if($("#input_front").attr('type') == "password") {
		terminal.write("&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;");
	} else {
		terminal.write(string);
	}

	if(terminal.pointer != "" && terminal.pointer != false && string.toLowerCase() != "exit" && string.toLowerCase() != "clear") {
		terminal[terminal.pointer](string);
	} else if(typeof terminal[fun] === "function") {
		terminal[fun](stringArray);
	} else if(string === "") {
		terminal.write("");
	} else {

		if(!isNaN(string)) {
			terminal.showPost(string);
		} else {
			terminal.write("\'"+string+"\' is not recognized as an internal or external command,");
			terminal.write("operable program or batch file. See <a href='#' onclick='terminal.help(); return false;'>HELP</a>.");
			terminal.write("");			
		}

	}
	typeof callback === 'function' && callback();
}
main.signup = function(callback) {
	$.post(main.worldUrl+"/signup", main.vars, function(json) {
		main.vars = {};
		typeof callback === 'function' && callback(json);
	});
}
main.inviteme = function(callback) {
	$.post(main.worldUrl+"/inviteme", main.vars, function(json) {
		main.vars = {};
		typeof callback === 'function' && callback(json);
	});	
}

main.login = function(email, password, callback) {
	$.post(main.worldUrl+"/login", { email: email, password: password }, function(json) {
		main.vars = {};
		typeof callback === 'function' && callback(json);
	});	
}
main.forgot = function(email, callback) {
	$.post(main.worldUrl+"/forgot", { email: email }, function(json) {
		main.vars = {};
		typeof callback === 'function' && callback(json);
	});	
}
main.logout = function(callback) {
	$.post(main.worldUrl+"/logout", { }, function(json) {
		main.vars = {};
		typeof callback === 'function' && callback();
	});
}
main.addPosts = function(callback) {
	$.get(main.worldUrl+"/posts", { }, function(json) {
		for (var i = 0; i < json.posts.length; i++) {
			if(json.posts[i].id == 125) {
				terminal.welcome = json.posts[i].content;
				json.posts.splice(i, 1);
			}
		};
		terminal.posts = json.posts;
		typeof callback === 'function' && callback();
	});		
}
main.checkCodeValidity = function(string, callback) {
	$.post("https://www.w41k3r.ga/server/invites.json", { invite: string }, function(json) {
		typeof callback === 'function' && callback(json);
	});
}
//
//	Terminal
//	Todo: Set in seperate file. Make "plugin-able".

terminal.join = function(string) {
	if(typeof terminal.part === "undefined" || terminal.part == false || terminal.part === "") {
		terminal.pointer = "join";
		terminal.part = "invite";

		terminal.write("");
		//terminal.write("At this time, you may only join by invitation.");
		terminal.write("Do you have an invite code? (y/n)");
	} else {
		switch(terminal.part) {
			case 'invite':
				if(string.charAt(0).toLowerCase() === "n") {
					terminal.write("You may request an invite. Enter your email or <a href='#' onclick='terminal.exit(); return false;'>[EXIT]</a>:");
					terminal.part = "invite_no";
				} else if(string.charAt(0).toLowerCase() === "y") {
					terminal.write("Enter the invite code:");
					terminal.part = "start";
				} else {
					terminal.write("");
					terminal.pointer = "";
					terminal.part = "";
				}
				break;
			case 'invite_no':
				main.vars.email = string;
				terminal.write(""); //loader?
				terminal.pointer = "";
				terminal.part = "";
				main.inviteme(function(json) {
					terminal.write(json.message);			
				});
				break;			
			case 'start':
				terminal.part= "";
				terminal.pointer ="";
				main.checkCodeValidity(string, function(json) {
					if(json.success) {
						main.vars.invite = string;
						terminal.write("Enter your email:");
						terminal.part = "email";
						terminal.pointer ="join";
					} else {
						terminal.pointer = "";
						terminal.part = "";
						main.vars = {};	
						terminal.write("Access denied.");
						terminal.write(json.message);
						terminal.write("You may request an invite. Enter your email or <a href='#' onclick='terminal.exit(); return false;'>[EXIT]</a>:");
						terminal.part = "invite_no";
						terminal.pointer = "join";	
					}
				});

				break;
			case 'email':
				main.vars.email = string;
				terminal.write("Choose a password:");
				terminal.part = "password";
				$("#input_front").attr("type","password");
				break;
			case 'password':
				main.vars.password = string;
				terminal.write("Repeat password:")
				terminal.part = "password2";
				break;
			case 'password2':
				main.vars.password2 = string;
				if(main.vars.password2 === main.vars.password) {
					terminal.write("Enter your age:")
					terminal.part = "age";
					$("#input_front").attr("type","text");				
				} else {
					terminal.write("Your passwords did not match, try again.");
					terminal.write("Choose a password:");
					terminal.part = "password";				
				}
				break;
			case 'age':
				main.vars.age = string;
				terminal.write("Enter country of residence:");
				terminal.part = "country";
				$("#input_front").attr("type","text");
				break;
			case 'country':
				main.vars.country = string;
				terminal.write(""); //loader?
				terminal.pointer = "";
				terminal.part = "";
				main.signup(function(json) {
					if(json.walker) {
						var walker = json.nr;
						main.addPosts(function(json) {
							//terminal.splash("<span style='font-size: 100px; color: #38e8e3;'>#"+walker+"</span>", 2500);
							/*terminal.pop("<span style='font-size: 100px; color: #38e8e3;'>#"+walker+"</span>");
							setTimeout(function() {
								terminal.closePop();
							}, 2500); */
							terminal.printLogo();
							terminal.write("Congratulations, you are now Walker #"+walker+". This is your new identity. Use it well.");
							terminal.write("You need to verify your e-mail (an email has been sent to you). More content will come soon. In the meantime, I will post new material here for you to see before anyone else. Hope you like it.");
							terminal.write("");
							terminal.write("List:");
							terminal.list();
						});
					} else {
						terminal.pointer = "";
						terminal.part = "";
						main.vars = {};
						terminal.write(json.message);
					}					
				});
				break;
			default:
				$("#input_front").attr("type","text");
				terminal.write("");
				terminal.pointer = "";
				terminal.part = "";				
		}
	}
}
terminal.exit = function() {
	terminal.pointer = "";
	terminal.part = "";
	terminal.clear();
}
terminal.showPost = function(string) {
	var post = terminal.posts[parseInt(string)];

	if(typeof post === "undefined") {
			terminal.write("\'"+string+"\' is not recognized as an internal or external command,");
			terminal.write("operable program or batch file. See <a href='#' onclick='terminal.help(); return false;'>[HELP]</a>.");
			terminal.write("");
			return;
	}

	terminal.currentPost = parseInt(post.id);
	switch(parseInt(post.type)) {
		case 1:
			terminal.write("");
			terminal.write(post.content);
			//terminal.write("<a href='#' onclick='terminal.comment(); return false;'>[comment]</a> or view <a href='#' onclick='terminal.comments(); return false;'>[comments]</a>?");
			break;
		case 2:
			terminal.pop(post.content);
			break;
		case 3:
			terminal.popLink(post.content);
			break;
		default:
			break;
	}
}
function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png|PNG|JPG)$/) != null);
}
function checkVideoURL(url) {
	console.log("video");
    return(url.match(/\.(mov|mp4|webm|ogg)$/) != null);
}
function checkYoutube(_videoUrl){
	var matches = _videoUrl.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
	if (matches) {
	    return matches[0].replace('watch?v=', '');
	} else {
		if(_videoUrl.indexOf('https://web.archive.org/web/20170311033317/https://youtu.be/') > -1) {
			return _videoUrl.replace('https://web.archive.org/web/20170311033317/https://youtu.be/', '');
		}
		return false;
	}
}
terminal.popLink = function(body, closer) {
	var string = body;
	if(checkURL(body)) {
		string = "<div class='img-pop' style='background-image: url(\""+body+"\");'><div>";
	} else if(checkVideoURL(body)) {
		string = "<div class='video-pop'><video width='100%' height='100%' controls autoplay><source src='"+body+"' type='video/mp4'>Your browser does not support the video tag.</video><div>";
	} else  {
		var isYoutube = checkYoutube(body);
		if(isYoutube !==  false) {
			string = '<iframe width="100%" height="100%" src="https://web.archive.org/web/20170311033317/https://www.youtube.com/embed/'+isYoutube+'?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1" frameborder="0" allowfullscreen=""></iframe>';
		} else {
			string = '<div class="totback"></div><span style="font-size: 1.6em;">Go to <a href="'+body+'" target="_blank">'+body+'</a></span>';
		}
	}
	$(".full-pop-content").html(string);
	$(".full-pop-content iframe").height($(window).height());
	$(".full-pop").css("display", "table");
	if(typeof closer !== "undefined") {
		$(".full-pop").children(".full-pop-close").css("display", "none");
	} else {
		$(".full-pop").children(".full-pop-close").css("display", "block");
	}
}
terminal.pop = function(body, closer) {
	$(".full-pop-content").html(body);
	$(".full-pop-content iframe").height($(window).height());
	$(".full-pop").css("display", "table");
	if(typeof closer !== "undefined") {
		$(".full-pop").children(".full-pop-close").css("display", "none");
	} else {
		$(".full-pop").children(".full-pop-close").css("display", "block");
	}
}
terminal.closePop = function() {
	$(".full-pop-content").html("...");
	
	$(".full-pop").css("display", "none");

}
terminal.write = function(string, funlink, funpar) {
	/*string = string.replace("<", "&lt;");
	string = string.replace(">", "&gt;");*/
	if(typeof funpar != 'undefined') {
		string = "<a href='#' onclick='terminal."+funlink+"("+funpar+"); return false;'>"+string+"</a>";
	} else if(typeof funlink != 'undefined') {
		string = "<a href='#' onclick='terminal."+funlink+"(); return false;'>"+string+"</a>";
	}
	main.div.append(string+"<br>");
	terminal.scrollbottom();
}
terminal.scrollbottom = function() {
	$("body, html").stop().animate({ scrollTop: $("body").height() }, "fast");
}
terminal.scrolltop = function() {
	$("body, html").stop().animate({ scrollTop: 100 }, "fast");
}
terminal.clear = function() {
	main.div.html("");
	terminal.pointer = "";
	terminal.part = "";
	main.vars = {};
	$("#input_front").attr("type","text");
	terminal.scrolltop();
}
terminal.what = function() {
	terminal.write("Alan Walker")
	terminal.write("");
}
terminal.reset = function() {
	location.reload();
}
terminal.logout = function() {
	$(".full-pop-close").css("display", "none");
	terminal.pop("<div style='width: 100%; height: 100%; position: absolute; left: 0px; top: 0px; background-size: cover; background-image: url(\"img/download.png\")'></div>");
	
	main.logout(function() {
		terminal.closePop();
		terminal.clear();
		$(".full-pop-close").css("display", "block");

		main.randomBye();
		terminal.write("");
		terminal.write("You have logged out successfully.");
		terminal.posts = [];
		main.vars = {};
	});
}
terminal.splash = function(content, time) {
	$(".full-pop-close").css("display", "none");
	terminal.pop(content);
	setTimeout(function() {
		terminal.closePop();
		$(".full-pop-close").css("display", "block");
	}, time);	
}
terminal.printLogo = function() {
	main.div.append($("#mono-logo").html()+"<br>");
	terminal.scrollbottom();
}
terminal.comments = function(string) {
	if(!terminal.currentPost) {
		terminal.write("You have to read some content to post a comment.")
		terminal.write("");
		return false;
	}
	main.getComments(terminal.currentPost, function(json) {
		if(json.length < 1) {
			terminal.write("No comments.");
			terminal.write("");
			return;
		}
		var now = Date.now();

		var when;
		for (var i = 0; i < json.length; i++) {
			terminal.write("");
			when = json[i].time*1000; 
			terminal.write("<span class='grey'>#"+json[i].usernr+" said "+timeDifference(now,when) +": </span>");
			terminal.write(json[i].title);
		};
		terminal.write("");
	});
}
/*
terminal.comment = function(string) {
	if(!terminal.currentPost) {
		terminal.write("Comments not permitted in main class.")
		terminal.write("");
		return false;
	}
	if(typeof terminal.part === "undefined" || terminal.part == false) {
		terminal.pointer = "comment";
		terminal.part = "write";
		terminal.write("");
		terminal.write("Enter comment or <a href='#' onclick='terminal.exit(); return false;'>[EXIT]</a>:");
	} else {
		terminal.pointer = "";
		terminal.part = "";
		main.postComment(string, function(json) {
			terminal.write(json.message);
			terminal.write("");
		});
	}
} */
terminal.login = function(string) {

	if(typeof terminal.part === "undefined" || terminal.part == false) {
		
		main.login("", "", function(json) {
			if(json.user) {
				var walker = json.nr;
				main.addPosts(function(json) {
					//terminal.splash("<span style='font-size: 100px; color: #38e8e3;'>#"+walker+"</span>", 2000);
					terminal.write("");
					terminal.printLogo();
					terminal.write("Welcome Walker #"+walker+".");
					terminal.write(terminal.welcome);
					terminal.write("");
					terminal.write("List:");
					terminal.list();
				});
			} else {
				terminal.pointer = "login";
				terminal.part = "email";
				terminal.write("");
				terminal.write("E-mail:");
			}
		});
	} else {
		switch(terminal.part) {
			case 'email':
				main.vars.email = string;
				terminal.write("Password:");
				terminal.part = "password";
				$("#input_front").attr("type","password");
				break;
			case 'password':
				main.vars.password = string;
				$("#input_front").attr("type","text");
				terminal.write("");
				main.login(main.vars.email, main.vars.password, function(json) {
					if(json.user) {
						var walker = json.nr;
						main.addPosts(function(json) {
							//terminal.splash("<span style='font-size: 100px; color: #38e8e3;'>#"+walker+"</span>", 2000);
							terminal.write("");
							terminal.printLogo();
							terminal.write("Welcome Walker #"+walker+".");
							terminal.write(terminal.welcome);
							terminal.write("");
							terminal.write("List:");
							terminal.list();
						});
					} else {
						
						if(json.banned) {
							terminal.write(json.message);
							terminal.write("Want to appeal? <a href='mailto:system@w41k3r.com'>[EMAIL]</a>");
						} else {
							terminal.write(json.message);
							terminal.write("Did you forget your password? <a href='#' onclick='terminal.forgot(); return false;'>[FORGOT]</a>");							
						}

					}
					main.vars = {};
				});
				main.vars = {};
				terminal.pointer = "";
				terminal.part = "";					
				break;
			default:
				terminal.pointer = "";
				terminal.part = "";	
				break;
		}
	}
}
terminal.forgot = function(email) {
	main.vars = {};	
	if(typeof terminal.part === "undefined" || terminal.part == false) {
		terminal.write("Enter your email:");
		terminal.pointer = "forgot";
		terminal.part = "email";
	} else {
		terminal.pointer = "";
		terminal.part = "";
		
		terminal.write("");
		main.forgot(email, function(json) {
			
			terminal.write(json.message);
			terminal.write("");
		});
	}
}
terminal.archive = function(email) {
	terminal.write("");
	terminal.write("Archived commands");
	for (var i = 0; i < terminal.posts.length; i++) {
		if(terminal.posts[i].state == 1) {
			terminal.write("["+i+"] "+terminal.posts[i].title, 'showPost', i);
		}
		
	};	

}
terminal.hey = function() {

}
terminal.forum = function() {
	terminal.write("");
	terminal.write("Opening FORUM 1.1.2");
	terminal.write("");
	terminal.pop("<iframe id='forum-iframe' height='100%' width='100%' onmouseenter='disable_scroll' onmouseleave='enable_scroll' src='https://web.archive.org/web/20170311033317/http://w41k3r.com/forum' style='overflow-y: hidden; border: 0px;'></iframe>", true);
}
terminal.help = function() {
	terminal.write("");
	terminal.write("Available commands:");
	terminal.list();
	terminal.write("");
}
terminal.list = function() {
	for (var i = 0; i < terminal.posts.length; i++) {
		if(terminal.posts[i].state != 1) {
			terminal.write("["+i+"] "+terminal.posts[i].title, 'showPost', i);
		}
		
	};
	
	if(terminal.posts.length === 0) {
		terminal.write("[JOIN]", 'join');
		terminal.write("[LOGIN]", 'login');
	} else {
		terminal.write("[FORUM]", 'forum');
		terminal.write("[ARCHIVE]", 'archive');
		terminal.write("[LOGOUT]", 'logout');
	}
	terminal.write("[CLEAR]", 'clear');
	terminal.write("[HELP]", 'help');
}

terminal.cursor = function() {
	$("#cursor").css("opacity", 1);
	window.setTimeout(function() {
		$("#cursor").css("opacity", 0);
		window.setTimeout(terminal.cursor, 400);
	}, 900)
}
terminal.setCursor = function(inputid, cursorid) {
	var element = document.getElementById(inputid);
	var offset = $("#"+inputid).position();
	var coordinates = getCaretCoordinates(element, element.selectionEnd);
	var top = coordinates.top+offset.top;
	var left = coordinates.left+offset.left;
	$("#"+cursorid).css({top: top, left: left});
}


main.randomBye = function() {
	terminal.write(outWisdom[Math.floor(Math.random()*outWisdom.length)]);
}
//logout quotes
var outWisdom = [];
outWisdom.push("I may not have gone where I intended to go, but I think I have ended up where I needed to be.");
//outWisdom.push("You and I will meet again, When we're least expecting it, One day in some far off place, I will recognize your face, I won't say goodbye my friend, For you and I will meet again.")
outWisdom.push("This conversation can serve no purpose anymore. Goodbye.");
outWisdom.push("Time moves in one direction, memory in another.");
outWisdom.push("Quite an experience to live in fear, isn't it? That's what it is to be a slave.");
outWisdom.push("Remember: Fear is the mind killer.");


window.main = main;
window.terminal = terminal;

})();


function timeDifference(current, previous) {
    
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    
    var elapsed = current - previous;
    
    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }
    
    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }
    
    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
         return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
    }
    
    else if (elapsed < msPerYear) {
         return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
    }
    
    else {
         return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}


}
