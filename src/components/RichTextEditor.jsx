import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    ["link"],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
};

export default function RichTextEditor({ value, onChange, className = "h-40 mb-12" }) {
  return (
    <ReactQuill
      theme="snow"
      value={value || ""}
      onChange={onChange}
      modules={modules}
      className={className}
    />
  );
}
