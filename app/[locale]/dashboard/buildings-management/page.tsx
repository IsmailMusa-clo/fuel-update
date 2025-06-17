"use client";

import { useEffect, useState } from "react";
import { buildingsColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { getBuildings, getProjects } from "@/lib/actions/dashboard.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Page = () => {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [buildingsData, projectsData] = await Promise.all([
          getBuildings(),
          getProjects()
        ]);
        
        setBuildings(buildingsData?.items || []);
        setProjects(projectsData || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // فلترة العمارات حسب المشروع المحدد
  const filteredBuildings = selectedProject 
    ? buildings.filter(building => building.projectId === selectedProject)
    : buildings;

  const paginatedData = filteredBuildings.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // فلترة المشاريع من نوع العمارات السكنية فقط
  const residentialBuildingProjects = projects.filter(
    project => project.type === "residential_buildings"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex-1 p-6 flex items-center justify-center">
        <span>جاري التحميل...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          إدارة العمارات السكنية
        </h1>
        <div className="flex gap-4 items-center">
          {/* فلتر المشاريع */}
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="اختر المشروع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع المشاريع</SelectItem>
              {residentialBuildingProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Link href="/ar/dashboard/buildings-management/add">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              إضافة عمارة سكنية
            </Button>
          </Link>
        </div>
      </div>

      {/* عرض رسالة إذا لم توجد مشاريع من نوع العمارات السكنية */}
      {residentialBuildingProjects.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>لا توجد مشاريع من نوع "عمارات سكنية". يرجى إضافة مشروع من هذا النوع أولاً.</p>
        </div>
      )}

      {/* Table Section */}
      <DataTable columns={buildingsColumns} data={paginatedData || []} />

      {/* Pagination Controls */}
      <div className="flex items-center justify-start space-x-4 py-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          السابق
        </Button>
        <span>الصفحة {currentPage + 1}</span>
        <Button
          variant="outline"
          size="lg"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={(currentPage + 1) * rowsPerPage >= filteredBuildings.length}
        >
          التالي
        </Button>
      </div>
    </div>
  );
};

export default Page;