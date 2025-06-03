"use client";

import { useEffect, useState } from "react";
import { Box, Button, Container, Input } from "@mantine/core";
import { IconX, IconCheck } from "@tabler/icons-react";
import { Notification } from "@mantine/core";

import UseFetchOrganizations from "@/hooks/use-fetch-organizations";
import OrganizationCard from "@/components/organization-card";
import AddOrganizationModal from "@/components/add-organization-modal";
import { postData } from "@/utils/api";

import {
  IAddOrganizationForm,
  IOrganization,
} from "@/types/organization-types";
import { IResponse } from "@/types/api-response-types";
import { useDebounce } from "use-debounce";

const PAGE_SIZE = 15;

export default function OrganizationPage() {
  const [search, setSearch] = useState("");
  const [searchDebounce] = useDebounce(search, 1000);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");

  const [pagedOrganizations, setPagedOrganizations] = useState<IOrganization[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { fetchOrganizations, fetchPagedOrganizations } = UseFetchOrganizations();
  
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setPagedOrganizations([]);
      setPage(1);
      setHasMore(true);
      loadMoreOrganizations(1);
      setIsLoading(false);
    };

    fetchInitialData();
  }, [searchDebounce]);

  
  const loadMoreOrganizations = async (pageNumber: number) => {
    const newItems = await fetchPagedOrganizations(pageNumber, PAGE_SIZE, searchDebounce) || [];

    if (newItems.length === 0) {
      setHasMore(false);
    } else {
      // setPagedOrganizations((prev) => [...prev, ...newItems]);
      setPagedOrganizations((prev) => {
        const existingIds = new Set(prev.map((org) => org.id));
        const filteredNewItems = newItems.filter((org) => !existingIds.has(org.id));
        return [...prev, ...filteredNewItems];
      });
      setPage(pageNumber);
    }
  };

  const handleLoadMore = () => {
    loadMoreOrganizations(page + 1);
  };

  const handleSubmit = async (data: IAddOrganizationForm) => {
    try {
      const res = await postData("api/organization", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });
      const response: IResponse = res.data;

      if (response.status === "Success") {
        setMessage(response.message);
        setStatus("success");
        await fetchOrganizations();
        
        setPagedOrganizations([]);
        setPage(1);
        setHasMore(true);
        await loadMoreOrganizations(1);
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
            icon={status === "success" ? <IconCheck size={20} /> : <IconX size={20} />}
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
        onChange={(e) => setSearch(e.currentTarget.value)}
        rightSection={search !== "" ? <Input.ClearButton onClick={() => setSearch("")} /> : undefined}
        rightSectionPointerEvents="auto"
        size="md"
      />

      <Box pos="relative" style={{ minHeight: "50px" }}>
        <Container
          fluid
          py="md"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {pagedOrganizations.map((org) => (
            <div key={org.id} className="w-full">
              <OrganizationCard
                organization={org}
                onDeleted={async () => {
                  await fetchOrganizations();
                  setPagedOrganizations((prev) => prev.filter((o) => o.id !== org.id));
                }}
              />
            </div>
          ))}
        </Container>

        {hasMore && (
          <div className="flex justify-center my-4">
            <Button onClick={handleLoadMore} loading={isLoading}>
              Load More
            </Button>
          </div>
        )}
      </Box>

      <AddOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
