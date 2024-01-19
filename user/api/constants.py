
class AuthConstantsMessages:
    """
    class that contains constant for User Authentication messages
    """
    PASSWORD_DOES_NOT_MATCH_ERROR_MESSAGE = "Password fields didn't match."
    FIRST_NAME_CHAR_ONLY_ERROR_MESSAGE = 'First name should only contain characters.'
    LAST_NAME_CHAR_ONLY_ERROR_MESSAGE = 'Last name should only contain characters.'
    REGEX_FOR_CHAR_ONLY = r'^[a-zA-Z]+$'