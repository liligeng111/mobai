var debug = false;

// moai function
(function()
{
	var $ = jQuery;
	var block_user = $('a');
	block_user.each(function(i, item)
	{
		if ($(item).text() != '喜欢' && $(item).text() != '转发') return;
		if ($(this).parent().get(0).tagName == 'LI') return; // the button here is somewhat different and cannot be triggered 
		var seperator = $('<span class="seperator">| </span>');
		var mobai_button = $('<a href="javascript:;">膜拜</a>');
		var mb_builder = '膜拜！';
		var insert_target = $(this);
		mobai_button.click(function(e)
		{
			if ($(item).text() == '转发')
			{
				var total = Math.floor(Math.random() * 11 + 1);
				mb_builder = '';
				for (var i = 0; i < total; i++) mb_builder += '(mb)';
			}
			if (debug) console.log($(this).parents().eq(5).prev().val(mb_builder), 'clicked');
			$(this).parent().next().find('textarea').val(mb_builder);
			$(this).parent().next().find('.input-button').trigger('click');
		});
		mobai_button.insertAfter(insert_target);
		seperator.insertAfter(insert_target);
	});
})();


//reply mobai and fanmobai function
function reply_mobai()
{
	if (debug) console.log('reply_mobai function');
	var $ = jQuery;
	var block_user = $('.replybody');
	block_user.each(function(i, item)
	{
		if ($(item).find('a').eq($(item).find('a').length - 1).text() != '回复') return; // not a reply button
		var seperator = $('<span class="seperator"> | </span>');
		var mobai_button = $('<a href="javascript:;">膜拜</a>');
		if (check_reply_contain_mobai($(this).find('.replycontent')))
		{				
				mobai_button = $('<a href="javascript:;">反膜拜</a>');			
				mb_builder = '反膜拜！';
		}
		mobai_button.click(function(e)
		{
			if (!check_reply_contain_mobai($(item).find('.replycontent')))
			{						
				var total = Math.floor(Math.random() * 11 + 1);
				mb_builder = '';
				for (var i = 0; i < total; i++) mb_builder += '(mb)';
			}
			else
			{
				var total = Math.floor(Math.random() * 11 + 1);
				mb_builder = '反膜拜';
				for (var i = 0; i < total; i++) mb_builder += '!';
			}
			if (debug) console.log('mobai/fanmobai button clicked : ' + '回复' + $(item).prev().text() +'： ' + mb_builder);
			if (debug) console.log($(item).find('a').eq(1));
			$(item).find('a').eq(1).trigger('click');
			$(this).parents().eq(5).find('textarea').val($(this).parents().eq(5).find('textarea').val() + mb_builder);
			$(this).parents().eq(5).find('.input-button').trigger('click');
		});
		mobai_button.insertAfter($(this).find('a').eq($(item).find('a').length - 1));
		seperator.insertAfter($(this).find('a').eq($(item).find('a').length - 2));
		mobai_button.fadeOut(0);
		mobai_button.fadeIn(50 * i + 250);
		seperator.fadeOut(0);
		seperator.fadeIn(50 * i + 250);
	});
	window.setTimeout(function() {reply_mobai();}, 1000);
}

function check_reply_contain_mobai(content)
{
	if ($(content).find('[alt="膜拜"]').length != 0) return true;
	var text = $(content).text();
	if (text.search('(mb)') != -1) return true;
	if (text.search('膜拜') != -1) return true;
	if (text.search('mobai') != -1) return true;
	if (text.search('mo bai') != -1) return true;
	return false;
}

window.setTimeout(function() {reply_mobai();}, 150);