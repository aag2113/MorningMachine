from django.conf.urls import patterns, url
from ToDo import views


urlpatterns = patterns('', 
                    # /ToDo/
                    url(r'^$', views.IndexView.as_view(), name='index'),

                    # /ToDo/task/5/
                    url(r'^task/(?P<pk>\d+)/$', views.taskView.as_view(), name='task'),

                    # /ToDo/task/create/
                    url(r'^task/create/$', views.createTask, name='createTask'),

                    # /ToDo/task/5/check/
                    url(r'^task/(?P<task_id>\d+)/check/$', views.check, name='check'),

                    # /ToDo/task/5/updateTitle/
                    url(r'^task/(?P<task_id>\d+)/updateTitle/$', views.updateTitle, name='updateTitle'),

                    # /ToDo/taskList/5/updateTitle/
                    url(r'^taskList/(?P<tasklist_id>\d+)/updateTitle/$', views.TLupdateTitle, name='TLupdateTitle'),

                    # /ToDo/tasklist/1/
                    url(r'^tasklist/(?P<pk>\d+)/$', views.taskListView.as_view(), name='tasklist'),

                    # /ToDo/tasklist/create/
                    url(r'^tasklist/create/$', views.createTaskList, name='createTaskList'),

                    # /ToDo/tasklist/5/remove/
                    url(r'^tasklist/(?P<tasklist_id>\d+)/remove/$', views.removeTaskList, name='removeTaskList'),

                    # /ToDo/tasklist/5/saveWidgetSize/
                    url(r'^tasklist/(?P<tasklist_id>\d+)/saveWidgetSize/$', views.saveWidgetSize, name='saveWidgetSize'),

                    # /ToDo/tasklist/5/saveWidgetPos/
                    url(r'^tasklist/(?P<tasklist_id>\d+)/saveWidgetPos/$', views.saveWidgetPos, name='saveWidgetPos'),

                    # /ToDo/tasklist/5/clearCompleted/
                    url(r'^tasklist/(?P<tasklist_id>\d+)/clearCompleted/$', views.clearCompleted, name='clearCompleted'),

                    # /ToDo/tasklist/5/updateOrder/
                    url(r'^tasklist/(?P<tasklist_id>\d+)/updateOrder/$', views.updateOrder, name='updateOrder'),
)
