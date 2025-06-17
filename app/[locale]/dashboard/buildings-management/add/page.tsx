"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { addBuilding, getProjects } from "@/lib/actions/dashboard.actions";
import { useRouter } from "next/navigation";

const buildingFormSchema = z.object({
  name: z.string().min(2, "اسم العمارة يجب ألا يقل عن حرفين"),
  number: z.number().min(1, "رقم العمارة مطلوب"),
  description: z.string().optional(),
  unitsCount: z.number().min(1, "عدد الوحدات مطلوب"),
  floors: z.number().min(1, "عدد الطوابق مطلوب"),
  status: z.enum(["متاح", "قيد الإنشاء", "مكتمل"]),
  projectId: z.string().min(1, "اختيار المشروع مطلوب"),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

const AddBuildingForm = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsData = await getProjects();
      // فلترة المشاريع من نوع العمارات السكنية فقط
      const residentialProjects = projectsData.filter(
        project => project.type === "residential_buildings"
      );
      setProjects(residentialProjects);
    };
    fetchProjects();
  }, []);

  const form = useForm({
    resolver: zodResolver(buildingFormSchema),
    defaultValues: {
      name: "",
      number: 1,
      description: "",
      unitsCount: 1,
      floors: 1,
      status: "متاح",
      projectId: "",
      position: { x: 0, y: 0 },
    },
  });

  const onSubmit = async (values) => {
    try {
      const buildingData = {
        ...values,
        position: position,
      };

      await addBuilding(buildingData);
      
      toast({
        title: "نجاح",
        description: "تم إضافة العمارة السكنية بنجاح!",
        variant: "default",
      });

      router.push("/ar/dashboard/buildings-management");
    } catch (error) {
      console.error("Error adding building:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة العمارة السكنية",
        variant: "destructive",
      });
    }
  };

  const handleImageClick = (event) => {
    if (!selectedProject?.projectDocUrl) return;
    
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // تحويل الإحداثيات إلى نسب مئوية
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    setPosition({ x: xPercent, y: yPercent });
    form.setValue("position", { x: xPercent, y: yPercent });
  };

  const handleProjectChange = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project);
    form.setValue("projectId", projectId);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          إضافة عمارة سكنية جديدة
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* نموذج البيانات */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المشروع</FormLabel>
                      <Select onValueChange={handleProjectChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المشروع" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم العمارة</FormLabel>
                      <FormControl>
                        <Input placeholder="العمارة الأولى" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم العمارة</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوصف (اختياري)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="وصف العمارة..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="unitsCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عدد الوحدات</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="floors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عدد الطوابق</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>حالة العمارة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="متاح">متاح</SelectItem>
                          <SelectItem value="قيد الإنشاء">قيد الإنشاء</SelectItem>
                          <SelectItem value="مكتمل">مكتمل</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* عرض الإحداثيات */}
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">
                    الموقع المحدد: X: {position.x.toFixed(2)}%, Y: {position.y.toFixed(2)}%
                  </p>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  إضافة العمارة السكنية
                </Button>
              </form>
            </Form>
          </div>

          {/* منطقة تحديد الموقع على الصورة */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">تحديد موقع العمارة على المخطط</h3>
            
            {selectedProject?.projectDocUrl ? (
              <div className="relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_PUBLIC_URL}${selectedProject.projectDocUrl}`}
                  alt="مخطط المشروع"
                  className="w-full h-auto border rounded cursor-crosshair"
                  onClick={handleImageClick}
                />
                
                {/* نقطة التحديد */}
                {position.x > 0 && position.y > 0 && (
                  <div
                    className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                    }}
                  />
                )}
                
                <p className="text-sm text-gray-600 mt-2">
                  اضغط على الصورة لتحديد موقع العمارة السكنية
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  {selectedProject 
                    ? "لا توجد صورة مخطط لهذا المشروع" 
                    : "اختر مشروعاً أولاً لعرض المخطط"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBuildingForm;