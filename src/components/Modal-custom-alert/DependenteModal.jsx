import { CustomModal } from './CustomModal';

const DependenteModals = ({
  showCreateConfirm, setShowCreateConfirm,
  showCreateError, setShowCreateError,
  showEditConfirm, setShowEditConfirm,
  showDeleteConfirm, setShowDeleteConfirm,
  showAddPerfilModal, setShowAddPerfilModal,
  onConfirmDelete, onConfirmAddPerfil
}) => {
  return (
    <>
      {/* Cadastro realizado */}
      {showCreateConfirm && (
        <CustomModal
          show={showCreateConfirm}
          onClose={() => setShowCreateConfirm(false)}
          title="Cadastro realizado!"
          message="O dependente foi cadastrado com sucesso."
          icon="🎉"
          color="#4caf50"
          doneButton={{
            label: "Fechar",
            onClick: () => setShowCreateConfirm(false)
          }}
        />
      )}

      {/* Erro no cadastro */}
      {showCreateError && (
        <CustomModal
          show={showCreateError}
          onClose={() => setShowCreateError(false)}
          title="Erro"
          message="Verifique se todos os campos foram preenchidos corretamente."
          icon="❌"
          color="#f44336"
          doneButton={{
            label: "OK",
            onClick: () => setShowCreateError(false)
          }}
        />
      )}

      {/* Atualização */}
      {showEditConfirm && (
        <CustomModal
          show={showEditConfirm}
          onClose={() => setShowEditConfirm(false)}
          title="Sucesso!"
          message="Dados atualizados com sucesso."
          icon="✔️"
          color="#4caf50"
          doneButton={{
            label: "Fechar",
            onClick: () => setShowEditConfirm(false)
          }}
        />
      )}

      {/* Exclusão */}
      {showDeleteConfirm && (
        <CustomModal
          show={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Tem certeza?"
          message="Deseja realmente excluir este dependente? Essa ação não pode ser desfeita."
          icon="⚠️"
          color="#f44336"
          firstButton={{
            label: "Cancelar",
            onClick: () => setShowDeleteConfirm(false)
          }}
          doneButton={{
            label: "Sim, excluir",
            onClick: () => {
              setShowDeleteConfirm(false);
              onConfirmDelete && onConfirmDelete();
            }
          }}
        />
      )}

      {/* Adicionar Novo Perfil */}
      {showAddPerfilModal && (
        <CustomModal
          show={showAddPerfilModal}
          onClose={() => setShowAddPerfilModal(false)}
          title="Adicionar Novo Jogador"
          message="Você deseja adicionar um novo perfil?"
          icon="➕"
          color="#007bff"
          firstButton={{
            label: "Cancelar",
            onClick: () => setShowAddPerfilModal(false)
          }}
          doneButton={{
            label: "Confirmar",
            onClick: () => {
              setShowAddPerfilModal(false);
              onConfirmAddPerfil && onConfirmAddPerfil();
            }
          }}
        />
      )}
    </>
  );
};

export default DependenteModals;
