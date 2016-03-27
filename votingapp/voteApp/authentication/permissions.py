from rest_framework import permissions
from polls.models import Question
class IsAccountOwner(permissions.BasePermission):
	'''returns true if the user is owner of account being accessed'''
	def has_object_permission(self, request, view, account):
		'''perm object'''
		if request.user:
			return account == request.user
		return False

class IsQuestionOwner(permissions.BasePermission):
	'''returns true if the user is owner of ques being accessed'''
	def has_object_permission(self, request, view, question):
		'''perm object'''
		if request.user:
			return True
		return False

class IsChoiceOwner(permissions.BasePermission):
	'''returns true if the user is owner of ques being accessed'''
	def has_object_permission(self, request, view, choice):
		'''perm object'''
		if request.user:
			data = request.data
			if 'qid' in data:
				ques = Question.objects.get(pk=data['qid'])
				return ques.createdby == request.user
			else:
				return False
		return False
