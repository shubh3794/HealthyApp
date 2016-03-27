'''serializes db queries into python objs for easy json conversions'''
from rest_framework import serializers
from authentication.models import Account
from polls.serializers import QuestionSerializer, ChoiceSerializer, AlreadyVotedSerializer

class AccountSerializer(serializers.ModelSerializer):
    '''serializer for auth users'''

    created = QuestionSerializer(many=True, read_only=True)
    voter = AlreadyVotedSerializer(many=True, read_only=True)
    permission_classes = ('IsAuthenticated', 'IsAccountOwner')
    class Meta:
        '''Meta Data'''
        model = Account
        fields = ('id', 'email', 'username', 'date_joined', 'last_login',
                  'social_thumb', 'created', 'updated_at', 'voter')
        read_only_fields = ('id', 'date_joined', 'updated_at',
                            'created', 'voter')
