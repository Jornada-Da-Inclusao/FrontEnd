import React from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
import { CustomModal } from "@/components/Modal-custom-alert/CustomModal.jsx";

export function LoadingModal({ show }) {
  return (
    <CustomModal
      show={show}
      onClose={() => {}} // bloqueia fechar enquanto estiver carregando
      title=""
      message={
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PacmanLoader color="#36d7b7" size={50} />
        </div>
      }
      icon={null}
      color={null}
      doneButton={null}
    />
  );
}
