'''views exposing API to the frontend'''
from django.shortcuts import get_object_or_404
from rest_framework import permissions, viewsets, generics, status
from polls.models import Question, Choice, alreadyVoted
from django.views import generic
from authentication.models import Account
from authentication.permissions import IsQuestionOwner, IsChoiceOwner
import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from polls.serializers import QuestionSerializer, ChoiceSerializer
from rest_framework import mixins, views
from rest_framework.decorators import api_view


# # Create your views here.

class QuestionView(viewsets.ModelViewSet):
	'''viewset to create update and delete
	Question. Includes choices as nested data'''
	queryset = Question.objects.all().order_by('-pub_date')
	serializer_class = QuestionSerializer

	def get_permissions(self):
		'''return allowed permissions'''
		if self.request.method == 'GET':
		    return (permissions.AllowAny(), )

		if self.request.method == 'POST':
		    return (IsAuthenticated(), )

		return (IsQuestionOwner(), )

	def create(self, request):
		'''creates question object and assosiates it with the user'''
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			print serializer.validated_data

			ques = Question(pub_date=datetime.datetime.now(),
			                **serializer.validated_data)
			ques.createdby = request.user
			ques.save()
			response = self.serializer_class(ques)
			return Response(response.data, status=status.HTTP_200_OK)
		else:
			return Response({'error':'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)


class ChoiceView(mixins.UpdateModelMixin,
                 mixins.DestroyModelMixin,
                 mixins.CreateModelMixin,
                 viewsets.GenericViewSet):
	'''viewset to create update and delete
	choice. I have allowed only create update
	and delete methods as for each question
	choices will be provided in the Question api'''
	serializer_class = ChoiceSerializer
	queryset = Choice.objects.all()
	permission_classes = (IsChoiceOwner, )

	def create(self, request):
		'''creates question object and assosiates it with the user'''
		data = request.data.copy()
		if 'qid' in data:
			###quid is question id required to identify question
			###corresponding to these choices
			identifier = data['qid']
			data.pop('qid')
			question = get_object_or_404(Question, pk=identifier)
			serializer = self.serializer_class(data=data)
			if serializer.is_valid():
				choice = Choice.objects.create(question=question,
				                               **serializer.validated_data)
				response = self.serializer_class(choice)
				return Response(response.data, status=status.HTTP_200_OK)
			else:
				return Response({'error':'Invalid data'},
				                status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response({'error':'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def vote(request):
	'''function to cast vote'''

	if request.user.is_authenticated():
		choice = get_object_or_404(Choice, pk=request.data['cid'])
		question = get_object_or_404(Question, pk=request.data['qid'])
		obj, created = alreadyVoted.objects.get_or_create(
		                                                  user=request.user,
		                                                  ques=question)
		if created:
			choice.votes += 1
			choice.save()
			return Response({'status':'Your vote has been cast'},
			                status=status.HTTP_200_OK)
		else:
			return Response({'status':"You have already voted here"})
	else:
		data = {'error':'Not an authenticated user'}
		return Response(data, status=status.HTTP_400_BAD_REQUEST)










