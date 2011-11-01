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