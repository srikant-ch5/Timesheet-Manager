from leads.models import Lead
from rest_framework import viewsets, permissions
from .serializers import LeadSeriazlier
from rest_framework.response import Response
from rest_framework import status

# Viewset used to create ful CRUD api without having to explain explicitly


class LeadViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = LeadSeriazlier

    def get_queryset(self):
        return self.request.user.leads.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
