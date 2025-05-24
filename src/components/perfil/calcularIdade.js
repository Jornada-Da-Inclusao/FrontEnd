export function calcularIdade(dataNascimento) {
    const birthDate = new Date(dataNascimento);
    const today = new Date();
  
    let idade = today.getFullYear() - birthDate.getFullYear();
    const mes = today.getMonth() - birthDate.getMonth();
    const dia = today.getDate() - birthDate.getDate();
  
    if (mes < 0 || (mes === 0 && dia < 0)) {
      idade--;
    }
  
    return idade;
  }
  