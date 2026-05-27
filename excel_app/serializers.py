from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, TaskHistory


# 회원가입용
class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['username', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("비밀번호가 일치하지 않습니다.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)


# 프로젝트용
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Project
        fields = ['id', 'name', 'description', 'created_at']


# 작업 이력용
class TaskHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = TaskHistory
        fields = ['id', 'project', 'status', 'result_summary', 'error_message', 'created_at']