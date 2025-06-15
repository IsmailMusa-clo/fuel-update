"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import ControlFunctions from "@/components/ControlFunctions";
import WebsiteTitleSec from "@/components/WebsiteTitleSec";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NeedHelpForm from "@/components/form/NeedHelpForm";
import { Project, Building } from "@/types/map.types";
import Link from "next/link";

// بيانات وهمية للعمارات - يجب استبدالها بالبيانات الحقيقية من API
const mockBuildings: Building[] = [
  {
    id: "1",
    name: "العمارة الأولى",
    number: 1,
    imageUrl: "/assets/images/building1.jpg",
    unitsCount: 24,
    project: {} as Project,
  },
  {
    id: "2", 
    name: "العمارة الثانية",
    number: 2,
    imageUrl: "/assets/images/building2.jpg",
    unitsCount: 32,
    project: {} as Project,
  },
  {
    id: "3",
    name: "العمارة الثالثة", 
    number: 3,
    imageUrl: "/assets/images/building3.jpg",
    unitsCount: 28,
    project: {} as Project,
  },
];

const BuildingsPageClient = ({ project }: { project: Project }) => {
  const t = useTranslations("ProjectPage");
  const [openHelpForm, setOpenHelpForm] = useState<boolean>(false);

  return (
    <div className="bg-[#544533] relative text-center min-h-[100vh] w-screen flex items-center justify-center overflow-x-hidden">
      <ControlFunctions
        setOpenHelpForm={setOpenHelpForm}
      />

      <div
        className={clsx(
          "absolute top-4 z-[1000]",
          t("language").toLowerCase() === "en" ? "right-[10px]" : "left-[10px]"
        )}
      >
        <WebsiteTitleSec projectId={project.id} projectName={project.name} />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            اختر العمارة السكنية
          </h1>
          <p className="text-xl text-gray-200">
            {project.name} - العمارات السكنية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mockBuildings.map((building) => (
            <Link
              key={building.id}
              href={`/ar/real-estate/${project.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="relative h-64">
                  <Image
                    src="/assets/images/project.jpg"
                    alt={building.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-2">
                      {building.name}
                    </h3>
                    <p className="text-gray-200 text-sm">
                      {building.unitsCount} وحدة سكنية
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">
                      رقم العمارة: {building.number}
                    </span>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      استكشف العمارة
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href={`/ar/real-estate/${project.id}`}>
            <Button variant="outline" className="bg-white text-gray-800 hover:bg-gray-100">
              عرض المخطط العام للمشروع
            </Button>
          </Link>
        </div>
      </div>

      {/* Need Help Form Popup */}
      <Dialog open={openHelpForm} onOpenChange={setOpenHelpForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl font-extrabold">
              {t("NeedHelp")}
            </DialogTitle>
          </DialogHeader>
          <NeedHelpForm setOpen={setOpenHelpForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuildingsPageClient;