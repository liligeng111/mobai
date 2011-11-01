var debug = true; // debug mode

function check_mobai_in_feed()
{	
	var $ = jQuery;
	var feeds = $('.feed-content');
	if (debug) console.log('inside feed function');
	feeds.each(function(i, item)
	{
		var replyer = $(this).find('h4').children().eq(0).attr('href');  //id of replyer
		replyer = replyer.slice(replyer.search('id=') + 3, replyer.search('id=') + 12);
		var url = $(this).find('h4').children().eq(1).attr('href');
		
		if (url.search('doingId') == -1) return; //not reply
		var obj_map = {}; 
		String(url).split('?')[1].split('&').map(function(a) { var ary = a.split('=');  obj_map[ary[0]] = ary[1]; });
		url = 'http://www.renren.com/home#//status/status?id=' + obj_map.id +  '&doingId=' + obj_map.doingId + '&repliedId=' + obj_map.repliedid; // actual url
		
		if (debug) console.log('try to get feed ' + i + ' from: ' + url);
		
		$.get(url, function(data)  // the page when you click the link
		{
			if (debug) console.log('reply page is get');
			var token = data.slice(data.search('get_check:') + 9, data.search('get_check:') + 20);
			var rtk = data.slice(data.search('get_check_x:') + 13, data.search('get_check_x:') + 21);
			$.post("http://www.renren.com/feedcommentretrieve.do",  // the actual comments
				{
				doingId:obj_map.doingId,
				source:obj_map.doingId,
				owner:obj_map.id,
				t:3,
				requestToken:token,
				_rtk:rtk
				}, function(data)
					{
						var obj = JSON.parse(data); 
						if (debug) console.log('search from ' + obj.replyList.length + ' elements:');
						if (debug) console.log(obj);
						for (var j = obj.replyList.length - 1; j > -1; j--)
						{
							console.log('compare ' + obj.replyList[j].ubid + ' with ' + replyer);
							if(obj.replyList[j].ubid == replyer)
							{
								if (obj.replyList[j].src_content.search('(mb)') == -1 && obj.replyList[j].src_content.search('膜拜') == -1 && obj.replyList[j].src_content.search('mobai') == -1 && obj.replyList[j].src_content.search('mo bai') == -1)
								{
									if (debug) console.log('no (mb) found');
									return;
								}
								
								if (debug) console.log('bingo');
								if (debug) console.log($(item).find('h4'));
								var children = $(item).find('h4').children();
								$(item).find('h4').fadeOut('slow', function() {
								var new_h4 = $('<h4><a target="_blank" href="' + children.eq(0).attr('href') + '">' + children.eq(0).text() + '</a> 在状态 <a target="_blank" source="' + obj_map.doingId + '" href="' + children.eq(1).attr('href') +'">' + children.eq(1).text() + '</a>中膜拜了你</h4>');
								new_h4.replaceAll($(item).find('h4'));
								new_h4.fadeOut(0);
								new_h4.fadeIn('slow');
								});
								return;
							}
						}
					}
			);
		}).error(function() {console.log('error loadind feed ' + i)});
		if (debug) console.log('end of feed ' + i);
	});
	if (debug) console.log('end of feed function');
}

var document_ready = false;
var check_feed_count = 0;

$(document).ready(function() {document_ready = true;});

function check_feed_is_ready()
{
	var feeds = $('.feed-content');
	if (feeds.length == 0)
	{
		if (debug) console.log('feed is not ready');
		if(document_ready)
		{			
			if (debug) console.log('document is ready, no feed!');
			return;
		}
		window.setTimeout(function() {check_feed_is_ready();}, check_feed_count > 50 ? 500 : 100);
		check_feed_count++;
		return;
	}
	if (debug) console.log('feed is ready, begin to load feeds');
	check_mobai_in_feed();
}

window.setTimeout(function() {check_feed_is_ready();}, 150);
