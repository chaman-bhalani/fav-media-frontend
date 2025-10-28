import { useCallback, useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteEntry, fetchEntries } from "../api";
import "../index.css";

export default function EntriesTable({
  onEdit,
}: {
  onEdit: (entry: any) => void;
}) {
  const [entries, setEntries] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const resp = await fetchEntries(nextCursor || undefined, 20);
      const newData = resp;
      setEntries((prev) => [...prev, ...newData]);
      setNextCursor(resp.nextCursor);
      if (!resp.nextCursor || newData.length === 0) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, nextCursor, hasMore]);

  useEffect(() => {
    loadMore();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      title: "Poster",
      dataIndex: "posterUrl",
      key: "poster",
      width: 100,
      responsive: ["sm"] as any,
      render: (posterUrl: string) =>
        posterUrl ? (
          <div className="flex items-center justify-center">
            <img
              src={posterUrl}
              alt="Poster"
              className="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded-lg shadow-md hover:scale-110 transition-transform duration-300"
            />
          </div>
        ) : (
          <span className="text-gray-400 font-medium">-</span>
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (text: string) => (
        <span className="font-semibold text-gray-900 text-sm sm:text-base break-words">
          {text}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: string) => (
        <Tag
          color={type === "MOVIE" ? "blue" : "green"}
          className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 font-medium text-xs border-0"
        >
          <span className="hidden sm:inline">
            {type === "MOVIE" ? "Movie" : "TV Show"}
          </span>
          <span className="sm:hidden">{type === "MOVIE" ? "🎬" : "📺"}</span>
        </Tag>
      ),
    },
    {
      title: "Director",
      dataIndex: "director",
      key: "director",
      width: 150,
      responsive: ["md"] as any,
      render: (text: string) =>
        text || <span className="text-gray-300 italic">-</span>,
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      width: 130,
      responsive: ["lg"] as any,
      render: (budget: number) =>
        budget ? (
          <span className="text-emerald-600 font-semibold font-mono text-xs sm:text-sm">
            ${budget.toLocaleString()}
          </span>
        ) : (
          <span className="text-gray-300 italic">-</span>
        ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 150,
      responsive: ["md"] as any,
      render: (text: string) =>
        text || <span className="text-gray-300 italic">-</span>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 100,
      responsive: ["lg"] as any,
      render: (duration: number) =>
        duration ? (
          <span className="text-purple-600 font-medium text-xs sm:text-sm">
            {duration} min
          </span>
        ) : (
          <span className="text-gray-300 italic">-</span>
        ),
    },
    {
      title: "Year/Time",
      dataIndex: "yearTime",
      key: "yearTime",
      width: 120,
      responsive: ["lg"] as any,
      render: (text: string) =>
        text || <span className="text-gray-300 italic">-</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: window.innerWidth > 768 ? ("right" as const) : undefined,
      render: (_: any, record: any) => (
        <Space size="small" className="flex-col sm:flex-row">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="text-blue-600 hover:text-blue-800 font-medium transition-all hover:translate-x-0.5 p-1 sm:p-2 text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Popconfirm
            title="Delete this entry?"
            description="Are you sure you want to delete this entry?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              className="font-medium transition-all hover:translate-x-0.5 p-1 sm:p-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl sm:rounded-2xl shadow-lg border border-amber-200/50">
      <Table
        columns={columns}
        dataSource={entries}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
        footer={() =>
          hasMore ? (
            <div className="text-center pt-3 sm:pt-4 mt-2">
              <Button
                onClick={loadMore}
                loading={loading}
                className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white border-0 rounded-lg px-6 sm:px-8 py-1.5 sm:py-2 h-auto font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
              >
                Load More
              </Button>
            </div>
          ) : (
            <div className="text-center text-gray-500 font-medium italic pt-3 sm:pt-4 mt-2 text-xs sm:text-sm">
              No more entries
            </div>
          )
        }
      />
    </div>
  );
}
