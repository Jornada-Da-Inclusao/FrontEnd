export const UsuarioStorage  = {
  get() {
    return JSON.parse(localStorage.getItem("usuario")) || null;
  },

  getId() {
    return this.get()?.id || null;
  },

  set(usuario) {
    localStorage.setItem("usuario", JSON.stringify(usuario));
  },

  clear() {
    localStorage.removeItem("usuario");
  },
};
