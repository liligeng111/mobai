//var src = document.createElement('script');
//document.getElementsByTagName('head')[0].appendChild(src);
//src.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js';
//$.noConflict();
//
//
//(function()
//{
//	var $ = jQuery;
//	var block_user = $('.feed-block-user');
//	var mb_builder = '(mb)(mb)(mb)(mb)(mb)';
//	block_user.each(function(i, item)
//	{
//		var mobai_button = $('<li><a href="javascript:;">膜拜' + $(item).text().slice(2) +'</a></li>');
//		mobai_button.click(function(e)
//		{
//			console.log($(this).parents().eq(5).prev().val(mb_builder), 'clicked');
//			$(this).parents().eq(5).prev().find('textarea').val(mb_builder);
//			$(this).parents().eq(5).prev().find('.input-button').trigger('click');
//		});
//	mobai_button.insertAfter($(this).parent());
//	});
//})();



$(document).ready(function()
{	
	var $ = jQuery;
	var feeds = $('.feed-content');
	var debug = true;
	feeds.each(function(i, item)
	{
		var replyer = $(this).find('h4').children().eq(0).attr('href');  //id of replyer
		replyer = replyer.slice(replyer.search('id=') + 3, replyer.search('id=') + 12);
		var url = $(this).find('h4').children().eq(1).attr('href');
		
		if (url.search('doingId') == -1) return; //not reply
		var obj_map = {}; 
		String(url).split('?')[1].split('&').map(function(a) { var ary = a.split('=');  obj_map[ary[0]] = ary[1]; });
		
		$.get(url, function(data)  // the page when you click the link
		{
			if (debug) console.log('function');
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
								$('<h4><a target="_blank" href="' + children.eq(0).attr('href') + '">' + children.eq(0).text() + '</a> 在状态 <a target="_blank" source="' + obj_map.doingId + '" href="' + children.eq(1).attr('href') +'">' + children.eq(1).text() + '</a>中膜拜了你</h4>').replaceAll($(item).find('h4'));
								//children.each(function(i, citem){if (debug) console.log(citem);$(item).find('h4').append(citem);});
								return;
							}
						}
					}
			);
		});
	});
});


(function()
{
	var $ = jQuery;
	var block_user = $('a');
	block_user.each(function(i, item)
	{
		var seperator = $('<span class="seperator">| </span>');
		var mobai_button = $('<a href="javascript:;">膜拜</a>');
		var mb_builder = '膜拜！';

		if ($(item).text() != '喜欢' && $(item).text() != '转发') return;
		mobai_button.click(function(e)
		{
			if ($(item).text() == '转发')
			{
				var total = Math.floor(Math.random() * 11);
				mb_builder = '';
				for (var i = 0; i < total; i++) mb_builder += '(mb)';
			}
			console.log($(this).parents().eq(5).prev().val(mb_builder), 'clicked');
			$(this).parent().next().find('textarea').val(mb_builder);
			$(this).parent().next().find('.input-button').trigger('click');
		});
	mobai_button.insertAfter($(this));
	seperator.insertAfter($(this));
	});
})();