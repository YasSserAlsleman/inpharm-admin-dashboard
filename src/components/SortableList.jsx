import React, { useState } from "react";
import axios from "../api/axiosClient";

export default function SortableList({
  items,
  setItems,
  type,
  renderItem,
}) {
  const [draggedId, setDraggedId] = useState(null);

  const moveItem = async (targetId) => {
    if (!draggedId || draggedId === targetId) return;

    const from = items.findIndex((item) => item._id === draggedId);
    const to = items.findIndex((item) => item._id === targetId);
    if (from < 0 || to < 0) return;

    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    setDraggedId(null);

    try {
      await axios.put(`/ordering/${type}`, {
        ids: next.map((item) => item._id),
      });
    } catch (error) {
      console.error("Failed to save order:", error);
      setItems(items);
    }
  };

  return items.map((item, index) => renderItem(item, index, {
    draggable: true,
    onDragStart: () => setDraggedId(item._id),
    onDragOver: (event) => event.preventDefault(),
    onDrop: () => moveItem(item._id),
    className: "cursor-grab active:cursor-grabbing",
  }));
}
