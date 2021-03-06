from django.db.models import Q
from guardian.shortcuts import assign_perm, remove_perm
from rest_framework.generics import RetrieveUpdateDestroyAPIView, UpdateAPIView, GenericAPIView, \
    ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_guardian.filters import ObjectPermissionsFilter

from apps.cases.permissions import ValidatePermission, MatchOrganisationPermission, \
    AssignOrganisationPermission, AcceptRejectCasePermission, ReopenPermission
from apps.cases.models import Case, Partnership
from apps.cases.permissions import ClosePermission, RejectPermission
from apps.cases.serializers import CaseSerializer, get_general_or_medical_info, CloseCaseSerializer
from apps.helpers.permissions import CustomDjangoObjectPermission
from apps.cases.serializers import CreateCaseSerializer
from apps.organisations.models import Organisation


class ListCaseView(ListAPIView):
    queryset = Case.objects.none()
    permission_classes = [CustomDjangoObjectPermission]
    filter_backends = [ObjectPermissionsFilter]
    ordering = ['-created']

    def get_serializer_class(self):
        return get_general_or_medical_info(self.request)

    def get_queryset(self):
        return Case.objects.filter(Q(title__icontains=self.request.query_params.get('search', '')) | Q(
            description__icontains=self.request.query_params.get('search', '')) | Q(
            status__icontains=self.request.query_params.get('search', '')))


class CreateCaseView(CreateAPIView):
    queryset = Case.objects.none()
    serializer_class = CreateCaseSerializer
    permission_classes = [CustomDjangoObjectPermission]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class RetrieveUpdateDeleteCaseView(RetrieveUpdateDestroyAPIView):
    queryset = Case.objects.all()
    permission_classes = [CustomDjangoObjectPermission]
    lookup_url_kwarg = 'id'

    def get_serializer_class(self):
        return get_general_or_medical_info(self.request)


class ClosingReasons(APIView):
    permission_classes = [IsAuthenticated, ClosePermission]

    def get(self, request):
        closing_reasons = [{"id": reason[0], "name": reason[1]} for reason in Case.CLOSING_REASON_CHOICES]
        return Response(closing_reasons)


class ValidateCaseView(UpdateAPIView):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated, ValidatePermission]
    lookup_url_kwarg = 'case_id'

    def update(self, request, *args, **kwargs):
        case = self.get_object()
        case.validate()
        return Response(self.get_serializer(case).data)


class CloseCaseView(UpdateAPIView):
    queryset = Case.objects.all()
    serializer_class = CloseCaseSerializer
    permission_classes = [IsAuthenticated, ClosePermission]
    lookup_url_kwarg = 'case_id'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        instance.close()
        case_serializer = CaseSerializer(instance)
        return Response(case_serializer.data)


class ReopenCaseView(UpdateAPIView):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated, ReopenPermission]
    lookup_url_kwarg = 'case_id'

    def update(self, request, *args, **kwargs):
        case = self.get_object()
        case.reopen()
        return Response(self.get_serializer(case).data)


class RejectCaseView(UpdateAPIView):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated, RejectPermission]
    lookup_url_kwarg = 'case_id'

    def update(self, request, *args, **kwargs):
        case = self.get_object()
        case.reject()
        return Response(self.get_serializer(case).data)


class MatchOrganisation(GenericAPIView):
    queryset = Case
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated, MatchOrganisationPermission]
    lookup_url_kwarg = 'case_id'

    def post(self, request, *args, **kwargs):
        case = self.get_object()
        organisation_ids = self.request.data.get("partner_ids")
        for organisation_id in organisation_ids:
            Partnership(case_id=case.id, organisation_id=organisation_id).save()
            organisation_members = Organisation.objects.get(pk=organisation_id).member.all()
            for member in organisation_members:
                if not member.has_perm("view_case", case):
                    assign_perm("view_case", member, case)
        return Response(self.get_serializer(case).data)

    def delete(self, request, *args, **kwargs):
        case = self.get_object()
        organisation_ids = self.request.data.get("partner_ids")
        for organisation_id in organisation_ids:
            Partnership.objects.get(case_id=case.id, organisation_id=organisation_id).delete()
            organisation_members = Organisation.objects.get(pk=organisation_id).member.all()
            for member in organisation_members:
                if member.has_perm("view_case", case):
                    remove_perm("view_case", member, case)
        return Response(self.get_serializer(case).data)


class AssignOrganisation(GenericAPIView):
    queryset = Case
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated, AssignOrganisationPermission]
    lookup_url_kwarg = 'case_id'

    def post(self, request, *args, **kwargs):
        case = self.get_object()
        organisation_ids = self.request.data.get("partner_ids")
        for organisation_id in organisation_ids:
            match = Partnership.objects.get(case_id=case.id, organisation_id=organisation_id)
            match.assign()
        return Response(self.get_serializer(case).data)

    def delete(self, request, *args, **kwargs):
        case = self.get_object()
        organisation_ids = self.request.data.get("partner_ids")
        for organisation_id in organisation_ids:
            match = Partnership.objects.get(case_id=case.id, organisation_id=organisation_id)
            match.accept()
        return Response(self.get_serializer(case).data)


class AcceptCaseAsOrg(GenericAPIView):
    queryset = Case
    permission_classes = [IsAuthenticated, AcceptRejectCasePermission]
    lookup_url_kwarg = 'case_id'

    def get_serializer_class(self):
        return get_general_or_medical_info(self.request)

    def post(self, request, *args, **kwargs):
        case = self.get_object()
        organisation_id = self.request.data.get("partner_ids")
        match = Partnership.objects.get(case_id=case.id, organisation_id=organisation_id)
        match.accept()
        return Response(self.get_serializer(case).data)

    def delete(self, request, *args, **kwargs):
        case = self.get_object()
        organisation_id = self.request.data.get("partner_ids")
        match = Partnership.objects.get(case_id=case.id, organisation_id=organisation_id)
        match.downgrade()
        return Response(self.get_serializer(case).data)


class RefuseCaseAsOrg(GenericAPIView):
    queryset = Case
    permission_classes = [IsAuthenticated, AcceptRejectCasePermission]
    lookup_url_kwarg = 'case_id'

    def get_serializer_class(self):
        return get_general_or_medical_info(self.request)

    def post(self, request, *args, **kwargs):
        case = self.get_object()
        organisation_id = self.request.data.get("partner_ids")
        match = Partnership.objects.get(case_id=case.id, organisation_id=organisation_id)
        match.reject()
        return Response(self.get_serializer(case).data)

    def delete(self, request, *args, **kwargs):
        case = self.get_object()
        organisation_id = self.request.data.get("partner_ids")
        match = Partnership.objects.get(case_id=case.id, organisation_id=organisation_id)
        match.unreject()
        return Response(self.get_serializer(case).data)
