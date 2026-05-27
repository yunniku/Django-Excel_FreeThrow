from django.db import models
from django.contrib.auth.models import User


# 작업 프로젝트
class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# 작업 실행 이력
class TaskHistory(models.Model):
    STATUS_CHOICES = [
        ('success', '성공'),
        ('failed', '실패'),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    input_file = models.FileField(upload_to='uploads/')
    output_file = models.CharField(max_length=500, blank=True)  # 결과 파일 경로
    result_summary = models.TextField(blank=True)               # compare 결과 요약
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.name} - {self.created_at}"