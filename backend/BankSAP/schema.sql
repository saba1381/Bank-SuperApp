# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class CardsCard(models.Model):
    id = models.BigAutoField(primary_key=True)
    card_number = models.CharField(unique=True, max_length=16, blank=True, null=True)
    full_name = models.CharField(max_length=100)
    expiration_month = models.CharField(max_length=2, blank=True, null=True)
    expiration_year = models.CharField(max_length=2, blank=True, null=True)
    user = models.ForeignKey('UsersUser', models.DO_NOTHING)
    bank_name = models.CharField(max_length=50, blank=True, null=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    cvv2 = models.CharField(max_length=3, blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cards_card'


class CardsCardtocard(models.Model):
    id = models.BigAutoField(primary_key=True)
    initialcard = models.CharField(db_column='initialCard', max_length=16)  # Field name made lowercase.
    descard = models.CharField(db_column='desCard', max_length=16)  # Field name made lowercase.
    amount = models.DecimalField(max_digits=20, decimal_places=0)
    cvv2 = models.CharField(max_length=4)
    cardmonth = models.CharField(db_column='cardMonth', max_length=2)  # Field name made lowercase.
    cardyear = models.CharField(db_column='cardYear', max_length=4)  # Field name made lowercase.
    created_at = models.CharField(max_length=19)
    user = models.ForeignKey('UsersUser', models.DO_NOTHING)
    status = models.IntegerField()
    descardowner = models.CharField(db_column='desCardOwner', max_length=50, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'cards_cardtocard'


class CardsSavedcard(models.Model):
    id = models.BigAutoField(primary_key=True)
    des_card = models.CharField(max_length=16)
    created_at = models.DateTimeField()
    user = models.ForeignKey('UsersUser', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'cards_savedcard'


class ChargeRecharge(models.Model):
    id = models.BigAutoField(primary_key=True)
    mobile_number = models.CharField(max_length=11)
    amount = models.DecimalField(max_digits=20, decimal_places=0)
    timestamp = models.DateTimeField()
    user = models.ForeignKey('UsersUser', models.DO_NOTHING)
    status = models.IntegerField()
    card_number = models.CharField(max_length=16)

    class Meta:
        managed = False
        db_table = 'charge_recharge'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('UsersUser', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class TokenBlacklistBlacklistedtoken(models.Model):
    id = models.BigAutoField(primary_key=True)
    blacklisted_at = models.DateTimeField()
    token = models.OneToOneField('TokenBlacklistOutstandingtoken', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'token_blacklist_blacklistedtoken'


class TokenBlacklistOutstandingtoken(models.Model):
    id = models.BigAutoField(primary_key=True)
    token = models.TextField()
    created_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField()
    user = models.ForeignKey('UsersUser', models.DO_NOTHING, blank=True, null=True)
    jti = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'token_blacklist_outstandingtoken'


class UsersUser(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    phone_number = models.CharField(unique=True, max_length=11, blank=True, null=True)
    national_code = models.CharField(unique=True, max_length=10, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    first_name = models.CharField(max_length=30, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    profile_image = models.CharField(max_length=100, blank=True, null=True)
    username = models.CharField(max_length=150, blank=True, null=True)
    is_customer = models.IntegerField()
    is_staff = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'users_user'


class UsersUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(UsersUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_user_groups'
        unique_together = (('user', 'group'),)


class UsersUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(UsersUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users_user_user_permissions'
        unique_together = (('user', 'permission'),)
