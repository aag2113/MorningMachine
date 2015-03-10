from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.core.urlresolvers import reverse
from django.views import generic
from django.utils import timezone
from django.views.decorators.csrf import csrf_protect
import json

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
	try:
		if p.status == 0:
			p.status = 1
		else:
			p.status = 0
		p.save()
		return HttpResponse("success")
	except (KeyError, Task.DoesNotExist):
		return render(request, 'ToDo/task.html', {'task': p, 'error_message': "No Such task"})

def updateTitle(request, task_id):
	p = get_object_or_404(Task, pk=task_id)
	p.title = request.POST.get('title')
	p.save()
	return HttpResponseRedirect(reverse('ToDo:index'))

def createTask(request):
	qd = request.POST
	p = TaskList.objects.get(pk=qd.get('taskList'))
	task = Task.objects.create(taskList=p, title=qd.get('title'))
	response = JsonResponse({'taskid':task.id,'msg':generateTask(task)})
	return response

def saveWidgetSize(request, tasklist_id):
	p = get_object_or_404(TaskList, pk=tasklist_id)
	qd = request.POST
	p.width = qd.get('w')
	p.height = qd.get('h')
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
	return HttpResponse(renderTaskList(tasklist_id))

def generateTask(task):
	result = '<div class="task" data-taskid="'+repr(task.id)+'">'
	result += '<input type="checkbox"'
	if task.status == 1:
		result += ' checked'
	result += '></input>'
	result += '<div class="taskTitle">'+task.title+'</div></div>'
	return result

def renderTaskList(tasklist_id):
	tl = TaskList.objects.get(pk=tasklist_id)
	tlHTML = '<div class="tasks" data-tasklistid="'+repr(int(tasklist_id))+'">'
	for t in tl.task_set.all():
		if t.status >= 0:
			tlHTML += generateTask(t)
	tlHTML += '</div>'
	return tlHTML	