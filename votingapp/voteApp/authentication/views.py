'''Views for authentication functionality
like retrive user, check login status etc'''
from rest_framework import viewsets, mixins
from authentication.serializers import AccountSerializer
from authentication.models import Account
from rest_framework import generics
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from authentication.permissions import IsAccountOwner
from rest_framework import permissions

class AccountDetail(generics.RetrieveAPIView):
	'''returns account corresponding to its pk'''
	queryset = Account.objects.all()
	serializer_class = AccountSerializer

@api_view(['GET'])
def checkAccountStatus(request):
	'''function to check auth status of a user'''
	if request.method == 'GET':
		if request.user.is_authenticated():
			data = {'status':True, 'pk':request.user.id}
			return Response(data, status=status.HTTP_200_OK)
		else:
			data = {'status':False}
			return Response(data, status=status.HTTP_200_OK)
	else:
		data = {'error':'Method not allowed'}
		Response(data, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class GetCurrUser(generics.RetrieveAPIView):
	'''viewset to retrieve curr user. I have allowed only create update
	and delete methods as for each question
	choices will be provided in the Question api'''
	serializer_class = AccountSerializer
	queryset = Account.objects.all()
	permission_classes = (permissions.IsAuthenticated, )



