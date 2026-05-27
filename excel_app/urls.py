from django.urls import path
from . import views

urlpatterns = [
    # 인증 API
    path('api/register/', views.register, name='register'),
    path('api/login/', views.login_view, name='login'),
    path('api/logout/', views.logout_view, name='logout'),
    path('api/me/', views.me, name='me'),
    path('api/projects/', views.project_list, name='project_list'),
    path('api/projects/<int:pk>/', views.project_delete, name='project_delete'),
    path('api/sheets/',        views.get_sheets,       name='get_sheets'),
    path('api/preview/',       views.get_preview,       name='get_preview'),
    path('api/filter-values/', views.get_filter_values, name='get_filter_values'),
    path('api/compare/', views.compare,     name='compare'),
    path('api/save/',    views.save_result, name='save_result'),
]