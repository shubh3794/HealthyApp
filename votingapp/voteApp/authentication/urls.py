from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from authentication import views
from rest_framework import routers

urlpatterns = [
    url(r'^(?P<pk>[0-9]+)/$', views.AccountDetail.as_view()),
    url(r'^loginstatus/$', views.checkAccountStatus),
    url(r'^getcurruser/(?P<pk>[0-9]+)/$', views.GetCurrUser.as_view()),
]
