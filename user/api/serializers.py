from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from user.api.constants import PASSWORD_NOT_MATCH_ERROR_MSG, FIRST_NAME_CHAR_ONLY_ERROR_MSG, LAST_NAME_CHAR_ONLY_ERROR_MSG, \
    REGEX_FOR_CHAR_ONLY
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())], max_length=30
    )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(
        validators=[RegexValidator(
            regex=REGEX_FOR_CHAR_ONLY,
            message=FIRST_NAME_CHAR_ONLY_ERROR_MSG
        )]
    )
    last_name = serializers.CharField(
        validators=[RegexValidator(
            regex=REGEX_FOR_CHAR_ONLY,
            message=LAST_NAME_CHAR_ONLY_ERROR_MSG
        )]
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": PASSWORD_NOT_MATCH_ERROR_MSG})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

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