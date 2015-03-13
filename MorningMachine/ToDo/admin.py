from django.contrib import admin
from ToDo.models import TaskList, Task


class TaskInline(admin.TabularInline):
    model = Task
    extra = 3


class TaskListAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,	{'fields': ['status','title','left','top','width','height']})
    ]
    inlines = [TaskInline]


class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'created_date','completed_date','sortOrder')
    list_filter = ['status', 'created_date']
    search_fields = ['title']

admin.site.register(TaskList, TaskListAdmin)
admin.site.register(Task, TaskAdmin)