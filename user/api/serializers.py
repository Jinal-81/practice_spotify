from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from user.api.constants import AuthConstantsMessages

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')


class RegisterSerializer(UserSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())], max_length=30
    )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(
        validators=[RegexValidator(
            regex=AuthConstantsMessages.REGEX_FOR_CHAR_ONLY,
            message=AuthConstantsMessages.FIRST_NAME_CHAR_ONLY_ERROR_MESSAGE
        )]
    )
    last_name = serializers.CharField(
        validators=[RegexValidator(
            regex=AuthConstantsMessages.REGEX_FOR_CHAR_ONLY,
            message=AuthConstantsMessages.LAST_NAME_CHAR_ONLY_ERROR_MESSAGE
        )]
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate_password(self, attrs):
        if attrs != self.initial_data.get('password2'):
            raise serializers.ValidationError(AuthConstantsMessages.PASSWORD_DOES_NOT_MATCH_ERROR_MESSAGE)

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create(**validated_data)

        user.set_password(validated_data['password'])
        user.save()

        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token['username'] = user.username
        return token