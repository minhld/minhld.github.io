/**
 * javascript functions for observer system
 */
var LIGHT_IMAGE = 'light.png';
var MOTION_IMAGE = 'person.png';

var TYPE_LIGHTON = 'LightOn';
var TYPE_MOVING = 'Moving';

var $eventContainer = $('#event_container');

var item = '<li class="clearfix">' + 
		   '	<div class="wi">' +
		   '		<img src="assets/custom/%IMAGE%" alt="">' +
		   '	</div>' +
		   '	<div class="wb">' +
		   '		<a onclick="openInNewTab(\'%IMAGE_LINK%\');" style="cursor: pointer;">%INFO%</a>' +
		   '		<span class="post-date">%TIME%</span>' +
		   '	</div>' +
		   '</li>';

var loadItem = '<li class="clearfix">' + 
			   '	<div class="wi">' +
			   '		<img src="assets/custom/loading.gif" alt="">' +
			   '	</div>' +
			   '</li>';

$(document).ready(function() {
	setInterval(function(){ updateEvents() }, 5000);
});

function updateEvents() {
	// add the loading item
	$eventContainer.empty();
	$eventContainer.append(loadItem);
	
	$.ajax({
		url: 'receiveEvents',
		type: 'post',
		dataType: 'json',
		data: {
			'top': 10
		},
		success: function(data, status, xhr) {
			var itemX;
			$eventContainer.empty();
			$.each(data, function(idx, val) {
				if (val.type == TYPE_LIGHTON) {
					itemX = item.replace('%IMAGE%', LIGHT_IMAGE).
								replace('%TIME%', new Date(val.time).toLocaleString()).
								replace('%INFO%', 'Light Is On');
				} else if (val.type == TYPE_MOVING) {
					var link = getFileName(val.info);
					itemX = item.replace('%IMAGE%', MOTION_IMAGE).
								replace('%TIME%', new Date(val.time).toLocaleString()).
								replace('%INFO%', 'Detected Motions').
								replace('%IMAGE_LINK%', link);
				}
				$eventContainer.append(itemX);
			});
		},
		error: function(xhr, status, error) {
			$eventContainer.empty();
			// add an error message here
		}
	});
}

function getFileName(info) {
	var jsonInfo = JSON.parse(info);
	var fileIdx = jsonInfo.file.lastIndexOf('/') + 1;
	return '/imgs/' + jsonInfo.file.substring(fileIdx);
}

function openInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
}
