export const cadastrarDependente = (dependente) => {
  const token = localStorage.getItem("token");
  return fetch("https://backend-9qjw.onrender.com/dependente", {
    method: "POST",
    headers: {
      "Authorization": token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dependente)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      return data; // Aqui você pode trabalhar com o JSON retornado
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getUserData = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");
  if (!usuario || !token) {
    console.error("Usuário ou token não encontrado no localStorage.");
    return null;
  }
  return { usuario, token };
};

export const fetchDependentes = () => {
  const { usuario, token } = getUserData() || {};

  if (!usuario || !token) {
    console.error("Usuário ou token não encontrado no localStorage.");
    return Promise.resolve([]); // Retorna uma Promise resolvida com um array vazio
  }
debugger
  return fetch(
    `https://backend-9qjw.onrender.com/dependente/getDependenteByIdUsuario/${usuario.id}`,
    {
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      return res.json();
    })
    .catch((err) => {
      console.error("Erro ao buscar dependentes:", err);
      throw err;
    });
};

export const updateDependente = (selectedId, formData, avatarSelecionado) => {
  const { usuario, token } = getUserData() || {};
  if (!usuario || !token) {
    console.error("Usuário ou token não encontrado no localStorage.");
    return Promise.reject('Usuário ou token não encontrado');
  }

  return fetch(
    `https://backend-9qjw.onrender.com/dependente/${selectedId}`,
    {
      method: "PATCH",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: formData.nome,
        idade: formData.dataNascimento,
        sexo: formData.sexo,
        foto: avatarSelecionado,
        usuario_id_fk: usuario.id,
      }),
    }
  )
    .then((res) => {
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      return res.json();
    })
    .catch((err) => {
      console.error("Erro ao alterar dependente:", err);
      throw err;
    });
};

export const deleteDependente = (id) => {
  const token = localStorage.getItem('token');

  return fetch(`https://backend-9qjw.onrender.com/dependente/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        if (response.status === 204) {
          console.log('Dependente removido com sucesso');
          window.location.reload();
        }

        return response.json();
      } else {
        throw new Error('Erro ao remover dependente');
      }
    })
    .then((data) => {
      console.log('Dependente removido:', data);
    })
    .catch((error) => {
      console.error('Erro ao remover dependente:', error);
    });
};

export const escolherDependenteComoPlayer = (dependente) => {
  if (!dependente || !dependente.nome || !dependente.foto) {
    console.error("Dados do dependente inválidos.");
    return;
  }

  const player = {
    id: dependente.id,
    nome: dependente.nome,
    foto: dependente.foto
  };

  sessionStorage.setItem("player", JSON.stringify(player));
  console.log("Player definido:", player);
};
