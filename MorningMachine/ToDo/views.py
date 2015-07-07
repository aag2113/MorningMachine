from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.core.urlresolvers import reverse
from django.views import generic
from django.utils import timezone
from django.views.decorators.csrf import csrf_protect
import json
import datetime

from ToDo.models import TaskList, Task

class IndexView(generic.ListView):
    template_name = 'ToDo/index.html'
    context_object_name = 'tasklists'

    def get_queryset(self):
        return TaskList.objects.all()

class taskView(generic.DetailView):
	model = Task
	template_name = 'ToDo/task.html'

class taskListView(generic.DetailView):
	model = TaskList
	template_name = 'ToDo/tasklist.html'

def check(request, task_id):
	p = get_object_or_404(Task, pk=task_id)
	print p.title
	print p.status == 0
	print p.status == 1
	try:
		if p.status == 0:
			p.status = 1
			p.completed_date = datetime.datetime.now()
			print p.completed_date
		else:
			p.status = 0
			p.completed_date = datetime.datetime.min
			print p.completed_date
		p.save()
		return HttpResponse("success")
	except (KeyError, Task.DoesNotExist):
		return render(request, 'ToDo/task.html', {'task': p, 'error_message': "No Such task"})

def updateTitle(request, task_id):
	p = get_object_or_404(Task, pk=task_id)
	p.title = request.POST.get('title')
	p.save()
	return HttpResponseRedirect(reverse('ToDo:index'))

def TLupdateTitle(request, tasklist_id):
	p = get_object_or_404(TaskList, pk=tasklist_id)
	p.title = request.POST.get('title')
	p.save()
	return HttpResponseRedirect(reverse('ToDo:index'))

def createTask(request):
	qd = request.POST
	p = TaskList.objects.get(pk=qd.get('taskList'))
	task = Task.objects.create(taskList=p, title=qd.get('title'))
	response = JsonResponse({'taskid':task.id,'msg':renderTask(task)})
	return response

def createTaskList(request):
	qd = request.POST
	taskList = TaskList.objects.create(title=qd.get('title'))
	response = JsonResponse({'tasklistid':taskList.id,'msg':renderTaskList(taskList.id)})
	return response

def saveWidgetSize(request, tasklist_id):
	p = get_object_or_404(TaskList, pk=tasklist_id)
	qd = request.POST
	p.width = qd.get('w')
	p.height = qd.get('h')
	p.save()
	return HttpResponseRedirect(reverse('ToDo:index'))

def removeTaskList(request, tasklist_id):
	p = get_object_or_404(TaskList, pk=tasklist_id)
	p.status = -p.status
	p.save()
	return HttpResponseRedirect(reverse('ToDo:index'))

def saveWidgetPos(request, tasklist_id):
	p = get_object_or_404(TaskList, pk=tasklist_id)
	qd = request.POST
	if qd.get('t') > 0:
		p.top = qd.get('t')
	else:
		p.top = 0

	if qd.get('l') > 0:
		p.left = qd.get('l')
	else:
		p.left = 0
	p.save()
	return HttpResponseRedirect(reverse('ToDo:index'))

def clearCompleted(request, tasklist_id):
	tl = TaskList.objects.get(pk=tasklist_id)
	for t in tl.task_set.all():
		if t.status == 1:
			t.status=-1
			t.save()
	return HttpResponse(renderTasks(tasklist_id))

def updateOrder(request, tasklist_id):
	print 'tasklistid: %s' % tasklist_id
	print 'request: %s' % request.POST
	data = request.POST.getlist('data[]')
	for i, item in enumerate(data):
		print repr(i) + " " + repr(item)
		task = get_object_or_404(Task, pk = item)
		taskList = TaskList.objects.get(pk=tasklist_id)
		task.taskList = taskList
		task.sortOrder = i
		task.save()
	return HttpResponseRedirect(reverse('ToDo:index'))

def renderTask(task):
	result = '<li class="task" data-taskid="'+repr(task.id)+'">'
	result += '<img class="dragHandle" src="/static/ToDo/dragHandle.svg" width="10px" height="13px" />'
	result += '<input type="checkbox"'
	if task.status == 1:
		result += ' checked'
	result += '></input>'
	result += '<div class="taskTitle">'+task.title+'</div><br /></li>'
	return result

def renderTasks(tasklist_id):
	tl = TaskList.objects.get(pk=tasklist_id)
	tlHTML = '<ul class="tasks" data-tasklistid="'+repr(int(tasklist_id))+'">'
	for t in tl.task_set.all():
		if t.status >= 0:
			tlHTML += renderTask(t)
	tlHTML += '</ul>'
	return tlHTML

def renderTaskList(tasklist_id):
	taskList = TaskList.objects.get(pk=tasklist_id)
	HTML = '<div class="widgetContainer" title="'+repr(taskList.id)+'" data-tasklistid="'+repr(taskList.id)+'" style="top:'+repr(taskList.top)+';left:'+repr(taskList.left)+'">'
	HTML += '<div class="widget" title="'+repr(taskList.id)+'" data-tasklistid="'+repr(taskList.id)+'" style="width:'+repr(taskList.width)+';height:'+repr(taskList.height)+'">'
	HTML += '<div class="TaskList" id="'+repr(taskList.id)+'">'
	HTML += '<h3><a href="tasklist/'+repr(taskList.id)+'/">'+taskList.title+'</a>'
	HTML += '<div class="closeWidgetButton" data-tasklistid="'+repr(taskList.id)+'"><img src="/static/ToDo/x.svg" width="7px" height="7px" /></div></h3>'
	HTML += renderTasks(taskList.id)
	HTML += '</div>'
	HTML += '<div class="buttons" data-tasklistid="'+repr(taskList.id)+'">'
	HTML += '<div class="addTaskButton">'
	HTML += '<img src="/static/ToDo/plus.svg" width="15px" height="15px" />'
	HTML += '</div>'
	HTML += '<div class="trashButton">'
	HTML += '<img src="/static/ToDo/trash.svg" width="15px" height="15px" />'
	HTML += '</div>'
	HTML += '</div>'
	HTML += '</div>'
	HTML += '</div>'
	return HTML