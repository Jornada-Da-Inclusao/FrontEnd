// JogosModal.jsx
import React from "react";
import { CustomModal } from "./CustomModal";

export function JogosModal({
  modalConfirmDelete,
  setModalConfirmDelete,
  deleteJogo,
  modalSuccess,
  setModalSuccess,
  modalError,
  setModalError,
}) {
  return (
    <>
      <CustomModal
        show={modalConfirmDelete}
        onClose={() => setModalConfirmDelete(false)}
        title="Excluir jogada?"
        message="Tem certeza que deseja excluir esta jogada?"
        icon="🗑️"
        color="#f44336"
        firstButton={{
          label: "Cancelar",
          onClick: () => setModalConfirmDelete(false),
        }}
        secondButton={{
          label: "Excluir",
          onClick: deleteJogo,
        }}
      />

      <CustomModal
        show={modalSuccess}
        onClose={() => setModalSuccess(false)}
        title="Sucesso"
        message="A jogada foi excluída com sucesso."
        icon="✔️"
        color="#4caf50"
        doneButton={{
          label: "OK",
        }}
      />

      <CustomModal
        show={modalError}
        onClose={() => setModalError(false)}
        title="Erro"
        message="Ocorreu um erro ao excluir a jogada."
        icon="❌"
        color="#f44336"
        doneButton={{
          label: "OK",
        }}
      />
    </>
  );
}
