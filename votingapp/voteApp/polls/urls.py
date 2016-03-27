from django.conf.urls import url, include
from . import views
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'question',
                views.QuestionView)
router.register(r'choice',
                views.ChoiceView)

urlpatterns = [
	url(r'^vote/$', views.vote, name='votes'),
	url(r'^sys/', include(router.urls))

]
