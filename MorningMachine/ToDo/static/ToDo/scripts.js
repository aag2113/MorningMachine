$(document).ready(function(){
    $('#mainBodyContainer .widgetContainer').draggable({
			containment : "#mainBodyContainer",
            handle: "h3",
            stop: function( event, ui ) {saveWidgetPosition(this.title, ui.position.top, ui.position.left ); }
		});

	$('#mainBodyContainer .widget').resizable({
		    minHeight: 150,
		    minWidth: 200,
		    stop: function( event, ui ) {saveWidgetSize(this.title, ui.size.width, ui.size.height); }
		});

	$('.taskTitle').editable({
	    touch : true,
	    lineBreaks : true, 
	    toggleFontSize : false,
	    closeOnEnter : true, 
	    event : 'click',
	    tinyMCE : false, 
	    emptyMessage : '<em>Cant do nothing homie.</em>', 
	    callback : function( data ) {
	        if( data.content ) {
	            updateTaskTitle(data.$el[0].parentElement.dataset.taskid, data.content);
	        }
	    }
	});

	$(".TaskList").on("click", ".tasks .task input", function(){
		var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
		taskID = this.parentElement.dataset.taskid
		console.log("clicked")
		console.log(taskID)
		jQuery.ajax({
	        type: "POST",
	        async: true,
	        url: '/ToDo/task/'+taskID+'/check/',
	        data:  { 'csrfmiddlewaretoken': token },
	    });
	});

	$('.addTaskButton').click(function(){
		var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
		taskListID = this.parentElement.dataset.tasklistid
		console.log(taskListID)
		jQuery.ajax({
	        type: "POST",
	        async: true,
	        url: '/ToDo/task/create/',
	        data:  { 'title': "newTask", 'csrfmiddlewaretoken': token, 'taskList': this.parentElement.dataset.tasklistid },

	        success: function (msg) 
	                { 
	                	console.log(msg)
	                	console.log(msg.msg)
	                	console.log(msg.taskid)
	                	$('.tasks[data-tasklistid='+taskListID+']').append(msg.msg)
	                	$('.task[data-taskid='+msg.taskid+'] .TaskTitle').editable({
						    touch : true,
						    lineBreaks : true, 
						    toggleFontSize : false,
						    closeOnEnter : true, 
						    event : 'click',
						    tinyMCE : false, 
						    emptyMessage : '<em>Cant do nothing homie.</em>', 
						    callback : function( data ) {
						        if( data.content ) {
						            updateTaskTitle(data.$el[0].parentElement.dataset.taskid, data.content);
						        }
						    }
						});
	                },
	        error: function (err)
	        		{ 
	        			alert(err.responseText)
	        		}
	    });
	});

	$('.trashButton').click(function(){
		var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
		taskListID = this.parentElement.dataset.tasklistid
		console.log(taskListID)
		jQuery.ajax({
	        type: "POST",
	        async: true,
	        url: "/ToDo/tasklist/"+taskListID+"/clearCompleted/",
	        data:  { 'csrfmiddlewaretoken': token, 'taskList': taskListID },

	        success: function(msg)
				{
					$('.tasks[data-tasklistid="' + taskListID + '"]').replaceWith(msg)
					$('.taskTitle').editable({
						    touch : true,
						    lineBreaks : true, 
						    toggleFontSize : false,
						    closeOnEnter : true, 
						    event : 'click',
						    tinyMCE : false, 
						    emptyMessage : '<em>Cant do nothing homie.</em>', 
						    callback : function( data ) {
						        if( data.content ) {
						            updateTaskTitle(data.$el[0].parentElement.dataset.taskid, data.content);
						        }
						    }
						});
				},
			error: function(err)
				{
					alert(err.responseText)
				}
	    });
	});

	function saveWidgetSize(id, width, height){
		console.log(width);
		console.log(height);
		var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
		jQuery.ajax({
	        type: "POST",
	        async: true,
	        url: "/ToDo/tasklist/"+id+"/saveWidgetSize/",
	        data:  { 'w': width, 'h':height, 'csrfmiddlewaretoken': token },
	    });
	}

	function saveWidgetPosition(id, top, left){
		console.log(top);
		console.log(left);
		var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
		jQuery.ajax({
	        type: "POST",
	        async: true,
	        url: "/ToDo/tasklist/"+id+"/saveWidgetPos/",
	        data:  { 't': top, 'l':left, 'csrfmiddlewaretoken': token },
	    });
	}

	function updateTaskTitle(id, title){
		var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
		jQuery.ajax({
	        type: "POST",
	        async: true,
	        url: "/ToDo/task/"+id+"/updateTitle/",
	        data:  { 'title': title, 'csrfmiddlewaretoken': token },
	    });
	}
});





