'''Serializers convert the db queries into python
data structures(dictionaries) for easy json rendering'''
from rest_framework import serializers
from polls.models import Question, Choice, alreadyVoted

class AlreadyVotedSerializer(serializers.ModelSerializer):
	'''serializes already voted model object'''

	class Meta:
		'''defines the model to be serialized'''
		model = alreadyVoted
		fields = ('id', 'user', 'ques')
		read_only_fields = ('id', 'user', 'ques')

	# def get_private_field1(self, obj):
	# 	'''returns private field vote if ques is created by
	# 	user requesting the api'''
 #        # obj.created_by is the foreign key to the user model
	# 	if obj.ques.createdby != self.context['request'].user:
	# 		return None
	# 	else:
	# 		return obj.selection


class ChoiceSerializer(serializers.ModelSerializer):
	'''serializes choice object'''

	vote = AlreadyVotedSerializer(many=True, read_only=True)
	votes = serializers.SerializerMethodField('get_private_field1')
	class Meta:
		'''defines the model to be serialized'''
		model = Choice
		read_only_fields = ('votes', 'question')

	def get_private_field1(self, obj):
		'''returns private field vote if ques is created by
		user requesting the api'''
        # obj.created_by is the foreign key to the user model
		if obj.question.createdby != self.context['request'].user:
			return None
		else:
			return obj.votes


class QuestionSerializer(serializers.ModelSerializer):
	'''serializes Question object'''
	choices = ChoiceSerializer(many=True, read_only=True)
	# question_text = serializers.CharField(min_length=299, null=False)
	class Meta:
		'''defines model to be serialized'''
		model = Question
		read_only_fields = ('pub_date', 'createdby', 'choices')

