"use client";

import { useEffect, useState } from "react";
import UseFetchOrganizations from "@/hooks/use-fetch-organizations";
import { Box, Button, Container, Input, LoadingOverlay } from "@mantine/core";
import OrganizationCard from "@/components/organization-card";
import { InfiniteScroll } from "@/components/infinite-scroll";
import {
  IAddOrganizationForm,
  IOrganization,
} from "@/types/organization-types";
import { postData } from "@/utils/api";
import { IconX, IconCheck } from "@tabler/icons-react";
import { Notification } from "@mantine/core";
import { IResponse } from "@/types/api-response-types";
import AddOrganizationModal from "@/components/add-organization-modal";

export default function OrganizationPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");
  const [visible, setVisible] = useState(false);

  const { organizations, fetchOrganizations } = UseFetchOrganizations();
  

  useEffect(() => {
    async function fetchData() {
      setVisible(true);
      await Promise.all([fetchOrganizations()]);
      setVisible(false);
    }
    fetchData();
  }, []);

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (data: IAddOrganizationForm) => {
    try {
      const res = await postData(`api/organization`, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });
      const response: IResponse = res.data;

      if (response.status === "Success") {
        setMessage(response.message);
        setStatus("success");
        fetchOrganizations();
      } else {
        setMessage(response.message);
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
      console.log("Error: ", error);
    }
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="space-y-6">
      {status && (
        <div className="fixed top-24 right-2 sm:right-5 z-[9999]">
          <Notification
            withCloseButton={false}
            icon={
              status === "success" ? (
                <IconCheck size={20} />
              ) : (
                <IconX size={20} />
              )
            }
            color={status === "success" ? "teal" : "red"}
            withBorder
            title={status === "success" ? "Success" : "Error"}
          >
            {message}
          </Notification>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Button variant="filled" onClick={() => setModalOpen(true)}>
          New Organization
        </Button>
      </div>

      <Input
        className="flex-1"
        placeholder="Search organizations..."
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        rightSection={
          search !== "" ? (
            <Input.ClearButton onClick={() => setSearch("")} />
          ) : undefined
        }
        rightSectionPointerEvents="auto"
        size="md"
      />

      <Box pos="relative" style={{ minHeight: "50px" }}>
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Container
          fluid
          py="md"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <InfiniteScroll<IOrganization>
            data={filteredOrganizations}
            itemsPerPage={24}
            loader={
              <div className="text-center py-4">
                Loading more organizations...
              </div>
            }
            endMessage={""}
            renderItem={(org) => (
              <div key={org.id} className="w-full">
                <OrganizationCard
                  organization={org}
                  onDeleted={fetchOrganizations}
                />
              </div>
            )}
          />
        </Container>
      </Box>
      <AddOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
