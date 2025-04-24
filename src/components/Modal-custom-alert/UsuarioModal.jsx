import CustomModal from 'CustomModal';

const UsuarioModals = ({
  showConfirm, setShowConfirm,
  showDelete, setShowDelete,
  onConfirmDelete
}) => {
  return (
    <>
      <CustomModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Sucesso!"
        message="Seus dados foram atualizados com sucesso."
        icon="✅"
        color="#4caf50"
        doneButton={{
          label: "Fechar",
          onClick: () => setShowConfirm(false)
        }}
      />

      <CustomModal
        show={showDelete}
        onClose={() => setShowDelete(false)}
        title="Tem certeza?"
        message="Deseja realmente excluir sua conta? Essa ação é irreversível."
        icon="⚠️"
        color="#f44336"
        firstButton={{
          label: "Cancelar",
          onClick: () => setShowDelete(false)
        }}
        doneButton={{
          label: "Sim, excluir",
          onClick: () => {
            setShowDelete(false);
            onConfirmDelete();
          }
        }}
      />
    </>
  );
};

export default UsuarioModals;
