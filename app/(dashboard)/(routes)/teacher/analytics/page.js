import { getAnalytics } from "@/actions/get-analytics";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DataCard from "@/components/templates/dashboard/DataCard";
import Chart from "@/components/templates/dashboard/Chart";

async function AnalyticsPage() {
  const { userId } = await auth();

  if (!userId) return redirect("/");

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  // Transform data to match the expected structure for Chart component
  const chartData = Object.keys(data).map((key) => ({
    name: key,
    total: data[key],
  }));

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
        <DataCard label="Total Sales" value={totalSales} />
      </div>
      <Chart data={chartData} />
    </div>
  );
}

export default AnalyticsPage;