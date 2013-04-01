/*
 * jQuery File Upload Plugin JS Example 6.5.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global $, window, document */

GAL = {
	setup : function() {
		$('<div id="gallery-pictures"></div>').appendTo($('body'));
		$('a.gallery-name').click(GAL.getGallery);
		GAL.fileUpload();
		GAL.doFancybox();
	},

	getGallery : function() {
		$('a.gallery-name').removeClass('active');
		$(this).addClass('active');
		$.ajax({
			type : 'GET',
			url : $(this).attr('href'),
			timeout : 5000,
			success : GAL.showGallery,
			error : function() {
				alert('Error!');
			}
		});
		return (false);
	},

	showGallery : function(data) {
		$('#gallery-pictures').html(data);
		GAL.fileUpload();
		GAL.doFancybox();
		return (false);
	},
	
	doFancybox : function () {
		$('a.fancybox-image').fancybox({
			'transitionIn' : 'elastic',
			'transitionOut' : 'elastic',
			'speedIn' : 600,
			'speedOut' : 200,
			'overlayShow' : false
		});
	},

	fileUpload : function() {
		$('#fileupload').fileupload({
			autoUpload : true,
			uploadTemplate : function(o) {
				var rows = $();
				$.each(o.files, function(index, file) {
					console.log(file);
					var row = $('<li class="span3">' + '<div class="thumbnail">' +
						'<div class="preview" style="text-align: center;"></div>' +
						'<div class="progress progress-success progress-striped active">' +
						'<div class="bar" style="width:0%;"></div>' + '</div>' + '</div>');
					rows = rows.add(row);
				});
				return rows;
			},

			completed : function(e, data) {
				console.log(data.result[0].url);
				$('a[href^="' + data.result[0].url + '"]').fancybox();
			},
			downloadTemplate : function(o) {
				var rows = $();
				$.each(o.files, function(index, file) {
					var row = $('<li class="span3" id="picture_' + file.picture_id + '">' +
						(file.error ? '<div class="name"></div>' + '<div class="size"></div><div class="error" ></div>' : '<div class="thumbnail">' +
						'<a href="' + file.url + '" class="fancybox-image" rel="group" title="<%= pic.description %>">' + '<img src="" alt="">')
						+ '</a>' + '<div class="caption">' + '<p style="text-align: center;">' +
						'<a href="" class="btn btn-mini btn-show" style="margin-right: 4px;">' + '<i class="icon-edit "></i>' +
						'Edit' + '</a>' + '<a class="btn btn-mini btn-delete" confirm="Вы уверены?" data-remote=true data-method="delete" href="" >'
						+ '<i class="icon-trash"></i>' + 'Delete' + '</a>' + '</p>' + '</div>' + '</div>');

					if (file.error) {
						row.find('.name').text(file.name);
						row.find('.error').text(locale.fileupload.errors[file.error] || file.error);
					} else {
						if (file.thumbnail_url) {
							row.find('img').prop('src', file.thumbnail_url);
						}
						row.find('.btn-delete').attr('href', '/galleries/' + $("#galleryID").val() + '/pictures/' + file.picture_id);
						row.find('.btn-show').attr('href', '/galleries/' + $("#galleryID").val() + '/pictures/' + file.picture_id + '/edit');
					}
					rows = rows.add(row);
				});
				return rows;
			}
		});
	}
};

$(function() {

	GAL.setup();

});
