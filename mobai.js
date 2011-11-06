var debug_mobai = false;
var check_interval = 50;
var queue_length = 0;
var clicked_comment = "";  // store the comment clicked by user
var rewrite = 0;  // because sometimes the loading of a page can be very slow, once write, set it to 100, nothing new, deduct by 1;
var num_comment = 0; //store the number of comments found



rewrite_comment();
// rewrite the show all reply button
function rewrite_comment()
{
	if (debug_mobai) console.log('in rewrite function');
	var $ = jQuery;
	var block_user = $('.showmorereply');
	if (debug_mobai) console.log('rewrite_comment function');
	block_user.each(function(i, item)
	{
		if (debug_mobai) console.log('item found:', item);
		$(item).find('a').click(function(e)
		{
			clicked_comment = $(item).parent().attr("id");
			$(item).parent().next().fadeOut(0);
			check_interval = 0;
		});
	});

	if (block_user.length != num_comment)
	{
		rewrite = 100;		
		num_comment = block_user.length;
	}
	else
	{	
		rewrite--;
	}
	if (rewrite != 90) window.setTimeout(function() {rewrite_comment();}, 500);
}

$(document).ready(function() {rewrite = 91;});

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
			if (debug_mobai) console.log($(this).parents().eq(5).prev().val(mb_builder), 'clicked');
			$(this).parent().next().find('textarea').val(mb_builder);
			$(this).parent().next().find('.input-button').trigger('click');
		});
		mobai_button.insertAfter(insert_target);
		seperator.insertAfter(insert_target);
	});
})();




if (debug_mobai) console.log('begin search in ' + check_interval + 'ms');	
window.setTimeout(function() {reply_mobai();}, check_interval);

//reply mobai and fanmobai function
function reply_mobai()
{
	if (debug_mobai) console.log('reply_mobai function');
	var $ = jQuery;
	var block_user = $('.replybody');
	var found = false;	// a comment is found, some change is made

	block_user.each(function(i, item)
	{		
		if ($(item).find('a').eq($(item).find('a').length - 1).text() == '回复') // a reply button
		{
			$(this).parent().fadeOut(0);	
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
				if (debug_mobai) console.log('mobai/fanmobai button clicked : ' + '回复' + $(item).prev().text() +'： ' + mb_builder);
				if (debug_mobai) console.log($(item).find('a').eq(1));
					$(item).find('a').eq(1).trigger('click');
				$(this).parents().eq(5).find('textarea').val($(this).parents().eq(5).find('textarea').val() + mb_builder);
				$(this).parents().eq(5).find('.input-button').trigger('click');
			});
			mobai_button.insertAfter($(this).find('a').eq($(item).find('a').length - 1));
			seperator.insertAfter($(this).find('a').eq($(item).find('a').length - 2));
		
		$(this).parent().delay(200*queue_length).fadeIn(200);	
		queue_length ++;

		found = true;
		}
		else if ($(item).parent().parent().attr('id') == clicked_comment)
		{
			$(this).parent().fadeOut(0);	
			$(this).parent().delay(200 * queue_length).fadeIn(200);	
			queue_length ++;
		}
		//mobai_button.fadeOut(0);
		//mobai_button.fadeIn(600);
		//seperator.fadeOut(0);
		//seperator.fadeIn(600);		
	});

	if (found = true)
	{
		if (clicked_comment != "") $('[id=' + clicked_comment + ']').next().delay(25 * queue_length).fadeIn(600);
	 	clicked_comment = ""
	};
	
	queue_length = 0
	if (check_interval < 1000) check_interval += 25;
	if (debug_mobai) 
	{
		console.log('queue length: ' + queue_length);	
		console.log('clicked_comment: ' + clicked_comment);	
		console.log('rewrite: ' + rewrite);
		console.log('no change made, retry in ' + check_interval + 'ms');	
	}
	window.setTimeout(function() {reply_mobai();}, check_interval);
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
