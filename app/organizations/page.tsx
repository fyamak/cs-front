"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { deleteData } from "@/utils/api";
import AddOrganizationModal from "@/components/add-organization-modal";
import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import UseFetchOrganizations from "@/hooks/use-fetch-organizations";


export default function OrganizationPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const { organizations, fetchOrganizations} = UseFetchOrganizations()

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const filteredOrganizations =  organizations.filter((org) => org.name.toLowerCase().includes(search.toLowerCase()))


  const handleDelete = async (id: number) => {
    modals.openConfirmModal({
      title: 'Delete your profile',
      centered: true,
      children: (
        <Text size="sm">
           Are you sure you want to delete this organization? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      // onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        try {
          await deleteData(`api/organization/${id}`);
          fetchOrganizations();
        } catch (error) {
          console.error("Error deleting organization:", error);
        }
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
        >
          New Organization
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search organizations..."
          className="pl-10 px-4 py-2 border rounded-md shadow-sm w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrganizations.map((filteredOrganization) => (
          <div
            key={filteredOrganization.id}
            className="cursor-pointer bg-white border rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          >
            <div className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">

              <h3 className="text-lg font-semibold">
                {filteredOrganization.name}
              </h3>

              <button
                onClick={() => handleDelete(filteredOrganization.id)}
                // className="text-red-600 hover:text-red-800"
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 active:scale-95 transition transform duration-100"
                >
                <Trash2 className="w-5 h-5" />
              </button>
                </div>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span>{filteredOrganization.phone}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span>{filteredOrganization.email}</span>
              </div>
              <div className="pt-2 text-gray-500">
                <p className="text-s">{filteredOrganization.address}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={fetchOrganizations}
      />
    </div>
  );
}
