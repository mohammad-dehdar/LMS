import db from "@/lib/db";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server"

import { columns } from "@/components/templates/dashboard/Columns"
import { DataTable } from "@/components/templates/dashboard/DataTable"


async function CoursesPage() {
  const {userId} = auth();
  
  if(userId) {
    return redirect("/")
  }

  const courses = await db.course.findMany({
    where : {
      userId,
    },
    orderBy: {
      createdAt:"desc",
    }

  })
  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses}/> 
    </div>
  )
}

export default CoursesPage