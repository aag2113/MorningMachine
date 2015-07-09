var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;

var taskTitleEditableOpts = {
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
}

var taskListSortableOpts = {
	connectWith: '.tasks',
	handle: '.dragHandle',
	helper: 'clone',
	appendTo: '#swaplist',

	update: function(event, ui){
		var data = $(this).sortable('toArray', {attribute:"data-taskid"});
		tasklistid = this.dataset.tasklistid;

		jQuery.ajax({
			data: { 'data': data, 'csrfmiddlewaretoken': token },
			type: 'POST',
			url: "/ToDo/tasklist/"+tasklistid+"/updateOrder/"
		});
	}
}

function checkTask(){
	taskID = this.parentElement.dataset.taskid
	console.log("clicked")
	console.log(taskID)
	jQuery.ajax({
        type: "POST",
        async: true,
        url: '/ToDo/task/'+taskID+'/check/',
        data:  { 'csrfmiddlewaretoken': token },
    });
}

function addTaskList(){
		jQuery.ajax({
			type: "POST",
			async: true,
			url: '/ToDo/tasklist/create/',
			data: {'title':'Tasks', 'csrfmiddlewaretoken': token},

			success: function(msg){
				$(msg.msg).appendTo('#mainBodyContainer')
				$('.widgetContainer[data-tasklistid='+msg.tasklistid+']').draggable({
					containment : "#mainBodyContainer",
		            handle: "h3",
		            stop: function( event, ui ) {saveWidgetPosition(this.title, ui.position.top, ui.position.left ); }
				});
				$('.widget[data-tasklistid='+msg.tasklistid+']').resizable({
				    minHeight: 150,
				    minWidth: 200,
				    stop: function( event, ui ) {saveWidgetSize(this.title, ui.size.width, ui.size.height); }
				});
				$('.tasks').sortable(taskListSortableOpts).disableSelection();
				$('.widget[data-tasklistid='+msg.tasklistid+'] .closeWidgetButton').click(closeWidget)
				$('.addTaskButton').click(addTask);
			},
			error: function(err){
				alert(err.responseText)
			}
		});
}

function addTask(){
		taskListID = this.parentElement.dataset.tasklistid;
		console.log(taskListID);
		jQuery.ajax({
	        type: "POST",
	        async: true,
	        url: '/ToDo/task/create/',
	        data:  { 'title': "newTask", 'csrfmiddlewaretoken': token, 'taskList': this.parentElement.dataset.tasklistid },

	        success: function (msg) { 
	                	console.log(msg);
	                	console.log(msg.msg);
	                	console.log(msg.taskid);
	                	$('.tasks[data-tasklistid='+taskListID+']').append(msg.msg);
	                	$('.tasks').sortable('refresh');
	                	$('.task[data-taskid='+msg.taskid+'] .TaskTitle').editable(taskTitleEditableOpts);
	                	$('.task[data-taskid='+msg.taskid+'] input').click(checkTask);
	                	$('.task[data-taskid='+msg.taskid+'] .TaskTitle').trigger('click');
	                },
	        error: function (err)
	        		{ 
	        			alert(err.responseText);
	        		}
	    });
}

function saveWidgetPosition(id, top, left){
	jQuery.ajax({
        type: "POST",
        async: true,
        url: "/ToDo/tasklist/"+id+"/saveWidgetPos/",
        data:  { 't': top, 'l':left, 'csrfmiddlewaretoken': token },
    });
}

function updateTaskTitle(id, title){
	jQuery.ajax({
        type: "POST",
        async: true,
        url: "/ToDo/task/"+id+"/updateTitle/",
        data:  { 'title': title, 'csrfmiddlewaretoken': token },
    });
}

function updateTaskListTitle(id, title){
	jQuery.ajax({
        type: "POST",
        async: true,
        url: "/ToDo/taskList/"+id+"/updateTitle/",
        data:  { 'title': title, 'csrfmiddlewaretoken': token },
    });
}

function saveWidgetSize(id, width, height){
	jQuery.ajax({
        type: "POST",
        async: true,
        url: "/ToDo/tasklist/"+id+"/saveWidgetSize/",
        data:  { 'w': width, 'h':height, 'csrfmiddlewaretoken': token },
    });
}

function closeWidget(){
	taskListID = this.dataset.tasklistid
	jQuery.ajax({
		type: "POST",
		async: true,
		url: "/ToDo/tasklist/"+taskListID+"/remove/",
		data: { 'csrfmiddlewaretoken': token, 'taskList': taskListID},

		success: function(msg)
		{
			$('.widgetContainer[data-tasklistid="'+taskListID+'"]').remove()
		},
		error: function(err)
		{
			alert(err.responseText)
		}
	});
}

function clearCompleted(){
	taskListID = this.parentElement.dataset.tasklistid
	jQuery.ajax({
        type: "POST",
        async: true,
        url: "/ToDo/tasklist/"+taskListID+"/clearCompleted/",
        data:  { 'csrfmiddlewaretoken': token, 'taskList': taskListID },

        success: function(msg)
			{
				$('.tasks[data-tasklistid="' + taskListID + '"]').replaceWith(msg)
				$('.taskTitle').editable(taskTitleEditableOpts);
				$('.tasks').sortable({
					axis: 'y',
					update: function(event, ui){
						
						var data = $(this).sortable('toArray', {attribute:"data-taskid"});
						tasklistid = this.dataset.tasklistid;

						jQuery.ajax({
							data: { 'data': data, 'csrfmiddlewaretoken': token },
							type: 'POST',
							url: "/ToDo/tasklist/"+tasklistid+"/updateOrder/"
						});
					}
				}).disableSelection();
			},
		error: function(err)
			{
				alert(err.responseText)
			}
    });
}

$(document).ready(function(){

	$(".task input").click(checkTask);

	$(".addTaskListButton").click(addTaskList);

	$('.addTaskButton').click(addTask);

	$('.closeWidgetButton').click(closeWidget);

	$('.trashButton').click(clearCompleted);

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

	$('.taskTitle').editable(taskTitleEditableOpts);

	$('.tasks').sortable(taskListSortableOpts).disableSelection();

	$('.taskListTitle').editable({
	    touch : true,
	    lineBreaks : true, 
	    toggleFontSize : false,
	    closeOnEnter : true, 
	    event : 'click',
	    tinyMCE : false, 
	    emptyMessage : '<em>Gotta have a title player.</em>', 
	    callback : function( data ) {
	        if( data.content ) {
	            updateTaskListTitle(data.$el[0].dataset.tasklistid, data.content);
	        }
	    }
	});
});