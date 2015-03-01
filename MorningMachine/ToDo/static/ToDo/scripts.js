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
	            updateTaskTitle(data.$el[0].title, data.content);
	        }
	    }
	});
});


$('.task').click(function(){
	$(this).parent().submit();
});

$('.addTaskButton').click(function(){
	var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
	taskListID = this.parentElement.title
	jQuery.ajax({
        type: "POST",
        async: true,
        url: '/ToDo/task/create/',
        data:  { 'title': "newTask", 'csrfmiddlewaretoken': token, 'taskList': this.parentElement.title },
        //dataType: "json",
        //contentType: "application/json; charset=utf-8",
        success: function (msg) 
                { 
                	$('#'+taskListID).append(msg)
                },
        error: function (err)
        		{ 
        			alert(err.responseText)
        		}
    });
});

/*
$('.addTaskButton').click(function(){
	var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
	$.post( "/ToDo/task/create/", { 'title': "newTask", 'csrfmiddlewaretoken': token, 'taskList': this.parentElement.title } );
});
*/

$('.trashButton').click(function(){
	var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
	taskListID = this.parentElement.title
	console.log(taskListID)
	$.post( "/ToDo/tasklist/"+taskListID+"/clearCompleted/", { 'csrfmiddlewaretoken': token, 'taskList': taskListID } );
	$("#"+taskListID+" form[data-taskstatus=1]").each(function(){
		$(this).remove();
	});
});


function saveWidgetSize(id, width, height){
	console.log(width);
	console.log(height);
	var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
	$.post( "/ToDo/tasklist/"+id+"/saveWidgetSize/", { 'w': width, 'h':height, 'csrfmiddlewaretoken': token } );
}

function saveWidgetPosition(id, top, left){
	console.log(top);
	console.log(left);
	var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
	$.post( "/ToDo/tasklist/"+id+"/saveWidgetPos/", { 't': top, 'l':left, 'csrfmiddlewaretoken': token } );
}

function updateTaskTitle(id, title){
	var token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
	$.post( "/ToDo/task/"+id+"/updateTitle/", { 'title': title, 'csrfmiddlewaretoken': token } );
}


