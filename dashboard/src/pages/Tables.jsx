import { useEffect, useState } from "react";
import { Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBgColor, fetchTableOrders } from "@/lib/utils";
import { useTableStore } from "@/stores/useTableStore";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Container from "@/components/Shared/Container";

const Tables = () => {
  const { tables, floors, loadingTables, loadingFloors, errorTables, errorFloors, fetchTables, fetchFloors } = useTableStore();
  const [tableStats, setTableStats] = useState({});

  // fetch tables and floors first
  useEffect(() => {
    fetchTables();
    fetchFloors();
  }, [fetchTables, fetchFloors]);

  // fetch orders for all tables
  useEffect(() => {
    const fetchStats = async () => {
      const stats = {};
      for (let table of tables) {
        try {
          const data = await fetchTableOrders(table.table_number);
          stats[table.name] = data; // { total_orders, waiting_time }
        } catch (err) {
          console.error("Failed to fetch table orders", err);
          stats[table.name] = { total_orders: 0, waiting_time: 0 };
        }
      }
      setTableStats(stats);
    };

    if (tables.length) fetchStats();
  }, [tables]);

  if (loadingTables || loadingFloors) return <Loader />;
  if (errorTables || errorFloors) return <Error />;

  return (
    <Container>
      <div className="grid grid-cols-7 gap-4">
        {tables.map((table) => (
          <Link key={table.name} to={`/tables/${table.name}`}>
            <Card className="cursor-pointer hover:shadow-lg transition">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>{`Table ${table.table_number}`}</CardTitle>
                <Badge variant={table.status.toLowerCase()}>{table.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="flex items-center rounded-full p-4" style={{ backgroundColor: getBgColor() }}>
                    <Utensils size={24} className="text-white" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Capacity: {table.capacity}</p>
                <p className="text-gray-400 text-sm">Total Orders: {tableStats[table.name]?.total_orders || 0}</p>
                <p className="text-gray-400 text-sm">Waiting Time: {tableStats[table.name]?.waiting_time || 0} mins</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
};

export default Tables;
