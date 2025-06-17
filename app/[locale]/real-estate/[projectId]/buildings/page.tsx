import React from "react";
import { getProjectById } from "@/lib/actions/map.actions";
import { notFound } from "next/navigation";
import BuildingsPageClient from "./BuildingsPageClient";

export default async function BuildingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;
  const projectData = await getProjectById(projectId);

  if (!projectData?.project) {
    notFound();
  }

  // التحقق من أن المشروع من نوع العمارات السكنية
  if (projectData.project.type !== "residential_buildings") {
    notFound();
  }

  return (
    <BuildingsPageClient 
      project={projectData.project}
    />
  );
}