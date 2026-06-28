import { Calendar, Folder, LayoutDashboard, SquareCheckBig } from "@lucide/vue";

export const appNavigation = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: SquareCheckBig,
  },
  {
    title: "Projects",
    path: "/projects",
    icon: Folder,
  },
  {
    title: "Calendar",
    path: "/calendar",
    icon: Calendar,
  },
];
