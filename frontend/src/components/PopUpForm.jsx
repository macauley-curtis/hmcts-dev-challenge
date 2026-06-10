import { useState } from "react";
import Popup from "reactjs-popup";

export function PopUpForm({ formContent, formName }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Popup
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        trigger={<button>{formName}</button>}
        position="bottom right"
        offsetX={500}
        offsetY={12}
        contentStyle={{
          background: "var(--bg)",
          color: "var(--text-h)",
          padding: "12px",
          borderRadius: "6px",
          boxShadow: "var(--shadow)",
          border: "1px solid var(--border)",
          width: "1000px",
          whiteSpace: "normal",
        }}
      >
        <div>
          <div>{formContent(handleSuccess)}</div>
          <div className="popup-actions">
            <button type="button" onClick={() => setIsOpen(false)}>
              Close Form
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
}
